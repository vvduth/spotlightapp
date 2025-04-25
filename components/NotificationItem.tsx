import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { Link } from "expo-router";
import { Image } from "expo-image";

interface NotificationItemProps {
  notification: any;
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
          justifyContent: "space-between",
          width: "100%",
          padding: 10,
        }}
      >
        <Link href={`/notification`} asChild>
          <TouchableOpacity style={{ flexDirection: "row", gap: 8 }}>
            <Image
              style={{ width: 40, height: 40, borderRadius: 20 }}
              source={notification.sender.image}
              contentFit="cover"
              transition={200}
              cachePolicy={"memory-disk"}
            />
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                backgroundColor: COLORS.accent,
              }}
            >
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
                    color={COLORS.textSecondary}
                  />
                </>
              )}
            </View>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
};

export default NotificationItem;
