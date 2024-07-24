import LoginScreen from "@/components/LoginScreen";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-expo";
import { Stack } from "expo-router";
import { Text, View } from "react-native";



export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY}>
      <SignedIn>
      <Stack>
      <Stack.Screen name="(tabs)"  options ={{headerShown:false}}/>
    </Stack>
      </SignedIn>
<SignedOut>
  <LoginScreen/>
</SignedOut>

    </ClerkProvider>
   
  );
}
