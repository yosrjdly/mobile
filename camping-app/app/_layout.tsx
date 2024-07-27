import { Stack } from "expo-router";

export default function RootLayout() {

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{headerShown: false }} />
      <Stack.Screen name="auth/SignIn" options={{ title: 'Sign In' }} />
      <Stack.Screen name="auth/SignUp" options={{ title: 'Sign Up' }} />
<<<<<<< HEAD:camping-app/app/_layout.jsx
      <Stack.Screen name="profile/Profile" options={{title : "profile" , headerShown : false}} />
      <Stack.Screen name="profile/Profile/(drawer)" options={{title : "drawer" , headerShown : false}} />

=======
      <Stack.Screen name="UserInterests/Interests" options={{title: "Interests", headerShown: false}} />
>>>>>>> d32390d02c67ae92447e0fa356cace7ce1fe97a9:camping-app/app/_layout.tsx
    </Stack>
  );
}

