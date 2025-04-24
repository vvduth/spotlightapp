import { View, Text, Modal, KeyboardAvoidingView, TouchableOpacity, FlatList } from "react-native";
import React, { useState } from "react";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Ionicons } from "@expo/vector-icons";
import { Loader } from "./Loader";

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

    const [newComment, setNewComment] = useState("")
    const comments = useQuery(api.comments.getComments, { postId });
    const addComment = useMutation(api.comments.addComment);

    const handleAddComment = async () => {

    }
  return (
    <Modal visible={visible} animationType="slide" transparent={true}
    onRequestClose={onClose}>
        <KeyboardAvoidingView>
            <View>
                <TouchableOpacity>
                    <Ionicons name="close" size={24} color="black" onPress={onClose} />
                </TouchableOpacity>
                <Text>Comments</Text>
                <View style={{width: 24}}/>
            </View>
            {comments === undefined ? (
                <Loader />
            ): (<FlatList
                data={comments}
                renderItem={({ item }) => (
                    <></>
                )}
                keyExtractor={(item) => item._id.toString()}
                contentContainerStyle={{ paddingBottom: 60 }}
            />)}
        </KeyboardAvoidingView>
        
    </Modal>
  );
}
