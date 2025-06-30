import { mutation } from "./_generated/server";
import { v } from "convex/values";


export const createPlan = mutation({
    args: {
        userId: v.string(),
        name: v.string(),
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
    },
    handler: async (ctx, req) => {

    }
})