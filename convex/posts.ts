import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticateduser } from "./users";
export const generateuploadUrl = mutation(async (ctx) => {
  const indentity = await ctx.auth.getUserIdentity();
  if (!indentity) {
    throw new Error("Not authenticated");
  }
  return await ctx.storage.generateUploadUrl();
});

export const createPost = mutation({
  args: {
    caption: v.optional(v.string()),
    storageId: v.id("_storage"),
  },
  handler: async (ctx, { caption, storageId }) => {
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

    const imageUrl = await ctx.storage.getUrl(storageId);
    if (!imageUrl) {
      throw new Error("Image not found");
    }
    // craete post
    const postId = await ctx.db.insert("posts", {
      userId: currentUser._id,
      title: caption || "",
      storageId: storageId,
      caption: caption || "",
      imageUrl: imageUrl,
      likes: 0,
      comments: 0,
    });

    // increment user posts count by 1
    await ctx.db.patch(currentUser._id, {
      posts: currentUser.posts + 1,
    });

    return postId;
  },
});

export const getFeedPosts = query({
  handler: async (ctx) => {
    const currentuser = await getAuthenticateduser(ctx);

    const posts = await ctx.db.query("posts").order("desc").collect();

    if (!posts || posts.length === 0) {
      throw new Error("No posts found");
    }

    // enhace posts with user data and interaction data
    const postWithInfo = await Promise.all(
      posts.map(async (post) => {
        const postAuthor = (await ctx.db.get(post.userId))!;
        const isLiked = await ctx.db
          .query("likes")
          .withIndex("by_user_and_post", (q) =>
            q.eq("userId", currentuser._id).eq("postId", post._id)
          )
          .first();
        const isBookmarked = await ctx.db
          .query("bookmarks")
          .withIndex("by_user_and_post", (q) =>
            q.eq("userId", currentuser._id).eq("postId", post._id)
          )
          .first();
        return {
          ...post,
          author: {
            _id: postAuthor?._id,
            username: postAuthor?.username,
            image: postAuthor?.image,
          },
          isLiked: !!isLiked,
          isBookmarked: !!isBookmarked,
        };
      })
    );

    return postWithInfo;
  },
});

export const toggleLikePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, args) => {
    const currentUser = await getAuthenticateduser(ctx);
    const exisiting = await ctx.db
      .query("likes")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", currentUser._id).eq("postId", args.postId)
      )
      .first();
    const post = await ctx.db.get(args.postId);
    if (!post) {
      throw new Error("Post not found");
    }
    if (exisiting) {
      // unlike post
      await ctx.db.delete(exisiting._id);
      await ctx.db.patch(post._id, { likes: post.likes - 1 });
    } else {
      // like post
      await ctx.db.insert("likes", {
        userId: currentUser._id,
        postId: args.postId,
      });
      await ctx.db.patch(post._id, { likes: post.likes + 1 });

      // if it not my post create a notification
      if (currentUser._id !== post.userId) {
        await ctx.db.insert("notifications", {
          receiverId: post.userId,
          senderId: currentUser._id,
          type: "like",
          postId: args.postId,
        });
      }
    }
    return exisiting ? false : true;
  },
});

export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const currentUser = await getAuthenticateduser(ctx);
    const post = await ctx.db.get(postId);
    if (!post) {
      throw new Error("Post not found");
    }
    if (post.userId !== currentUser._id) {
      throw new Error("You are not the owner of this post");
    }

    // delete all likes
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .collect();

    for (const like of likes) {
      await ctx.db.delete(like._id);
    }

    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .collect();
    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // delete storage image
    await ctx.storage.delete(post.storageId);

    // delete post
    await ctx.db.delete(postId);

    // delete all notifications related to this post
    const notifications = await ctx.db
      .query("notifications")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .collect();

    for (const notification of notifications) {
      await ctx.db.delete(notification._id);
    }

    // decrement user posts count by 1
    await ctx.db.patch(currentUser._id, {
      posts: Math.max(currentUser.posts - 1, 0),
    });
  },
});

export const getPostByUserId = query({
  args: {
    userId: v.optional(v.id("users")),
  },

  handler: async (ctx, { userId }) => {
    const user = userId ? await ctx.db.get(userId): await getAuthenticateduser(ctx);

    if (!user) {
      throw new Error("User not found");
    }
    const posts = await ctx.db
      .query("posts")
      .withIndex("by_user", (q) => q.eq("userId", userId||user._id))
      .order("desc")
      .collect();

    if (!posts || posts.length === 0) {
      return  [];
    }
    return posts;
  },
});
