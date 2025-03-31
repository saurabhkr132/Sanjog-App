import {
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router, useRouter } from "expo-router";
import { database, ref, onValue } from "@/FirebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  getAuth,
  deleteUser,
} from "firebase/auth";
import { getDatabase, remove } from "firebase/database";
import { Modal } from "react-native";

const Settings = () => {
  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const database = getDatabase();
  const router = useRouter();

  const handleDeleteAccount = async () => {
    if (!password) {
      Alert.alert("Error deleting", "Please enter your correct password!");
      return;
    }

    setModalVisible(false);
    await deleteAccount(password);
  };

  const deleteAccount = async (password: string) => {
    if (!auth.currentUser) {
      Alert.alert("Error", "No authenticated user found.");
      return;
    }

    const isReauthenticated = await reauthenticateUser(password);
    if (!isReauthenticated) return;

    try {
      const userId = auth.currentUser.uid;

      await remove(ref(database, `users/${userId}`));

      await deleteUser(auth.currentUser);

      Alert.alert("Success", "Your account has been deleted.");
      router.replace("/login");
    } catch (error: any) {
      setPassword("");
      console.log("Error deleting account:", error.code, error.message);
      Alert.alert("Error", error.message);
    }
  };

  const reauthenticateUser = async (password: string) => {
    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        Alert.alert("Error", "User not found.");
        return false;
      }

      // Refresh user token
      await user.reload();

      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);

      console.log("Reauthentication successful");
      return true;
    } catch (error: any) {
      setPassword("");
      console.log("Reauthentication Error:", error.code, error.message);
      Alert.alert(
        "Authentication Failed",
        "Check your password and try again."
      );
      return false;
    }
  };

  return (
    <SafeAreaView className="bg-dark-200 flex justify-between h-full">
      <View>
        <View className="mb-4">
          <View className="mx-2 mt-4 flex flex-row items-center">
            <TouchableOpacity
              className="px-4 py-2 rounded-xl shadow-lg"
              onPress={() => router.push("/profile")}
            >
              <Ionicons name="chevron-back" size={24} color="white" />
            </TouchableOpacity>
            <Text className=" color-white text-3xl font-semibold">
              Settings
            </Text>
          </View>
        </View>
        <View className="flex flex-column items-center gap-6">
          <TouchableOpacity
            onPress={() => auth.signOut()}
            className="bg-indigo-500 px-8 py-2 rounded-lg"
          >
            <Text className="text-white text-lg font-semibold">Sign Out</Text>
          </TouchableOpacity>
          <View className="flex justify-center items-center">
            <TouchableOpacity
              onPress={() => setModalVisible(true)}
              className="bg-red-500 p-3 rounded-lg"
            >
              <Text className="text-white text-center">Delete My Account</Text>
            </TouchableOpacity>

            <Modal visible={modalVisible} transparent animationType="fade">
              <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
                <View className="flex-1 justify-center items-center bg-black/50">
                  <View className="bg-white p-6 rounded-lg w-80">
                    <Text className="text-lg font-semibold mb-3">
                      Enter your password to confirm
                    </Text>

                    <TextInput
                      className="border p-2 rounded-md"
                      placeholder="Password"
                      secureTextEntry
                      value={password}
                      onChangeText={setPassword}
                    />

                    <View className="flex-row justify-between mt-4">
                      <TouchableOpacity
                        onPress={() => setModalVisible(false)}
                        className="px-4 py-2 bg-gray-300 rounded"
                      >
                        <Text>Cancel</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={handleDeleteAccount}
                        className="px-4 py-2 bg-red-500 rounded"
                      >
                        <Text className="text-white">Confirm</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
          </View>
        </View>
      </View>
      <View className="flex flex-column justify-center items-center mb-8">
        <View className="flex flex-row justify-center items-center gap-4 mt-5">
          <View className="mb-4">
            <Image
              className="w-8 h-8"
              source={require("@/assets/images/logo.png")}
              resizeMode="contain"
            />
          </View>
          <Text className="text-gray-300 text-2xl mb-4">Sanjog</Text>
        </View>
        <Text className="text-gray-300 text-sm">Version 1.0.3</Text>
        <Text className="text-gray-300 text-sm">Created with love</Text>
      </View>
    </SafeAreaView>
  );
};

export default Settings;
