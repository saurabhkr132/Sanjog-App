import { Stack } from "expo-router";
import "./global.css";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "@firebase/auth";
import { auth } from "@/FirebaseConfig";
import { useRouter } from "expo-router";

export default function RootLayout() {
  const [user, setUser] = useState<User | null>(null);

  const router = useRouter();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
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
