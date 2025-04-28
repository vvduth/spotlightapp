import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  FlatList,
} from "react-native";
import React from "react";
import { useMutation, useQueries, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Id } from "@/convex/_generated/dataModel";
import { Loader } from "@/components/Loader";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { Image } from "expo-image";

export default function UserProfileScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter()
  const profile = useQuery(api.users.getUserProfile, {
    userId: id as Id<"users">,
  });

  const posts = useQuery(api.posts.getPostByUserId, {
    userId: id as Id<"users">,
  });

  const isFollowing = useQuery(api.users.isFollowing, {
    followingId: id as Id<"users">,
  });

  const toggleFollow = useMutation(api.users.toggleFollow);
  const handleBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else{
        router.replace("/(tabs)")
    }
  };

  if (
    profile === undefined ||
    posts === undefined ||
    isFollowing === undefined
  ) {
    return <Loader />;
  }
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color={COLORS.error} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{profile.username}</Text>
        <View style={{ width: 24 }} />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.profileInfo}>
          <View style={styles.avatarAndStats}>
            <Image
              style={styles.avatar}
              source={profile.image}
              contentFit="cover"
              transition={200}
              cachePolicy={"memory-disk"}
            />
            <View style={styles.statsContainer}>
              <View style={styles.statItems}>
                <Text style={styles.statNumber}>{profile.posts}</Text>
                <Text style={styles.statLabel}>Posts</Text>
              </View>
              <View style={styles.statItems}>
                <Text style={styles.statNumber}>{profile.followers}</Text>
                <Text style={styles.statLabel}>Followers</Text>
              </View>
              <View style={styles.statItems}>
                <Text style={styles.statNumber}>{profile.following}</Text>
                <Text style={styles.statLabel}>Following</Text>
              </View>
            </View>
          </View>
          <Text style={styles.nameText}>{profile.fullname}</Text>
          {profile.bio && (
            <Text style={{ fontSize: 16, color: "#666" }}>{profile.bio}</Text>
          )}

          <Pressable
            style={{
              backgroundColor: isFollowing ? COLORS.accent : COLORS.primary,
              padding: 10,
              borderRadius: 8,
              alignItems: "center",
              marginTop: 16,
            }}
            onPress={() => toggleFollow({ followingId: id as Id<"users"> })}
          >
            <Text
              style={{
                fontSize: 16,
                color: isFollowing ? COLORS.primary : COLORS.accent,
                fontWeight: "bold",
                marginTop: 8,
              }}
              onPress={() => {
                toggleFollow({ followingId: id as Id<"users"> });
              }}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Text>
          </Pressable>
        </View>
        <View>
          {posts.length !== 0 ? (
            <FlatList
              data={posts}
              numColumns={3}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.gridItem}>
                  <Image
                    source={item.imageUrl}
                    style={{
                      width: "90%",
                      height: 120,
                      marginBottom: 2,
                    }}
                    contentFit="cover"
                    transition={200}
                    cachePolicy={"memory-disk"}
                  />
                </TouchableOpacity>
              )}
            />
          ) : (
            <>
              <View style={{
                flexDirection: "row",
                justifyContent: "space-between",
                padding: 16,
              
              }}>
                <Text>This user has {posts.length} Posts</Text>
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
  },
  profileInfo: {
    padding: 16,
  },
  avatarAndStats: {
    flexDirection: "row",
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 16,
  },
  statsContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItems: {
    flexDirection: "column",
    marginLeft: 16,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "bold",
    marginRight: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  postsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  gridItem: {
    width: "33.3%",
    padding: 2,
  },
});
