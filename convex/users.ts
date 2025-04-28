import { Id } from "./_generated/dataModel";
import { mutation, MutationCtx, query, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

// Create a new task with the given text
export const createUser = mutation({
  args: {
    fullname: v.string(),
    username: v.string(),
    image: v.string(),
    email: v.string(),
    bio: v.optional(v.string()),
    clerkId: v.string(),
  },

  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (existingUser) {
      return;
    }
    await ctx.db.insert("users", {
      fullname: args.fullname,
      username: args.username,
      image: args.image,
      email: args.email,
      bio: args.bio,
      clerkId: args.clerkId,
      followers: 0,
      following: 0,
      posts: 0,
    });
  },
});

export const getUserByClerkId = query({
  args: { clerkId: v.string() },
  handler: async (ctx, { clerkId }) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerk_id", (q) => q.eq("clerkId", clerkId))
      .first();
    return user;
  },
});

export async function getAuthenticateduser(ctx: QueryCtx | MutationCtx) {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) {
    throw new Error("Not authenticated");
  }

  const currentUser = await ctx.db
    .query("users")
    .withIndex("by_clerk_id", (q) => q.eq("clerkId", identity.subject))
    .first();
  if (!currentUser) {
    throw new Error("User not found");
  }
  return currentUser;
}

export const updateProfile = mutation({
  args: {
    fullname: v.optional(v.string()),
    bio: v.optional(v.string()),
  },
  handler: async (ctx, { fullname, bio }) => {
    const currentUser = await getAuthenticateduser(ctx);
    if (!currentUser) {
      throw new Error("User not found");
    }
    await ctx.db.patch(currentUser._id, {
      fullname: fullname,
      bio: bio,
    });
  },
});

export const getUserProfile = query({
  args: { userId: v.id("users") },
  handler: async (ctx, { userId }) => {
    const user = await ctx.db.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  },
});

export const isFollowing = query({
  args: { followingId: v.id("users") },
  handler: async (ctx, { followingId }) => {
    const currentUser = await getAuthenticateduser(ctx);

    const follow = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", currentUser._id).eq("followingId", followingId)
      )
      .first();

    return !!follow;
  },
});

export const toggleFollow = mutation({
  args: { followingId: v.id("users") },
  handler: async (ctx, { followingId }) => {
    const currentUser = await getAuthenticateduser(ctx);

    const follow = await ctx.db
      .query("follows")
      .withIndex("by_both", (q) =>
        q.eq("followerId", currentUser._id).eq("followingId", followingId)
      )
      .first();

    if (follow) {
      await ctx.db.delete(follow._id);
      await updateFollowCount(ctx, currentUser._id, followingId, false);
    } else {
      await ctx.db.insert("follows", {
        followerId: currentUser._id,
        followingId: followingId,
      });
      await updateFollowCount(ctx, currentUser._id, followingId, true);

      // create notification
      await ctx.db.insert("notifications", {
        receiverId: followingId,
        senderId: currentUser._id,
        type: "follow",
      });
    }
  },
});

const updateFollowCount = async (
  ctx: MutationCtx,
  followerId: Id<"users">,
  followingID: Id<"users">,
  isFollow: boolean
) => {
  const follower = await ctx.db.get(followerId);
  const following = await ctx.db.get(followingID);
  if (!follower || !following) {
    throw new Error("User not found");
  }
  if (follower && following) {
    if (isFollow) {
      await ctx.db.patch(followerId, { following: follower.following + 1 });
      await ctx.db.patch(followingID, { followers: following.followers + 1 });
    } else {
      await ctx.db.patch(followerId, { following: follower.following - 1 });
      await ctx.db.patch(followingID, { followers: following.followers - 1 });
    }
  }
};
