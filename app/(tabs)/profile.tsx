import {
  TouchableOpacity,
  Text,
  SafeAreaView,
  View,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { getAuth } from "firebase/auth";
import { router } from "expo-router";
import { get, ref } from "firebase/database";
import { database } from "@/FirebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import ProfilePhotoScreen from "@/app/screens/ProfilePhotoScreen";

export default function Profile() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState<number | null>(null);
  const [mob, setMob] = useState<number | null>(null);
  const [yob, setYob] = useState<number | null>(null);
  const [gender, setGender] = useState<number | null>(null);
  const [interestedIn, setInterestedIn] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [weight, setWeight] = useState<number | null>(null);
  const [religion, setReligion] = useState<number | null>(null);
  const [caste, setCaste] = useState("");
  const [maritalStatus, setMaritalStatus] = useState<boolean | null>(null);
  const [languages, setLanguages] = useState<string[]>([]);
  const [imageUri, setImageUri] = useState<string | null>("");
  const [phone, setPhone] = useState<number | null>(null);
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    fetchProfileDetails();
  });

  const fetchProfileDetails = async () => {
    if (user) {
      const profileRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(profileRef);

      const profileData = snapshot.val();

      setName(profileData.name || "");
      setGender(profileData.gender ?? null);
      setInterestedIn(profileData.interestedIn ?? null);
      setDob(profileData.dateOfBirth || null);
      setMob(profileData.monthOfBirth || null);
      setYob(profileData.yearOfBirth || null);
      setHeight(profileData.height || null);
      setWeight(profileData.weight || null);
      setReligion(profileData.religion || null);
      setCaste(profileData.caste || "");
      setLanguages(profileData.languages || "");
      setMaritalStatus(profileData.maritalStatus ?? null);
      setImageUri(profileData.profileImage || null);
      setPhone(profileData.phone || null);
    } else {
      console.log("No user logged in");
    }
  };

  const currentYear = new Date().getFullYear();

  const calculateCompletion = () => {
    const totalFields = 11; // Total number of profile fields
    const filledFields = [
      name,
      gender,
      interestedIn,
      yob,
      height,
      weight,
      religion,
      caste,
      languages,
      maritalStatus,
      imageUri,
      phone,
    ].filter((field) => field !== null && field !== "").length;

    return Math.round((filledFields / totalFields) * 100);
  };

  const completionPercentage = calculateCompletion();

  return (
    <SafeAreaView className="bg-dark-200 flex-1">
      <View className="mx-6 mt-4 flex flex-row justify-between items-center">
        <Text className=" color-white text-3xl font-semibold">Profile</Text>
        <TouchableOpacity
          className="bg-indigo-500 px-4 py-2 rounded-xl shadow-lg"
          onPress={() => router.push("/screens/settings")}
        >
          <Ionicons name="settings-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 ">
        <View className="flex flex-row m-6 justify-start items-start gap-4">
          <ProfilePhotoScreen completionPercentage={completionPercentage} />
          <View className="flex flex-column items-start justify-center gap-2">
            <View className="flex flex-row items-center">
              <Text className="color-white text-3xl font-semibold">{name}</Text>
              {yob && (
                <Text className="color-white text-3xl font-semibold">
                  , {yob && currentYear - yob}
                </Text>
              )}
            </View>
            <TouchableOpacity
              className="px-4 py-2 rounded-xl shadow-lg"
              onPress={() => router.push("/screens/editProfile")}
            >
              <Text className="color-white text-lg font-semibold rounded-full bg-slate-400 px-2 py-1">
                Complete profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView
          className="flex flex-column w-full px-6 py-8"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ minHeight: "80%" }}
        >
          {gender !== null && (
            <Text className="color-white text-lg font-semibold py-2">
              Gender:{" "}
              {gender === 1
                ? "Male"
                : gender === 2
                ? "Female"
                : gender === 3
                ? "Other"
                : "Not specified"}
            </Text>
          )}
          {interestedIn !== null && (
            <Text className="color-white text-lg font-semibold py-2">
              Interested in:{" "}
              {interestedIn === 1
                ? "Male"
                : interestedIn === 2
                ? "Female"
                : interestedIn === 3
                ? "Other"
                : interestedIn === 4
                ? "Any"
                : "Not specified"}
            </Text>
          )}
          {mob && dob && yob && (
            <Text className="color-white text-lg font-semibold py-2">
              Date of Birth:{" "}
              {mob === 1
                ? "January"
                : mob === 2
                ? "February"
                : mob === 3
                ? "March"
                : mob === 4
                ? "April"
                : mob === 5
                ? "May"
                : mob === 6
                ? "June"
                : mob === 7
                ? "July"
                : mob === 8
                ? "August"
                : mob === 9
                ? "September"
                : mob === 10
                ? "October"
                : mob === 11
                ? "November"
                : mob === 12
                ? "December"
                : "Not specified"}{" "}
              {dob}, {yob} 🎂
            </Text>
          )}
          {height && (
            <Text className="color-white text-lg font-semibold py-2">
              Height: {height} cm
            </Text>
          )}
          {weight && (
            <Text className="color-white text-lg font-semibold py-2">
              Weight: {weight} kg
            </Text>
          )}
          {phone && (
            <Text className="color-white text-lg font-semibold py-2">
              Phone No.: {phone}
            </Text>
          )}
          {religion && (
            <Text className="color-white text-lg font-semibold py-2">
              Religion:{" "}
              {religion === 1
                ? "Hinduism"
                : religion === 2
                ? "Jainism"
                : religion === 3
                ? "Buddhism"
                : religion === 4
                ? "Sikhism"
                : religion === 5
                ? "Islam"
                : religion === 6
                ? "Christianity"
                : religion === 7
                ? "Judaism"
                : religion === 8
                ? "Zoroastrianism"
                : religion === 9
                ? "Spiritual"
                : religion === 10
                ? "Others"
                : religion === 11
                ? "Atheism"
                : "Not specified"}
            </Text>
          )}
          {caste && (
            <Text className="color-white text-lg font-semibold py-2">
              Caste: {caste}
            </Text>
          )}
          {maritalStatus !== null && (
            <Text className="color-white text-lg font-semibold py-2">
              Married: {maritalStatus ? "Married" : "Unmarried"}
            </Text>
          )}
          {languages.length > 0 && (
            <View className="flex flex-row max-w-80">
              <Text className="color-white text-lg font-semibold py-2 pr-1">
                Languages:
              </Text>
              <View className="flex flex-row flex-wrap items-center">
                {languages.map(
                  (item, index) =>
                    item && (
                      <Text
                        className="color-white text-lg font-semibold p-2 mx-2 my-1 border-2 border-blue-400 bg-slate-800 rounded-xl"
                        key={index}
                      >
                        {item}
                      </Text>
                    )
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
