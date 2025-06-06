// Functions related to users go inside here

import { mutation } from "./_generated/server";
import { v } from 'convex/values';

export const syncUser = mutation({
    args: {
        name: v.string(),
        email: v.string(),
        clerkId: v.string(),
        image: v.optional(v.string()),
    }, 

    handler: async (ctx, args) => {
        // Check if user existed already
        const existingUser = await ctx.db.query('users')
        .filter((q) => q.eq(q.field('clerkId'), args.clerkId))
        .first(); // Once we find anything craft the first result

        if (existingUser) return // Dont do anything

        return await ctx.db.insert('users', args) ;
    }
})