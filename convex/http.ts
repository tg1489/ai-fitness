import { httpRouter } from 'convex/server';
import { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { api } from './_generated/api';
import { httpAction } from './_generated/server';
import {GoogleGenerativeAI} from '@google/generative-ai'

// Create a new HTTP router instance
const http = httpRouter();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

// Define a POST route at /clerk/webhook
http.route({
    path: '/clerk/webhook',
    method: 'POST',
    
    // This function handles the incoming webhook request
    handler: httpAction(async (ctx, request) => {
        // Get the Clerk webhook secret from environment variables
        const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new Error('Missing CLERK_WEBHOOK_SECRET environment variable');
        }

        // Extract Svix headers used to verify webhook authenticity
        const svix_id = request.headers.get('svix-id');
        const svix_signature = request.headers.get('svix-signature');
        const svix_timestamp = request.headers.get('svix-timestamp');

        // If any of the required headers are missing, reject the request
        if (!svix_id || !svix_signature || !svix_timestamp) {
            return new Response('No svix headers found', { status: 400 });
        }

        // Parse the webhook body as JSON
        const payload = await request.json();
        const body = JSON.stringify(payload);

        // Create a new Svix Webhook instance using the secret
        const wh = new Webhook(webhookSecret);
        let evt: WebhookEvent;

        try {
            // Verify the webhook using Svix (ensures it's from Clerk and unaltered)
            evt = wh.verify(body, {
                'svix-id': svix_id,
                'svix-timestamp': svix_timestamp,
                'svix-signature': svix_signature
            }) as WebhookEvent;
        } catch (error) {
            // If verification fails, log it and return an error
            console.error('Error verifying webhook:', error);
            return new Response('Error occurred', { status: 400 });
        }

        // Determine the type of event (e.g., user.created, user.updated)
        const eventType = evt.type;

        // Handle user.created event by syncing user data to Convex DB
        if (eventType === 'user.created') {
            const { id, first_name, last_name, image_url, email_addresses } = evt.data;

            // Use the first email address in the array
            const email = email_addresses[0].email_address;

            // Concatenate first and last names, trim any whitespace
            const name = `${first_name || ''} ${last_name || ''}`.trim();

           
            try {
                // Call a Convex mutation to store the user info in the database
                await ctx.runMutation(api.users.syncUser, {
                    clerkId: id,
                    email,
                    name,
                    image: image_url
                });
                return new Response('User created and synced to Convex', { status: 200 });
            } catch (error) {
                // If saving the user fails, log the error and return 500
                console.log('Error creating user:', error);
                return new Response('Error creating user', { status: 500 });
            }
        }

        // Return success response if webhook is processed without error
        return new Response('Webhooks processed successfully', { status: 200 });
    })
});

  // Validate and fix workout plan to ensure it has proper numeric types
  function validateWorkoutPlan(plan: any) {
    const validatedPlan = {
        schedule: plan.schedule,
        exercises: plan.exercises.map((exercise: any) => ({
          day: exercise.day,
          routines: exercise.routines.map((routine: any) => ({
            name: routine.name,
            sets: typeof routine.sets === "number" ? routine.sets : parseInt(routine.sets) || 1,
            reps: typeof routine.reps === "number" ? routine.reps : parseInt(routine.reps) || 10,
          })),
        })),
      };
      return validatedPlan;
    }

    // validate diet plan to ensure it strictly follows schema
    function validateDietPlan(plan: any) {
// only keep the fields we want
const validatedPlan = { 
dailyCalories: plan.dailyCalories,
meals: plan.meals.map((meal: any) => ({
    name: meal.name,
    foods: meal.foods,
})),
};
return validatedPlan;
}

// Vapi route
http.route({
    path:'/vapi/generate-program',
    method:'POST',
    handler: httpAction(async (ctx, request) => {
        try {
            const payload = await request.json();

            const {
                user_id, age, height, weight, injuries, workout_days, fitness_goal, fitness_level,
                dietary_restrictions
            } = payload

            const model = genAI.getGenerativeModel({
                model: 'gemini-2.0-flash-001',
                generationConfig: {
                    temperature: 0.4, // Lower temp for more predictable outputs
                    topP: 0.9,
                    responseMimeType: 'application/json'
                }
            })

            const workoutPrompt = `You are an experienced fitness coach creating a personalized workout plan based on:
            Age: ${age}
            Height: ${height}
            Weight: ${weight}
            Injuries or limitations: ${injuries}
            Available days for workout: ${workout_days}
            Fitness goal: ${fitness_goal}
            Fitness level: ${fitness_level}

            As a professional coach:
            - Consider muscle group splits to avoid overtraining the same muscles on consecutive days
            - Design exercises that match the fitness level and account for any injuries
            - Structure the workouts to specifically target the user's fitness goal

            CRITICAL SCHEMA INSTRUCTIONS:
            - Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS
            - "sets" and "reps" MUST ALWAYS be NUMBERS, never strings
            - For example: "sets": 3, "reps": 10
            - Do NOT use text like "reps": "As many as possible" or "reps": "To failure"
            - Instead use specific numbers like "reps": 12 or "reps": 15
            - For cardio, use "sets": 1, "reps": 1 or another appropriate number
            - NEVER include strings for numerical fields
            - NEVER add extra fields not shown in the example below

            Return a JSON object with this EXACT structure:
            {
              "schedule": ["Monday", "Wednesday", "Friday"],
              "exercises": [
                {
                  "day": "Monday",
                  "routines": [
                    {
                        "name": "Exercise Name",
                        "sets": 3,
                        "reps": 10
                      }
                    ]
                  }
                ]
              }

              DO NOT add any fields that are not in this example. Your response must be a valid JSON object with no additional text.
            `;

            const workoutResult = await model.generateContent(workoutPrompt)
            const workoutPlanText = workoutResult.response.text();

            // Validate the input coming from AI
            let workoutPlan = JSON.parse(workoutPlanText)
            workoutPlan = validateWorkoutPlan(workoutPlan)

            const dietPrompt = `You are an experienced nutrition coach creating a personalized diet plan based on:
            Age: ${age}
            Height: ${height}
            Weight: ${weight}
            Fitness goal: ${fitness_goal}
            Dietary restrictions: ${dietary_restrictions}

            As a professional nutrition coach:
            - Calculate appropriate daily calorie intake based on the person's stats and goals
            - Create a balanced meal plan with proper macronutrient distribution
            - Include a variety of nutrient-dense foods while respecting dietary restrictions
            - Consider meal timing around workouts for optimal performance and recovery

            CRITICAL SCHEMA INSTRUCTIONS:
            - Your output MUST contain ONLY the fields specified below, NO ADDITIONAL FIELDS
            - "dailyCalories" MUST be a NUMBER, not a string
            - DO NOT add fields like "supplements", "macros", "notes", or ANYTHING else
            - ONLY include the EXACT fields shown in the example below
            - Each meal should include ONLY a "name" and "foods" array

            Return a JSON object with this EXACT structure and no other fields:
            {
                "dailyCalories": 2000,
                "meals": [
                  {
                    "name": "Breakfast",
                    "foods": ["Oatmeal with berries", "Greek yogurt", "Black coffee"]
                  },
                  {
                    "name": "Lunch",
                    "foods": ["Grilled chicken salad", "Whole grain bread", "Water"]
                  }
                ]
            }
            DO NOT add any fields that are not in this example. Your response must be a valid JSON object with no additional text.`;

            const dietResult = await model.generateContent(dietPrompt)
            const dietPlanText = dietResult.response.text()
            let dietPlan = JSON.parse(dietPlanText)
            dietPlan = validateDietPlan(dietPlan)
            console.log(`Validated diet plan: ${dietPlan}`)



        }

         catch (error) {
            console.log('Error creating the plan', error)
        }
    })
})

// Send data to Gemini


// Export the router to be used by Convex
export default http;
