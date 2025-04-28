import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Loader } from "@/components/Loader";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { Image } from "expo-image";

export default function Profile() {
  const { signOut, userId } = useAuth();
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const currentUser = useQuery(
    api.users.getUserByClerkId,
    userId ? { clerkId: userId } : "skip"
  );

  const [editedProfile, setEditedProfile] = useState({
    fullname: currentUser?.fullname || "",
    bio: currentUser?.bio || "",
  });

  const [selectedPost, setSelectedPost] = useState<Doc<"posts"> | null>(null);
  const posts = useQuery(api.posts.getPostByUserId, {});
  const updatProfile = useMutation(api.users.updateProfile);

  const handleEditProfile = async () => {};

  if (!currentUser || posts === undefined) {
    return <Loader />;
  }

  return (
    <View style={{ flex: 1, padding: 20, backgroundColor: COLORS.background }}>
      {/* header */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
        }}
      >
        {/* left header side */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text
            style={{
              fontSize: 24,
              fontWeight: "bold",
              color: COLORS.primary,
              marginRight: 10,
            }}
          >
            {currentUser.username}
          </Text>
        </View>
        {/* right header side */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <TouchableOpacity style={{ marginRight: 20 }}>
            <Ionicons name="log-out-outline" size={24} color={COLORS.accent} />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{
          flex: 1,
          gap: 50,
          flexDirection: "row"
        }}>
          {/* avatar */}
          <View>
            <Image
              source={currentUser.image}
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                marginBottom: 10,
              }}
              contentFit="cover"
              transition={200}
            />
          </View>

          {/* statisics of user */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 20,
              gap: 35
            }}
          >
            {/* number of post */}
            <View style={{ alignItems: "center" }}>
              <Text>{currentUser.posts}</Text>
              <Text>Posts</Text>
            </View>
            {/*  followers */}
            <View style={{ alignItems: "center" }}>
              <Text>{currentUser.followers}</Text>
              <Text>Followers</Text>
            </View>
            {/* following */}
            <View style={{ alignItems: "center" }}>
              <Text>{currentUser.following}</Text>
              <Text>Following</Text>
            </View>
          </View>
        </View>
        <View>
          <Text style={{
            fontSize: 20,
            fontWeight: "bold",
            color: COLORS.accent,
            marginBottom: 10,
          
          }}>{currentUser.fullname}</Text>
          {currentUser.bio && (
            <Text>{currentUser.bio}</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
