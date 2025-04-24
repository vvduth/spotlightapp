import { View, Text, TouchableOpacity, Image } from "react-native";
import React from "react";

type Story = {
  id: string;
  username: string;
  avatar: string;
  hasStory: Boolean;
};
type Props = {
  story: Story;
};
export default function Story({ story }: Props) {
  return (
    <TouchableOpacity style={{
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        marginBottom: 16,
    }}>
      <View>
        <Image source={{ uri: story.avatar }}
        style={{
            width: 60,
            height: 60,
            borderRadius: 30,
            borderWidth: story.hasStory ? 2 : 0,
            borderColor: story.hasStory ? "#FF8501" : "transparent",
        }} />
      </View>
      <Text>{story.username}</Text>
    </TouchableOpacity>
  );
}
