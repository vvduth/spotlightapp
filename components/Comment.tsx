import { View, Text, Image } from "react-native";
import React from "react";
import { formatDistanceToNow } from "date-fns";

interface CommentProps {
  text: string;
  _creationTime: number;
  user: {
    fullname: string;
    image: string;
  };
}

export default function Comment({ comment}: {comment: CommentProps}) {
  return (
    <View style={{ flexDirection: "row", gap: 8, marginBottom: 8, padding: 8 }}>
      <Image source={{uri: comment.user.image}} 
        style={{ width: 40, height: 40, borderRadius: 20 ,
        backgroundColor: "#f0f0f0",  // Placeholder color while loading
        borderWidth: 1, // Optional: Add a border to the image
        }} 
        resizeMode="cover"
        alt="User Avatar"
      />
      <View
        style={{
          backgroundColor: "#f0f0f0",
          padding: 8,
          borderRadius: 8,
          flex: 1,
        }}
      >
        <Text
          style={{
            fontWeight: "bold",
            marginBottom: 4,}}>
            {comment.user.fullname}
        </Text>
        <Text
         style={{
            color: "#333",
            fontSize: 16,
            marginBottom: 4,
         }}
        >{comment.text}</Text>
        <Text style ={{
            color: "#888",
            fontSize: 12,
        }}>{formatDistanceToNow( comment._creationTime, {addSuffix: true})}</Text>
      </View>
    </View>
  );
}
