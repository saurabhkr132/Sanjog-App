import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, set, remove } from "firebase/database";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import CryptoJS from "crypto-js";
import Constants from "expo-constants";

const CLOUDINARY_UPLOAD_URL = Constants.expoConfig?.extra?.CLOUDINARY_UPLOAD_URL;
const CLOUDINARY_DELETE_URL = Constants.expoConfig?.extra?.CLOUDINARY_DELETE_URL;
const CLOUDINARY_API_KEY = Constants.expoConfig?.extra?.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = Constants.expoConfig?.extra?.CLOUDINARY_API_SECRET;
const CLOUDINARY_UPLOAD_PRESET = Constants.expoConfig?.extra?.CLOUDINARY_UPLOAD_PRESET;

const generateSignature = (params: Record<string, string>) => {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${params[key]}`)
    .join("&");

  const stringToSign = `${sortedParams}${CLOUDINARY_API_SECRET}`;
  return CryptoJS.SHA1(stringToSign).toString(CryptoJS.enc.Hex);
};

const uploadProfileImage = async (userId: string, fileUri: string) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const publicId = `profile_${userId}`;

    const paramsToSign = {
      timestamp,
      public_id: publicId,
      upload_preset: CLOUDINARY_UPLOAD_PRESET,
      overwrite: "true", // replace old profile
    };

    const signature = generateSignature(paramsToSign);

    const formData = new FormData();
    formData.append("file", {
      uri: fileUri,
      name: `${publicId}.jpg`,
      type: "image/jpeg",
    } as any);
    formData.append("api_key", CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
    formData.append("public_id", publicId);
    formData.append("overwrite", "true");
    formData.append("signature", signature);

    const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return response.data.secure_url;
  } catch (error: any) {
    console.error("Upload failed:", error.response?.data || error.message);
    throw new Error("Image upload failed.");
  }
};

const deleteProfileImage = async (userId: string) => {
  try {
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const publicId = `profile_${userId}`;

    const paramsToSign = { public_id: publicId, timestamp };
    const signature = generateSignature(paramsToSign);

    const formData = new FormData();
    formData.append("public_id", publicId);
    formData.append("api_key", CLOUDINARY_API_KEY);
    formData.append("timestamp", timestamp);
    formData.append("signature", signature);

    await axios.post(CLOUDINARY_DELETE_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return true;
  } catch (error: any) {
    console.error("Delete failed:", error.response?.data || error.message);
    throw new Error("Image deletion failed.");
  }
};

interface ProfileModalProps {
  completionPercentage: number;
}

const ProfilePhotoScreen = ({ completionPercentage }: ProfileModalProps) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState(false);
  const user = getAuth().currentUser;

  useEffect(() => {
    if (user) {
      fetchProfilePhoto();
    }
  }, [user]);

  const fetchProfilePhoto = async () => {
    if (!user) return;
    const db = getDatabase();
    const profileRef = ref(db, `users/${user.uid}/profileImage`);
    const snapshot = await get(profileRef);
    if (snapshot.exists()) {
      setImageUri(snapshot.val());
    } else {
      setImageUri(null);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      await uploadAndSaveImage(result.assets[0].uri);
    }
  };

  const uploadAndSaveImage = async (fileUri: string) => {
    if (!user) {
      Alert.alert("Error", "You must be logged in.");
      return;
    }

    setLoading(true);
    try {
      const imageUrl = await uploadProfileImage(user.uid, fileUri);
      const db = getDatabase();
      await set(ref(db, `users/${user.uid}/profileImage`), imageUrl);
      setImageUri(imageUrl);
      Alert.alert("Success", "Profile photo updated.");
    } catch (error) {
      Alert.alert("Error", "Upload failed.");
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    setLoading(true);
    try {
      await deleteProfileImage(user.uid);
      const db = getDatabase();
      await remove(ref(db, `users/${user.uid}/profileImage`));
      setImageUri(null);
      Alert.alert("Deleted", "Your profile photo has been removed.");
    } catch (error) {
      Alert.alert("Error", "Deletion failed.");
    } finally {
      setLoading(false);
      setModalVisible(false);
    }
  };

  return (
    <View className="flex items-center justify-center">
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View className="flex-1 justify-center items-center bg-black/50 px-6">
            <View className="bg-white p-12 rounded-2xl shadow-lg items-center w-80">
              <Image
                source={
                  imageUri
                    ? { uri: imageUri }
                    : require("@/assets/images/default-profile.png")
                }
                className="w-72 h-72 rounded-lg"
                resizeMode="cover"
              />
              <TouchableOpacity
                onPress={pickImage}
                className="mt-5 bg-blue-500 px-6 py-3 rounded-lg shadow-md w-full"
              >
                <Text className="text-white text-center font-semibold">
                  Upload / Change Profile
                </Text>
              </TouchableOpacity>
              {imageUri && (
                <TouchableOpacity
                  onPress={handleDelete}
                  className="mt-3 bg-red-500 px-6 py-3 rounded-lg shadow-md w-full"
                >
                  <Text className="text-white text-center font-semibold">
                    Delete Profile
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <View className="mb-8 rounded-full border-4 border-gray-100">
          <Image
            source={
              imageUri
                ? { uri: imageUri }
                : require("@/assets/images/default-profile.png")
            }
            className="w-32 h-32 rounded-full"
            resizeMode="cover"
          />
          <View className="absolute top-28 right-3 bg-blue-600 rounded-full px-3 py-1">
            <Text className="text-white text-xs font-bold">
              {completionPercentage}% Complete
            </Text>
          </View>
        </View>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" />}
    </View>
  );
};

export default ProfilePhotoScreen;
