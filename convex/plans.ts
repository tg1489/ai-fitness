import { mutation } from "./_generated/server";
import { v } from "convex/values";


export const createPlan = mutation({
    args: {
        userId: v.string(),
        name: v.string(),
        workoutPlan: v.object({
          schedule: v.array(v.string()),
          exercises: v.array(
            v.object({
              day: v.string(),
              routines: v.array(
                v.object({
                  name: v.string(),
                  sets: v.number(),
                  reps: v.number(),
                })
              ),
            })
          ),
        }),
        dietPlan: v.object({
          dailyCalories: v.number(),
          meals: v.array(
            v.object({
              name: v.string(),
              foods: v.array(v.string()),
            })
          ),
        }),
        isActive: v.boolean(),
      },
    handler: async (ctx, args) => {
        // Deactivate old plans
        const activePlans = await ctx.db
        await ctx.db.insert('plans', args)
    }
})