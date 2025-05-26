import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Linking,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, set, onValue } from "firebase/database";
import { useRouter, useLocalSearchParams } from "expo-router";

export default function MatchDetail() {
  const auth = getAuth();
  const db = getDatabase();
  const router = useRouter();
  const { uid: matchUid } = useLocalSearchParams();

  const currentUser = auth.currentUser;
  const [matchData, setMatchData] = useState<any>(null);
  const [showInfoFullScreen, setShowInfoFullScreen] = useState(false);
  const [messages, setMessages] = useState<
    { timestamp: number; text: string; sender: "me" | "match" }[]
  >([]);
  const [inputText, setInputText] = useState("");
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    if (!currentUser || !matchUid) return;

    const fetchUser = async () => {
      const userRef = ref(db, `users/${matchUid}`);
      const snap = await get(userRef);
      if (snap.exists()) {
        setMatchData(snap.val());
      }
    };

    fetchUser();

    const currentUserMessagesRef = ref(db, `users/${currentUser.uid}/messages/${matchUid}`);
    const unsubscribeCurrentUser = onValue(currentUserMessagesRef, (snapshot) => {
      const userMsgs = snapshot.val() || {};
      updateMessages(userMsgs, "me");
    });

    const matchUserMessagesRef = ref(db, `users/${matchUid}/messages/${currentUser.uid}`);
    const unsubscribeMatchUser = onValue(matchUserMessagesRef, (snapshot) => {
      const matchMsgs = snapshot.val() || {};
      updateMessages(matchMsgs, "match");
    });

    return () => {
      unsubscribeCurrentUser();
      unsubscribeMatchUser();
    };
  }, [currentUser, matchUid]);

  const updateMessages = (
    newMsgs: Record<string, { text: string }>,
    sender: "me" | "match"
  ) => {
    setMessages((prevMsgs) => {
      const newMsgsArr = Object.entries(newMsgs).map(([ts, val]) => ({
        timestamp: Number(ts),
        text: val.text,
        sender,
      }));

      const filteredPrev = prevMsgs.filter(
        (m) => !newMsgsArr.some((nm) => nm.timestamp === m.timestamp && nm.sender === m.sender)
      );

      return [...filteredPrev, ...newMsgsArr].sort((a, b) => a.timestamp - b.timestamp);
    });
  };

  const sendMessage = async () => {
    if (!inputText.trim() || !currentUser || !matchUid) return;

    const timestamp = Date.now();
    const msgRef = ref(db, `users/${currentUser.uid}/messages/${matchUid}/${timestamp}`);
    await set(msgRef, { text: inputText.trim() });
    setInputText("");
  };

  const getAge = (yearOfBirth: number) => {
    const currentYear = new Date().getFullYear();
    return yearOfBirth ? currentYear - yearOfBirth : null;
  };

  const decodeGender = (g: number) => {
    return g === 1 ? "Male" : g === 2 ? "Female" : g === 3 ? "Other" : null;
  };

  const handlePhonePress = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  if (!matchData) {
    return (
      <View className="flex-1 justify-center items-center bg-dark-200">
        <Text className="text-white">Loading user details...</Text>
      </View>
    );
  }

  if (showInfoFullScreen) {
    const age = getAge(matchData.yearOfBirth);
    const gender = decodeGender(matchData.gender);
    const weight = matchData.weight;
    const height = matchData.height;
    const langs = matchData.languages;

    return (
      <SafeAreaView className="flex-1 bg-gray-900 p-6">
        <TouchableOpacity onPress={() => setShowInfoFullScreen(false)}>
          <Text className="text-blue-400 text-lg mb-6">← Back to Chat</Text>
        </TouchableOpacity>

        <View className="items-center">
          {matchData.profileImage ? (
            <Image
              source={{ uri: matchData.profileImage }}
              style={{ width: 180, height: 180, borderRadius: 90, marginBottom: 24 }}
              resizeMode="cover"
            />
          ) : (
            <View
              style={{
                width: 180,
                height: 180,
                borderRadius: 90,
                backgroundColor: "#475569",
                justifyContent: "center",
                alignItems: "center",
                marginBottom: 24,
              }}
            >
              <Text className="text-white text-7xl">👤</Text>
            </View>
          )}

          {/* Name + Age */}
          <Text className="text-white text-3xl font-semibold mb-2">
            {matchData.name}{age ? `, ${age}` : ""}
          </Text>

          {/* Gender */}
          {gender && <Text className="text-gray-300 text-xl mb-2">{gender}</Text>}

          {/* Weight & Height */}
          {(weight || height) && (
            <Text className="text-gray-300 text-xl mb-2">
              {weight ? `${weight} kg` : ""}{weight && height ? ", " : ""}
              {height ? `${height} cm` : ""}
            </Text>
          )}

          {/* Languages */}
          {langs && langs.length > 0 && (
            <Text className="text-gray-300 text-xl mb-2">
              Knows {langs.join(", ")}
            </Text>
          )}

          {/* Phone */}
          {matchData.phone && (
            <TouchableOpacity
              onPress={() => handlePhonePress(matchData.phone)}
              className="mt-4 px-8 py-3 bg-blue-600 rounded-full"
            >
              <Text className="text-white text-xl font-semibold">Call {matchData.phone}</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1, backgroundColor: "#1e293b" }}
    >
      {/* Header */}
      <View className="p-4 border-b border-gray-600 flex-row items-center">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-white text-lg">← Back</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setShowInfoFullScreen(true)} style={{ flex: 1, marginLeft: 12 }}>
          <Text className="text-white text-xl font-bold">{matchData.name}</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Area */}
      <ScrollView
        ref={scrollViewRef}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
        contentContainerStyle={{ padding: 10, flexGrow: 1 }}
      >
        {messages.length === 0 ? (
          <Text className="text-center text-gray-400 text-lg mt-8">
            Start a conversation with your match 💬
          </Text>
        ) : (
          messages.map(({ timestamp, text, sender }) => (
            <View
              key={timestamp + sender}
              style={{
                marginVertical: 4,
                alignSelf: sender === "me" ? "flex-end" : "flex-start",
                backgroundColor: sender === "me" ? "#2563eb" : "#475569",
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 16,
                maxWidth: "70%",
              }}
            >
              <Text style={{ color: "white" }}>{text}</Text>
              <Text
                style={{
                  fontSize: 10,
                  color: "#cbd5e1",
                  marginTop: 4,
                  alignSelf: "flex-end",
                }}
              >
                {new Date(timestamp).toLocaleTimeString()}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Input */}
      <View
        style={{
          flexDirection: "row",
          padding: 8,
          borderTopWidth: 1,
          borderTopColor: "#334155",
          backgroundColor: "#1e293b",
        }}
      >
        <TextInput
          style={{
            flex: 1,
            color: "white",
            backgroundColor: "#334155",
            borderRadius: 20,
            paddingHorizontal: 12,
          }}
          placeholder="Type a message"
          placeholderTextColor="#94a3b8"
          value={inputText}
          onChangeText={setInputText}
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={{
            marginLeft: 8,
            backgroundColor: "#2563eb",
            borderRadius: 20,
            paddingHorizontal: 16,
            justifyContent: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
