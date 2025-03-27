import { Text, View, TouchableOpacity } from "react-native";
import { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { get, ref } from "firebase/database";
import { database } from "@/FirebaseConfig";
import { router } from "expo-router";

const Home = () => {
  const [name, setName] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  getAuth().onAuthStateChanged((user) => {
    if (!user) router.push("/login");
  });

  useEffect(() => {
    fetchProfileDetails();
  }, [user]);

  const fetchProfileDetails = async () => {
    if (user) {
      const profileRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(profileRef);

      const profileData = snapshot.val();

      setName(profileData.name || "");
    } else {
      console.log("No user logged in");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-dark-200 gap-12">
      {name ? (
        <Text className="text-5xl text-white">Hi, {name}</Text>
      ) : (
        <Text className="text-5xl text-white">Setup you profile!</Text>
      )}
      <TouchableOpacity
        className="w-[90%] bg-indigo-500 p-5 rounded-lg items-center justify-center shadow-lg mt-4"
        onPress={() => auth.signOut()}
      >
        <Text className="text-white text-lg font-semibold">Sign Out</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-[90%] bg-indigo-500 p-5 rounded-lg items-center justify-center shadow-lg mt-4"
        onPress={() => router.push("/screens/test")}
      >
        <Text className="text-white text-lg font-semibold">Test</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Home;
