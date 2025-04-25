import { View, Text, ScrollView } from "react-native";
import React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader } from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { Image } from "expo-image";

export default function Bookmarks() {
  const bookmarkedPosts = useQuery(api.bookmarks.getBookmarks);

  if (!bookmarkedPosts || bookmarkedPosts.length === 0)
    return <NoBookmarksFound />;
  if (bookmarkedPosts === undefined) {
    return <Loader />;
  }
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.accent,
        paddingTop: 10,
        paddingHorizontal: 10,
      }}
    >
      {/* header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          paddingVertical: 10,
          paddingHorizontal: 20,
          backgroundColor: COLORS.accent,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            color: COLORS.textPrimary,
          }}
        >
          Bookmarks
        </Text>
      </View>
      {/* Post */}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 100,
          paddingTop: 10,
          paddingHorizontal: 10,
          backgroundColor: COLORS.accent,
        }}
      >
        {bookmarkedPosts.map((post) => {
          if (!post) return null;
          return (
            <View key={post._id} style={{ marginBottom: 20 }}>
              <Image
                source={post.imageUrl}
                style={{ width: "100%", height: 200, borderRadius: 10 }}
                contentFit="cover"
                transition={200}
                cachePolicy={"memory-disk"}
              />
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

function NoBookmarksFound() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.accent,
        padding: 20,
      }}
    >
      <Text
        style={{
          fontSize: 18,
          fontWeight: "bold",
          color: COLORS.textSecondary,
        }}
      >
        No bookmarks found
      </Text>
    </View>
  );
}
