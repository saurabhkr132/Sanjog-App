import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
} from "react-native";
import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { get, ref } from "firebase/database";
import { database } from "@/FirebaseConfig";
import { router } from "expo-router";
import Device from "@/components/Device";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const [name, setName] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged((user) => {
      if (user) {
        if (user.emailVerified) {
          router.replace("/(tabs)");
        } else {
          router.replace("/screens/verifyEmail");
        }
      } else {
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, []);

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

  const matches = [
    {
      id: 1,
      name: "John Doe",
      image: require("@/assets/images/default-profile.png"),
    },
    {
      id: 2,
      name: "Jane Smith",
      image: require("@/assets/images/default-profile.png"),
    },
    {
      id: 3,
      name: "Alice Johnson",
      image: require("@/assets/images/default-profile.png"),
    },
  ];

  return (
    <SafeAreaView className="bg-dark-200 flex-1">
      <ScrollView
        className="w-full px-6 py-8"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-3xl text-white font-bold">
            {name ? `Hi, ${name}!` : "Welcome!"}
          </Text>
        </View>

        <Text className="text-2xl text-white font-semibold mt-4 mb-4">
          Your Device
        </Text>
        <Device />

        <Text className="text-2xl text-white font-semibold mt-8 mb-4">
          Your Matches
        </Text>
        <FlatList
          data={matches}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity className="bg-gradient-to-r from-pink-500 to-purple-600 p-5 rounded-2xl shadow-lg mx-2">
              <Image
                source={item.image}
                className="w-24 h-24 rounded-full mb-2"
              />
              <Text className="text-lg font-medium text-white text-center">
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
        <TouchableOpacity
          className="px-4 py-2 rounded-xl shadow-lg"
          onPress={() => router.push("/screens/test")}
        >
          <Text className="text-white">Test</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className="px-4 py-2 rounded-xl shadow-lg"
          onPress={() => router.push("/screens/bluetooth")}
        >
          <Text className="text-white">BT</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
