import { Link } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Index() {
  return (
    <View
      style={
        styles.container
      }
    >
      <Link href={"/notification"}>Visit nofitycation</Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, 
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "red",
    fontSize: 50
  }
})
