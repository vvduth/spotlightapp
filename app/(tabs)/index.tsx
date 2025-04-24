import React from "react";
import { Href, Redirect } from "expo-router";
import { TouchableOpacity, View, Text, ScrollView, FlatList } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import { STORIES } from "@/constants/mock-data";
import Story from "@/components/Story";
import { useQueries, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Loader } from "@/components/Loader";
import Post from "@/components/Post";

const StoriesSection = ()=> (
   <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 2, gap: 16 }}
        >
          {STORIES.map((story) => (
            <Story key={story.id} story={story} />
          ))}
        </ScrollView> 
)

export default function Index() {
  const { signOut } = useAuth();
  const posts = useQuery(api.posts.getFeedPosts);

  if (posts === undefined) {
    return (<Loader/>);
  }

  if (posts === null || posts.length === 0) {
    return (
     <View>
      <Text>No post yet</Text>
     </View>
    );
    
  }

  return (
    <View style={{ flex: 1, backgroundColor: "white", padding: 16, gap: 16 }}>
      {/* header */}
      <View>
        <Text
          style={{
            fontSize: 24,
            fontWeight: "bold",
            marginTop: 16,
            color: COLORS.primary,
          }}
        >
          Spotlight
        </Text>
        {/* create a separator lline */}
        <View
          style={{
            height: 1,
            backgroundColor: COLORS.primary,
            marginVertical: 2,
          }}
        />
        <TouchableOpacity
          style={{ position: "absolute", right: 16, top: 16 }}
          onPress={() => signOut()}
        >
          <Ionicons name="log-out-outline" size={24} color="black" />
        </TouchableOpacity>
      </View>
      
       
        <FlatList 
          data={posts}
          renderItem={({ item }) => <Post post={item} />}
          keyExtractor={(item) => item._id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 16, paddingBottom:60 }}
          ListHeaderComponent={<StoriesSection />}
        />
        <View
          style={{
            height: 1,
            backgroundColor: COLORS.primary,
            marginVertical: 2,
          }}
        />
     
    </View>
  );
}
