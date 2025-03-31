import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { auth } from "../FirebaseConfig";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { router } from "expo-router";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = getAuth();
  const user = auth.currentUser;

  const signIn = async () => {
    try {
      const user = await signInWithEmailAndPassword(auth, email, password);
      const userCredential = user.user;

      if (userCredential) {
        if (userCredential.emailVerified) {
          router.replace("/(tabs)");
        } else {
          router.replace("/screens/verifyEmail");
        }
      } else {
        router.replace("/login");
      }
    } catch (error: any) {
      console.log(error);
      Alert.alert(
        "Invalid credentials",
        "Check your email and password and try again."
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-dark-200">
      <View className="mb-8">
        <Image
          className="w-56 h-56 "
          source={require("@/assets/images/logo.png")}
          resizeMode="contain"
        />
      </View>
      <Text className="text-2xl font-extrabold text-indigo-200 mb-10">
        User Login
      </Text>
      <TextInput
        className="h-12 w-[90%] bg-white border-2 border-indigo-100 rounded-xl my-4 px-6 text-base text-gray-700 shadow-md shadow-gray-400/30"
        placeholder="email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="h-12 w-[90%] bg-white border-2 border-indigo-100 rounded-xl my-4 px-6 text-base text-gray-700 shadow-md shadow-gray-400/30"
        placeholder="password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        className="w-[90%] my-4 bg-indigo-500 p-5 rounded-xl items-center justify-center shadow-lg shadow-indigo-500/40"
        onPress={signIn}
      >
        <Text className="text-white text-lg font-semibold">Login</Text>
      </TouchableOpacity>
      <View className="flex flex-row gap-2 mt-5 justify-center items-center">
        <Text className="text-white text-lg">Don't have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/signup")}>
          <Text className="text-blue-600 font-bold mt-1 text-lg">Sign Up</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={() => router.push("/screens/forgotPassword")}>
        <Text className="text-indigo-400 text-center mt-4">
          Forgot Password?
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Login;
