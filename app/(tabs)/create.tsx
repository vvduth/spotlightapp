import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { StyleSheet } from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function Create() {
  const router = useRouter();
  const { user } = useUser();

  const [caption, setcaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSharing, setIsSharing] = useState(false);

  const pickImage = async () => {
    console.log("pick image");
    try {
      const resutl = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!resutl.canceled) {
        setSelectedImage(resutl.assets[0].uri);
      } else {
        alert("You did not select any image");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      alert("An error occurred while picking the image.");
    }
  };

  const handleShare= async () => {

  }
  if (!selectedImage) {
    return (
      <View style={styles.container}>
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={28} color={COLORS.primary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Create New Post</Text>
          <View style={styles.placeholder} />
        </View>

        {/* Image Selection Section */}
        <TouchableOpacity style={styles.imageSelector} onPress={pickImage}>
          <Ionicons name="camera" size={48} color={COLORS.surface} />
          <Text style={styles.imageSelectorText}>Tap to select an image</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 20 : 0}
    >
      {/* header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            setSelectedImage(null);
            setcaption("");
          }}
          disabled={isSharing}
        >
          <Ionicons
            name="close-outline"
            size={28}
            color={isSharing ? COLORS.warning : COLORS.accent}
          />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>New post</Text>
        <TouchableOpacity
        style={[]}
        disabled={isSharing}
        onPress={handleShare}>
          {
            isSharing ? (
             <ActivityIndicator size={"small"} color={COLORS.primary}  />
            ) : (
              <Text>Share</Text>
            )
          }

        </TouchableOpacity>
      </View>

      {/* Image Preview Section */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* TODO add dymatic styling based on is sharing */}
        <View
        style= {[
          
        ]}
        ></View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: COLORS.primary,
    textAlign: "center",
  },
  placeholder: {
    width: 28, // Placeholder for alignment
  },
  imageSelector: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    padding: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  imageSelectorText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "500",
    color: COLORS.surface,
    textAlign: "center",
  },
});
