import { v } from "convex/values"
import { query, QueryCtx } from "./_generated/server"

import { getAuthUserId } from "@convex-dev/auth/server"
import { Id } from "./_generated/dataModel"

// INFO: Use this function to get data of a specific user
const populateUser = (ctx: QueryCtx, id: Id<"users">) => {
	return ctx.db.get(id)
}

// HACK: Try not to throw error when using query, only when using mutation
export const get = query({
	args: { workspaceId: v.id("workspaces") },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			return []
		}

		const member = await ctx.db
			.query("members")
			.withIndex("by_workspace_id_user_id", (q) =>
				q.eq("workspaceId", args.workspaceId).eq("userId", userId)
			)
			.unique()

		if (!member) {
			return []
		}

		const data = await ctx.db
			.query("members")
			.withIndex("by_workspace_id", (q) => q.eq("workspaceId", args.workspaceId))
			.collect()

		const members = []

		// INFO: Here we get the user data for each member and add it to the response
		for (const member of data) {
			const user = await populateUser(ctx, member.userId)

			if (!user) {
				continue
			}

			members.push({ ...member, user })
		}

		return members
	},
})

// HACK: Try not to throw error when using query, only when using mutation
export const current = query({
	args: { workspaceId: v.id("workspaces") },
	handler: async (ctx, args) => {
		const userId = await getAuthUserId(ctx)

		if (!userId) {
			return null
		}

		const member = await ctx.db
			.query("members")
			.withIndex("by_workspace_id_user_id", (q) =>
				q.eq("workspaceId", args.workspaceId).eq("userId", userId)
			)
			.unique()

		if (!member) {
			return null
		}

		return member
	},
})
