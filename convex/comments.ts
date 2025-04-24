import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticateduser } from "./users";
export const addComment = mutation({
  args: {
    text: v.string(),
    postId: v.id("posts"),
  },
  handler: async (ctx, { text, postId }) => {
    const currentUser = await getAuthenticateduser(ctx);

    const post = await ctx.db.get(postId);
    if (!post) {
      throw new Error("Post not found");
    }
    const commentId = await ctx.db.insert("comments", {
      postId,
      userId: currentUser._id,
      text,
    });

    await ctx.db.patch(postId, { comments: post.comments + 1 });

    if (post.userId !== currentUser._id) {
      await ctx.db.insert("notifications", {
        receiverId: post.userId,
        senderId: currentUser._id,
        type: "comment",
        postId: postId,
        commentId: commentId,
      });
    }

    return commentId;
  },
});

export const getComments = query({
  args: {
    postId: v.id("posts"),
  },
  handler: async (ctx, { postId }) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_post", (q) => q.eq("postId", postId))
      .collect();

    const commentwithInfo = await Promise.all(
      comments.map(async (comment) => {
        const user = await ctx.db.get(comment.userId);

        if (!user) {
          throw new Error("User not found");
        }
        return {
          ...comment,
          user: {
            username: user.username,
            image: user.image,
          },
        };
      })
    );
    return commentwithInfo;
  },
});
