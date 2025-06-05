import { defineSchema, defineTable } from "convex/server"
import {v} from 'convex/values'

export default defineSchema ({
    users: defineTable({
        name: v.string(),
        email: v.string(),
        image: v.optional(v.string()),
        clerkId: v.string(),
        
    }).index('by_clerk_id', ['clerkId']),

    plans: defineTable({
        userId: v.id('users'),
        name: v.string(),
        workoutPlan: v.object({})

    })
})