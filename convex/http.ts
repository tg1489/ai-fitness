import { httpRouter } from 'convex/server';
import { WebhookEvent } from '@clerk/nextjs/server';
import { Webhook } from 'svix';
import { api } from './_generated/api';
import { httpAction } from './_generated/server';

// Create a new HTTP router instance
const http = httpRouter();

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

// Vapi route
http.route({
    path:'/vapi/generate-program',
    method:'POST',
    handler: httpAction(async (ctx, request) => {
        try {
            const payload = await request.json();

            const {} = payload
        } catch (error) {
            
        }
    })
})

// Export the router to be used by Convex
export default http;
