import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { Href, Link } from "expo-router";
import { Image } from "expo-image";
import { formatDistanceToNow } from "date-fns";
import { Id } from "@/convex/_generated/dataModel";

interface NotificationItemProps {
  notification: {
    sender: {
      _id: Id<"users">;
      username: string;
      image: string;
  };
  type: "like" | "comment" | "follow";
  _creationTime: number;
  comment?:string, 
  post: {
      _id: Id<"posts">;
      _creationTime: number;
      caption?: string | undefined;
      imageUrl: string;
      title: string;
      comments: number;
      userId: string;
      storageId: string;
      likes: number;
  } | null;
  };
}
const NotificationItem = ({ notification }: NotificationItemProps) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        backgroundColor: COLORS.accent,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          width: "80%",
          padding: 10,
        }}
      >
        <Link href={`/user/${notification.sender._id}` as Href} asChild>
          <TouchableOpacity style={{ flexDirection: "row", gap: 8 }}>
            <Image
              style={{ width: 40, height: 40, borderRadius: 20 }}
              source={notification.sender.image}
              contentFit="cover"
              transition={200}
              cachePolicy={"memory-disk"}
            />
            <View>
              {notification.type === "like" ? (
                <>
                  <Ionicons name="heart" size={20} color={COLORS.primary} />
                </>
              ) : notification.type === "follow" ? (
                <>
                  <Ionicons
                    name="person-add"
                    size={20}
                    color={COLORS.secondary}
                  />
                </>
              ) : (
                <>
                  <Ionicons
                    name="chatbubble"
                    size={20}
                    color={COLORS.success}
                  />
                </>
              )}
            </View>
          </TouchableOpacity>
        </Link>

        <View
          style={{
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: COLORS.accent,
            marginLeft: 10,
          }}
        >
          <Link href={`/notification`} asChild>
            <TouchableOpacity>
              <Text>{notification.sender.username}</Text>
            </TouchableOpacity>
          </Link>
          <Text>
            {notification.type === "follow"
              ? "started following you"
              : notification.type === "like"
                ? "liked your post"
                : `commented: "${notification.comment}"`}
          </Text>
          <Text>
            {formatDistanceToNow(notification._creationTime, {
              addSuffix: true,
            })}
          </Text>
        </View>
      </View>
      {notification.post && (
        <Image
          source={notification.post.imageUrl}
          style={{ width: 50, height: 50, borderRadius: 10 }}
          contentFit="cover"
          transition={200}
        />
      )}
    </View>
  );
};

export default NotificationItem;
