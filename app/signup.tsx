import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { set, ref } from "firebase/database";
import { auth, db, database } from "@/FirebaseConfig";

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signUp = async () => {
    if (name) {
      try {
        const user = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const userCredential = user.user;

        await sendEmailVerification(userCredential);

        const userRef = ref(database, `users/${userCredential.uid}`);
        await set(userRef, {
          email: userCredential.email,
          name: name,
          createdAt: new Date(),
        });

        Alert.alert("Verify you Email", "Verification email sent. Please check your inbox.");

        if (user) router.replace("/screens/verifyEmail");
      } catch (error: any) {
        console.log(error);
        alert("Registration failed" + error.message);
      }
    } else {
      alert("Enter a valid name!");
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
        User SignUp
      </Text>
      <TextInput
        className="h-12 w-[90%] bg-white border-2 border-indigo-100 rounded-xl my-4 px-6 text-base text-gray-700 shadow-md shadow-gray-400/30"
        placeholder="name"
        value={name}
        onChangeText={setName}
      />
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
        onPress={signUp}
      >
        <Text className="text-white text-lg font-semibold">Create Account</Text>
      </TouchableOpacity>
      <View className="flex flex-row gap-2 mt-5 justify-center items-center">
        <Text className="text-white text-lg">Already have an account?</Text>
        <TouchableOpacity onPress={() => router.push("/login")}>
          <Text className="text-blue-600 font-bold mt-1 text-lg">Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Login;
