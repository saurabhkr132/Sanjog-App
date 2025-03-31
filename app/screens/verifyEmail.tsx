import React, { useState, useEffect } from "react";
import { auth } from "@/FirebaseConfig";
import { getAuth, sendEmailVerification } from "firebase/auth";
import { router } from "expo-router";
import { View, Text, TouchableOpacity, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const VerifyEmailScreen = () => {
  const auth = getAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const interval = setInterval(async () => {
      await auth.currentUser?.reload();
      if (auth.currentUser?.emailVerified) {
        clearInterval(interval);
        router.replace("/(tabs)");
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const resendVerificationEmail = async () => {
    if (auth.currentUser) {
      await sendEmailVerification(auth.currentUser);
      Alert.alert("Message", "Verification email sent again!");
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center bg-dark-200">
      <View className="mb-8 mt-56">
        <Image
          className="w-56 h-56 "
          source={require("@/assets/images/logo.png")}
          resizeMode="contain"
        />
      </View>
      <Text className="text-white text-lg mb-2 text-center">
        A verification code has been sent to your email.
      </Text>
      <Text className="text-white text-lg mb-4">
        Please verify your email to continue.
      </Text>
      <TouchableOpacity
        onPress={resendVerificationEmail}
        className="bg-green-500 px-4 py-2 rounded-lg mb-4"
      >
        <Text className="text-white">Resend Verification Email</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => auth.signOut()}
        className="bg-indigo-500 px-4 py-2 rounded-lg"
      >
        <Text className="text-white text-lg font-semibold">Sign Out</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default VerifyEmailScreen;
