// app/screens/MatchedUsersScreen.tsx
import React, { useEffect, useState } from "react";
import { Text, View, Image, ScrollView, TouchableOpacity } from "react-native";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { router } from "expo-router";

interface MatchUser {
  uid: string;
  name: string;
  profileImage?: string;
}

export default function MatchedUsersScreen() {
  const auth = getAuth();
  const db = getDatabase();
  const currentUser = auth.currentUser;

  const [userName, setUserName] = useState("User");
  const [macAddress, setMacAddress] = useState<string | null>(null);
  const [matchedUsers, setMatchedUsers] = useState<MatchUser[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!currentUser) return;

      const userRef = ref(db, `users/${currentUser.uid}`);
      const userSnap = await get(userRef);
      if (userSnap.exists()) {
        const data = userSnap.val();
        if (data.name) setUserName(data.name);
      }

      const macRef = ref(db, `users/${currentUser.uid}/mac`);
      const macSnap = await get(macRef);
      if (macSnap.exists()) {
        setMacAddress(macSnap.val());
      }

      const matchRef = ref(db, `users/${currentUser.uid}/match/match`);
      const matchSnap = await get(matchRef);
      const matchVal = matchSnap.val();

      let matchedUIDs: string[] = [];

      if (Array.isArray(matchVal)) {
        matchedUIDs = matchVal.filter(Boolean);
      } else if (matchVal && typeof matchVal === "object") {
        matchedUIDs = Object.values(matchVal);
      }

      const fetchedUsers: MatchUser[] = await Promise.all(
        matchedUIDs.map(async (uid) => {
          const uRef = ref(db, `users/${uid}`);
          const uSnap = await get(uRef);
          const profileSnap = await get(ref(db, `users/${uid}/profileImage`));

          if (uSnap.exists()) {
            const uData = uSnap.val();
            const profileImage = profileSnap.exists()
              ? profileSnap.val()
              : undefined;

            return {
              uid,
              name: uData.name || "Unknown",
              profileImage,
            };
          }

          return {
            uid,
            name: "Unknown",
          };
        })
      );

      setMatchedUsers(fetchedUsers);
    };

    fetchData();
  }, []);

  return (
    <View className="flex-1 bg-dark-200 px-4 pt-10">
      <Text className="text-2xl font-bold mb-4 text-white text-center">
        Welcome, {userName}
      </Text>

      {macAddress ? (
        <Text className="text-center text-white mb-2">
          Device MAC Address: {macAddress}
        </Text>
      ) : (
        <Text className="text-center text-gray-400 mb-2">
          No MAC address found.
        </Text>
      )}

      <Text className="text-center text-gray-400 mb-4">
        No location information available.
      </Text>

      <TouchableOpacity
        className="px-4 py-2 my-4 rounded-xl shadow-lg border-2 border-white w-1/2 align-middle self-center"
        onPress={() => router.push("/screens/WifiFirebaseQrScreen")}
      >
        <Text className="text-white text-lg text-center">Generate QR Code</Text>
      </TouchableOpacity>

      <Text className="text-xl text-white font-semibold mb-3">
        Your Matches
      </Text>

      {matchedUsers && matchedUsers.length > 0 ? (
        <ScrollView className="space-y-4">
          {matchedUsers.map((user) => (
            <TouchableOpacity
              key={user.uid}
              className="bg-dark-100 p-4 rounded-xl flex-row items-center space-x-4"
              onPress={() => router.push(`/screens/matchDetail/${user.uid}`)}
            >
              {user.profileImage ? (
                <Image
                  source={{ uri: user.profileImage }}
                  className="w-16 h-16 mr-2 rounded-full"
                />
              ) : (
                <View className="w-16 h-16 rounded-full bg-gray-700 items-center justify-center">
                  <Text className="text-white text-xl">👤</Text>
                </View>
              )}

              <View>
                <Text className="text-white font-bold text-lg">
                  {user.name}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text className="text-gray-400 text-center mt-4">
          No matches found.
        </Text>
      )}
    </View>
  );
}