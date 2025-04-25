import {
  View,
  Text,
  Modal,
  KeyboardAvoidingView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { Loader } from "./Loader";
import Comment from "./Comment";
import { COLORS } from "@/constants/theme";

type Props = {
  postId: Id<"posts">;
  visible: boolean;
  onClose: () => void;
  onCommentAdded: () => void;
};

export default function CommentsModal({
  postId,
  visible,
  onClose,
  onCommentAdded,
}: Props) {
  const [newComment, setNewComment] = useState("");
  const comments = useQuery(api.comments.getComments, { postId });
  const addComment = useMutation(api.comments.addComment);

  const handleAddComment = async () => {
    if (!newComment.trim()) return; // Prevent empty comments
    try {
      await addComment({ text: newComment, postId });
      setNewComment(""); // Clear the input field after adding the comment
      onCommentAdded(); // Call the callback function to refresh comments
    } catch (error) {
      console.error("Error adding comment:", error);
    } 
  };
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, backgroundColor: "white" }} // Ensure it takes the full screen
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 60,
            paddingBottom: 16,
            borderBottomWidth: 1,
            borderBottomColor: COLORS.success,
          }}
        >
          <TouchableOpacity>
            <Ionicons name="close" size={24} color="black" onPress={onClose} />
          </TouchableOpacity>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#333",
            }}
          >
            Comments
          </Text>
          <View style={{ width: 24 }} />
        </View>
        {comments === undefined ? (
          <Loader />
        ) : (
          <FlatList
            data={comments}
            renderItem={({ item }) => <Comment comment={item} />}
            keyExtractor={(item) => item._id.toString()}
            contentContainerStyle={{ paddingBottom: 60 }}
          />
        )}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            padding: 16,
            borderTopWidth: 1,
            borderTopColor: "#ddd",
            backgroundColor: "white",
          }}
        >
          <TextInput
            placeholder="Add a comment..."
            placeholderTextColor={"#888"}
            value={newComment}
            style={{
              flex: 1,
              borderWidth: 1,
              borderColor: "#ddd",
              borderRadius: 8,
              padding: 8,
              marginRight: 8,
              backgroundColor: "#f9f9f9",
            }}
            onChangeText={setNewComment}
            multiline
          />
          <TouchableOpacity
            onPress={handleAddComment}
            disabled={newComment.length === 0 || !newComment.trim()}
            style={{
              padding: 10,
              backgroundColor:
                newComment.length === 0 || !newComment.trim()
                  ? COLORS.success
                  : COLORS.error,
              borderRadius: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold" }}>Post</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
