import { Stack } from "expo-router";
import "./global.css";
import React, { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "@firebase/auth";
import { auth } from "@/FirebaseConfig";
import { useRouter } from "expo-router";
import { Alert } from "react-native";

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  useEffect(() => {
      onAuthStateChanged(auth,(user) => {
        if (user) {
          if (user.emailVerified) {
            router.replace("/(tabs)");
          } else {
            // Alert.alert("Message", "Please verify your email before logging in.");
            router.replace("/screens/verifyEmail");
          }
        } else {
          router.replace("/login");
        }
      });
  }, []);

  console.log("starting");
  console.log(user);
  useEffect(() => {
    if (user) {
      router.replace("/(tabs)");
    } else {
      router.replace("/login");
    }
  }, [user]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {user ? <Stack.Screen name="(tabs)" /> : <Stack.Screen name="login" />}
    </Stack>
  );
}
