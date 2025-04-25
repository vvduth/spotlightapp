import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getAuthenticateduser } from "./users";
export const toggleBookmarkPost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const currentUser = await getAuthenticateduser(ctx);
    if (!currentUser) {
      throw new Error("User not found");
    }

    const existingpost = await ctx.db
      .query("bookmarks")
      .withIndex("by_user_and_post", (q) =>
        q.eq("userId", currentUser._id).eq("postId", postId)
      )
      .first();

    if (existingpost) {
      // post already bookmarked, remove it
      await ctx.db.delete(existingpost._id);
      return false;
    } else {
      // post not bookmarked, add it
      await ctx.db.insert("bookmarks", {
        userId: currentUser._id,
        postId: postId,
      });
      return true;
    }
    // if it not my post create a notification
  },
});

export const getBookmarks = query({
  handler: async (ctx) => {
    const currentuser = await getAuthenticateduser(ctx);

    const bookmarks = await ctx.db
      .query("bookmarks")
      .withIndex("by_user", (q) => q.eq("userId", currentuser._id))
      .order("desc")
      .collect();

    const bookmarksWithInfo = await Promise.all(
      bookmarks.map(async (bookmark) => {
        const post = await ctx.db.get(bookmark.postId);
        return post;
      })
    );
    return bookmarksWithInfo;
  },
});
