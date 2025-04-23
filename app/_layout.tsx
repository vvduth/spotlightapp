import { Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
export default function RootLayout() {
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <SafeAreaProvider
        
      >
        <SafeAreaView
        
        style={{ flex: 1, backgroundColor: "black" }}>
          <Stack
          screenOptions={{
            headerShown: false,
            
          }}
          >
            <Stack.Screen name="index" options={{ title: "Home" }} />
          </Stack>
        </SafeAreaView>
      </SafeAreaProvider>
    </ClerkProvider>
  );
}
