import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { Href, Link } from "expo-router";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { Id } from "@/convex/_generated/dataModel";
import { toggleLikePost } from "@/convex/posts";
import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import CommentsModal from "./CommentsModal";
import { formatDistanceToNow } from "date-fns";
import { useUser } from "@clerk/clerk-expo";

type PostProps = {
  post: {
    _id: Id<"posts">;
    _creationTime: number;
    caption?: string | undefined;
    userId: Id<"users">;
    title: string;
    storageId: Id<"_storage">;
    imageUrl: string;
    likes: number;
    comments: number;
    author: {
      _id: string;
      username: string;
      image: string;
    };
    isLiked: boolean;
    isBookmarked: boolean;
  };
};

export default function Post({ post }: PostProps) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [commentsCount, setCommentsCount] = useState(post.comments);
  const [showComments, setShowComments] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(post.isBookmarked);

  // user data from clerk
  const { user } = useUser();

  // user data from convex
  const convexCurrentUser = useQuery(
    api.users.getUserByClerkId,
    user ? { clerkId: user?.id } : "skip"
  );

  const toggleLike = useMutation(api.posts.toggleLikePost);
  const toggleBookmark = useMutation(api.bookmarks.toggleBookmarkPost);
  const deletePost = useMutation(api.posts.deletePost);

  const handleLike = async () => {
    try {
      const newIsLiked = await toggleLike({ postId: post._id });
      setIsLiked(newIsLiked);
      setLikeCount((prev) => prev + (newIsLiked ? 1 : -1));
    } catch (error) {
      console.log("Error liking post: ", error);
    }
  };

  const handlebookmark = async () => {
    const newIsBookmarked = await toggleBookmark({ postId: post._id });
    setIsBookmarked(newIsBookmarked);
  };

  const handleDelete = async () => {
    try {
      await deletePost({ postId: post._id });
    } catch (error) {
      console.log("Error deleting post: ", error);
    }
  }

  return (
    <View style={{ marginBottom: 16 }}>
      {/* header */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Link style={{ padding: 8 }} href={
          convexCurrentUser?._id === post.author._id ? `/(tabs)/profile` : `/user/${post.author._id}` as Href
        } asChild>
          <TouchableOpacity style={{ flexDirection: "row", gap: 8 }}>
            {/* author avatar */}
            <Image
              style={{ width: 40, height: 40, borderRadius: 20 }}
              source={post.author.image}
              contentFit="cover"
              transition={200}
              cachePolicy={"memory-disk"}
            />
            <Text
              style={{
                fontSize: 16,
                fontWeight: "bold",
                color: COLORS.primary,
              }}
            >
              {post.author.username}
            </Text>
          </TouchableOpacity>
        </Link>

        {post.author._id === convexCurrentUser?._id ? (
          <TouchableOpacity style={{ padding: 8 }}
            onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color={COLORS.primary} />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={{ padding: 8 }}>
            <Ionicons
              name="ellipsis-horizontal"
              size={20}
              color={COLORS.primary}
            />
          </TouchableOpacity>
        )}
      </View>

      {/* post imae */}
      <Image
        style={{ width: "100%", height: 400, borderRadius: 16 }}
        source={post.imageUrl}
        contentFit="cover"
        transition={200}
        cachePolicy={"memory-disk"}
      />

      {/* Post action */}
      <View style={{ flexDirection: "row", gap: 16, marginTop: 8 }}>
        <TouchableOpacity onPress={handleLike}>
          <Ionicons
            name={isLiked ? "heart" : "heart-outline"}
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setShowComments(true)}>
          <Ionicons
            name="chatbubble-outline"
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handlebookmark}>
          <Ionicons
            name={isBookmarked ? "bookmark" : "bookmark-outline"}
            size={24}
            color={COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      {/* post info */}
      <View style={{ marginTop: 8 }}>
        {likeCount > 0 ? (
          <Text style={{ fontWeight: "bold", color: COLORS.primary }}>
            {likeCount} {likeCount > 1 ? "likes" : "like"}
          </Text>
        ) : (
          <Text
            style={{
              fontWeight: "bold",
              color: COLORS.primary,
            }}
          >
            Be the first to like
          </Text>
        )}
        {post.caption && (
          <View style={{ flexDirection: "row", marginTop: 4 }}>
            <Text
              style={{
                fontWeight: "bold",
                color: COLORS.primary,
                marginRight: 4,
              }}
            >
              {post.author.username}
            </Text>
            <Text>{post.caption}</Text>
          </View>
        )}

        <TouchableOpacity>
          <Text
            style={{
              color: COLORS.primary,
              fontSize: 14,
              marginTop: 4,
            }}
          >
            View {commentsCount} {commentsCount > 1 ? "comments" : "comment"}
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            color: COLORS.secondary,
            fontSize: 12,
            marginTop: 4,
          }}
        >
          {" "}
          {formatDistanceToNow(post._creationTime, { addSuffix: true })}{" "}
        </Text>
      </View>
      <CommentsModal
        postId={post._id}
        visible={showComments}
        onClose={() => setShowComments(false)}
        onCommentAdded={() => setCommentsCount((prev) => prev + 1)}
      />
    </View>
  );
}
