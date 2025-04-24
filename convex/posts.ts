import { mutation } from "./_generated/server";
import { v } from "convex/values";
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
    const postId =  await ctx.db.insert("posts", {
      userId: currentUser._id,
      title: caption || "",
      storageId: storageId,
      caption: caption || "",
      imageUrl: imageUrl,
      likes: 0,
      comments: 0,
    });

    // increment user posts count by 1
    await ctx.db.patch(currentUser._id , {
        posts: currentUser.posts + 1,
    })

    return postId;
  },
});
