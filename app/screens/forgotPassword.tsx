import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  Image,
} from "react-native";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/FirebaseConfig";
import { useRouter } from "expo-router";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        "Success",
        "Password reset link sent! Check your email inbox.",
        [{ text: "OK", onPress: () => router.replace("/login") }]
      );
    } catch (error: any) {
      console.log("Password reset error:", error);
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center bg-dark-200 p-6">
      <View className="mb-8 mt-32">
        <Image
          className="w-56 h-56 "
          source={require("@/assets/images/logo.png")}
          resizeMode="contain"
        />
      </View>
      <Text className="text-white text-2xl font-bold mb-4">Reset Password</Text>
      <Text className="text-gray-400 text-sm text-center mb-6">
        Enter your registered email, and we'll send you a password reset link.
      </Text>

      <TextInput
        className="bg-white text-gray-700 w-full p-3 rounded-lg mb-4"
        placeholder="Enter your email"
        placeholderTextColor="gray"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />

      <TouchableOpacity
        className={`w-full p-3 rounded-lg ${
          loading ? "bg-gray-500" : "bg-indigo-500"
        }`}
        onPress={handleResetPassword}
        disabled={loading}
      >
        <Text className="text-white text-center font-semibold">
          {loading ? "Sending..." : "Send Reset Link"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => router.replace("/login")}
        className="mt-4"
      >
        <Text className="text-indigo-400">Back to Login</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ForgotPassword;
