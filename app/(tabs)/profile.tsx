import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { Loader } from "@/components/Loader";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { Image } from "expo-image";

import NoPostFound from "@/components/NoPostFound";

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
        <View
          style={{
            flex: 1,
            gap: 50,
            flexDirection: "row",
          }}
        >
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
              gap: 35,
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
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: COLORS.accent,
              marginBottom: 10,
            }}
          >
            {currentUser.fullname}
          </Text>
          {currentUser.bio && <Text>{currentUser.bio}</Text>}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              alignItems: "center",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.primary,
                padding: 10,
                borderRadius: 5,
                width: "45%",
                alignItems: "center",
              }}
              onPress={() => setIsEditModalVisible(true)}
            >
              <Text
                style={{
                  color: COLORS.background,
                  fontWeight: "bold",
                }}
              >
                Edit profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                backgroundColor: COLORS.accent,
                padding: 10,
                borderRadius: 5,
                width: "45%",
                alignItems: "center",
              }}
            >
              <Ionicons name="share-outline" size={20} color={"white"} />
            </TouchableOpacity>
          </View>
        </View>
        {posts.length === 0 && <NoPostFound />}
        <FlatList
          data={posts}
          numColumns={3}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={{
                width: 120,
                height: 120,
                marginTop: 10,
                gridAutoColumns: "3",
                margin: 2,
              }}
              onPress={() => setSelectedPost(item)}
            >
              <Image
                source={item.imageUrl}
                contentFit="cover"
                transition={200}
                style={{
                  width: 120,
                  height: 120,
                }}
              />
            </TouchableOpacity>
          )}
        />
      </ScrollView>
      {/* edit profile modal */}
      <Modal
      visible={isEditModalVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setIsEditModalVisible(false)}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.modalContainer}
          >
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                  <Ionicons name="close" size={24} color={COLORS.textSecondary} />
                </TouchableOpacity>
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Name</Text>
                <TextInput
                  style={styles.input}
                  value={editedProfile.fullname}
                  onChangeText={(text) =>
                    setEditedProfile((prev) => ({ ...prev, fullname: text }))
                  }
                  placeholder="Enter your name"

              />
              </View>
              <View style={styles.inputContainer}>
                <Text style={styles.inputLabel}>Bio</Text>
                <TextInput
                  style={styles.bioInput}
                  value={editedProfile.bio}
                  onChangeText={(text) =>
                    setEditedProfile((prev) => ({ ...prev, bio: text }))
                  }
                  numberOfLines={4}
                  placeholder="Enter your bio"
                  multiline/>
              </View>
              <TouchableOpacity 
                onPress={handleEditProfile}
              style={styles.saveButton}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </Modal>
      

      {/* selected image modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!selectedPost}
        onRequestClose={() => setSelectedPost(null)}>
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
            }}
          >
            {selectedPost && (
              <View style={{
                width: "80%",
                height: "60%",
                backgroundColor: COLORS.background,
                justifyContent: "center",
                alignItems: "center",
              }}>
                <View
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    backgroundColor: COLORS.background,
                    borderRadius: 50,
                    padding: 10,
                  }}
                >
                  <TouchableOpacity onPress={() => setSelectedPost(null)}>
                    <Ionicons
                      name="close-outline"
                      size={24}
                      color={COLORS.accent}
                      style={{ margin: 10 }}
                    />
                  </TouchableOpacity>
                </View>
                <Image 
                  source={selectedPost.imageUrl}
                  cachePolicy={"memory-disk"}
                  style={{
                    width: "90%",  
                    height: "80%",}}

                />
                </View>
            )}
          </View>
        </Modal>
    </View>
  );
}


const styles =StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: COLORS.background,
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
  },
  inputContainer: {
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 16,
    color: COLORS.primary,
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: COLORS.primary,
  },
  bioInput:{
      borderWidth:1,
      borderColor:"#ccc",
      borderRadius:5,
      paddingHorizontal :10,
      paddingVertical :8,
      color :COLORS.primary
  },
  saveButton: {
    backgroundColor: COLORS.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  saveButtonText: {
    color: COLORS.background,
    fontWeight: "bold",
  },
})