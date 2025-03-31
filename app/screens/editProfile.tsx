import {
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  SafeAreaView,
  View,
  ScrollView,
  Alert,
  Modal,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  getAuth,
  deleteUser,
} from "firebase/auth";
import { get, ref, update, getDatabase, remove } from "firebase/database";
import { database } from "@/FirebaseConfig";
import { useRouter } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Ionicons } from "@expo/vector-icons";

const EditProfile = () => {
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

  const [password, setPassword] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const auth = getAuth();
  const user = auth.currentUser;
  const database = getDatabase();
  const router = useRouter();

  const [language, setLanguage] = useState("");
  const addLanguage = () => {
    if (language.trim()) {
      setLanguages([...languages, language.trim()]);
      setLanguage("");
    }
  };
  const removeLanguage = (index: number) => {
    const newItems = languages.filter((_, i) => i !== index);
    setLanguages(newItems);
  };

  const dates = Array.from({ length: 31 }, (_, i) => i + 1);

  const months = [
    { number: 1, name: "January" },
    { number: 2, name: "February" },
    { number: 3, name: "March" },
    { number: 4, name: "April" },
    { number: 5, name: "May" },
    { number: 6, name: "June" },
    { number: 7, name: "July" },
    { number: 8, name: "August" },
    { number: 9, name: "September" },
    { number: 10, name: "October" },
    { number: 11, name: "November" },
    { number: 12, name: "December" },
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 70 }, (_, i) => currentYear - 70 + i);

  const religionArray = [
    { number: 1, name: "Hinduism" },
    { number: 2, name: "Jainism" },
    { number: 3, name: "Buddhism" },
    { number: 4, name: "Sikhism" },
    { number: 5, name: "Islam" },
    { number: 6, name: "Christianity" },
    { number: 7, name: "Judaism" },
    { number: 8, name: "Zoroastrianism" },
    { number: 9, name: "Spiritual" },
    { number: 10, name: "Others" },
    { number: 11, name: "Atheism" },
  ];

  const updateProfile = async () => {
    if (!user || !name.trim()) {
      alert("Atleast enter your name!");
      return;
    }

    try {
      const profileRef = ref(database, `users/${user.uid}`);

      await update(profileRef, {
        name,
        gender,
        interestedIn,
        dateOfBirth: dob,
        monthOfBirth: mob,
        yearOfBirth: yob,
        height,
        weight,
        religion,
        caste,
        languages,
        maritalStatus,
      });
      router.push("/profile");
    } catch (error) {
      console.error("Error updating name: ", error);
      alert("Failed to update the profile!");
    }
  };

  useEffect(() => {
    fetchProfileDetails();
  }, [user]);

  const fetchProfileDetails = async () => {
    if (user) {
      const profileRef = ref(database, `users/${user.uid}`);
      const snapshot = await get(profileRef);

      const profileData = snapshot.val();

      setName(profileData.name || "");
      setGender(profileData.gender || null);
      setInterestedIn(profileData.interestedIn || null);
      setDob(profileData.dateOfBirth || null);
      setMob(profileData.monthOfBirth || null);
      setYob(profileData.yearOfBirth || null);
      setHeight(profileData.height || null);
      setWeight(profileData.weight || null);
      setReligion(profileData.religion || null);
      setCaste(profileData.caste || "");
      setLanguages(profileData.languages || "");
      setMaritalStatus(
        profileData.maritalStatus === true ? true : profileData.maritalStatus === false ? false : null
      );
    } else {
      console.log("No user logged in");
    }
  };

  return (
    <SafeAreaView className="bg-dark-200 flex-1">
      <ScrollView
        className="flex flex-column w-full px-6 py-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%" }}
      >
        <View className="mx-2 mt-4 flex flex-row items-center gap-2">
          <TouchableOpacity
            className="py-2 rounded-xl shadow-lg"
            onPress={() => router.push("/profile")}
          >
            <Ionicons name="chevron-back" size={24} color="white" />
          </TouchableOpacity>
          <Text className=" color-white text-3xl font-semibold">
            Edit Profile
          </Text>
        </View>
        <View className="flex flex-row items-center border-y-2 my-2">
          <Text className="color-white text-lg font-semibold py-2">Name: </Text>
          <TextInput
            className="color-white bg-dark-300 border-2 border-indigo-100 rounded-lg px-6 py-3 my-2 min-w-36"
            placeholder="User Name"
            placeholderTextColor="gray"
            value={name}
            onChangeText={(text) => setName(text)}
          />
        </View>
        <View className="flex flex-row items-center border-b-2 pb-2">
          <Text className="color-white text-lg font-semibold py-2">
            Gender:{" "}
          </Text>
          <View className="flex flex-row space-x-4">
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${
                gender === 1 ? "bg-indigo-500" : "bg-dark-300"
              }`}
              onPress={() => setGender(1)}
            >
              <Text
                className={`${gender === 1 ? "text-white" : "text-gray-300"}`}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${
                gender === 2 ? "bg-indigo-500" : "bg-dark-300"
              }`}
              onPress={() => setGender(2)}
            >
              <Text
                className={`${gender === 2 ? "text-white" : "text-gray-300"}`}
              >
                Female
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${
                gender === 3 ? "bg-indigo-500" : "bg-dark-300"
              }`}
              onPress={() => setGender(3)}
            >
              <Text
                className={`${gender === 3 ? "text-white" : "text-gray-300"}`}
              >
                Other
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex flex-row items-center border-b-2 pb-2">
          <Text className="color-white text-lg font-semibold py-2">
            Interested in:{" "}
          </Text>
          <View className="flex flex-row space-x-4">
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${
                interestedIn === 1 ? "bg-indigo-500" : "bg-dark-300"
              }`}
              onPress={() => setInterestedIn(1)}
            >
              <Text
                className={`${
                  interestedIn === 1 ? "text-white" : "text-gray-300"
                }`}
              >
                Male
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${
                interestedIn === 2 ? "bg-indigo-500" : "bg-dark-300"
              }`}
              onPress={() => setInterestedIn(2)}
            >
              <Text
                className={`${
                  interestedIn === 2 ? "text-white" : "text-gray-300"
                }`}
              >
                Female
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${
                interestedIn === 3 ? "bg-indigo-500" : "bg-dark-300"
              }`}
              onPress={() => setInterestedIn(3)}
            >
              <Text
                className={`${
                  interestedIn === 3 ? "text-white" : "text-gray-300"
                }`}
              >
                Other
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${
                interestedIn === 4 ? "bg-indigo-500" : "bg-dark-300"
              }`}
              onPress={() => setInterestedIn(4)}
            >
              <Text
                className={`${
                  interestedIn === 4 ? "text-white" : "text-gray-300"
                }`}
              >
                Any
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <View className="flex flex-column border-b-2">
          <View className="flex flex-row items-center">
            <Text className="color-white text-lg font-semibold">
              Date of Birth:
            </Text>
            <Picker
              selectedValue={String(dob)}
              onValueChange={(itemValue) => setDob(parseInt(itemValue, 10))}
              style={{ height: 50, width: 100, color: "white" }}
            >
              <Picker.Item label="Select Date" value="" />
              {dates.map((date) => (
                <Picker.Item
                  key={date}
                  label={String(date)}
                  value={date.toString()}
                />
              ))}
            </Picker>
            <Picker
              selectedValue={mob !== null ? mob.toString() : ""}
              onValueChange={(itemValue) => setMob(parseInt(itemValue, 10))}
              style={{ height: 50, width: 200, color: "white" }}
            >
              <Picker.Item label="Select Month" value="" />
              {months.map((month) => (
                <Picker.Item
                  key={month.number}
                  label={month.name}
                  value={month.number.toString()}
                />
              ))}
            </Picker>
          </View>
          <View className="ml-24">
            <Picker
              selectedValue={String(yob)}
              onValueChange={(itemValue) => setYob(parseInt(itemValue, 10))}
              style={{
                height: 50,
                width: 200,
                marginBottom: 20,
                color: "white",
              }}
            >
              <Picker.Item label="Select Year" value="" />
              {years.map((year) => (
                <Picker.Item
                  key={year}
                  label={String(year)}
                  value={year.toString()}
                />
              ))}
            </Picker>
          </View>
        </View>
        <View className="flex flex-row items-center border-b-2 pb-2 pt-2">
          <Text className="color-white text-lg font-semibold py-2">
            Height:{" "}
          </Text>
          <TextInput
            className="color-white bg-dark-300 border-2 border-indigo-100 rounded-lg px-6 py-3 min-w-24"
            placeholder="Height"
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={height !== null ? height.toString() : ""}
            onChangeText={(text) =>
              setHeight(text.trim() === "" ? null : parseFloat(text))
            }
          />
          <Text className="color-white text-lg font-semibold py-2"> cm</Text>
        </View>
        <View className="flex flex-row items-center border-b-2">
          <Text className="color-white text-lg font-semibold py-2">
            Weight:{" "}
          </Text>
          <TextInput
            className="color-white bg-dark-300 border-2 border-indigo-100 rounded-lg px-6 py-3 my-2 min-w-24"
            placeholder="Weight"
            placeholderTextColor="gray"
            keyboardType="numeric"
            value={weight !== null ? weight.toString() : ""}
            onChangeText={(text) =>
              setWeight(text.trim() === "" ? null : parseFloat(text))
            }
          />
          <Text className="color-white text-lg font-semibold py-2"> kg</Text>
        </View>
        <View className="flex flex-row items-center border-b-2 mb-2">
          <Text className="color-white text-lg font-semibold">Religion: </Text>
          <Picker
            selectedValue={religion !== null ? religion.toString() : ""}
            onValueChange={(itemValue) => setReligion(parseInt(itemValue, 10))}
            style={{ height: 50, width: 200, color: "white" }}
          >
            <Picker.Item label="Select Religion" value="" />
            {religionArray.map((religion) => (
              <Picker.Item
                key={religion.number}
                label={religion.name}
                value={religion.number.toString()}
              />
            ))}
          </Picker>
          {/* <Picker
              selectedValue={mob !== null ? mob.toString() : ""}
              onValueChange={(itemValue) => setMob(parseInt(itemValue, 10))}
              style={{ height: 50, width: 200, color: "white" }}
            >
              <Picker.Item label="Select Month" value="" />
              {months.map((month) => (
                <Picker.Item
                  key={month.number}
                  label={month.name}
                  value={month.number.toString()}
                />
              ))}
            </Picker> */}
        </View>
        <View className="flex flex-row items-center">
          <Text className="color-white text-lg font-semibold py-2">
            Caste:{" "}
          </Text>
          <TextInput
            className="color-white bg-dark-300 border-2 border-indigo-100 rounded-lg px-6 py-3 min-w-36"
            placeholder="Caste"
            placeholderTextColor="gray"
            value={caste}
            onChangeText={(text) => setCaste(text)}
          />
        </View>
        <View className="mb-2 border-y-2 my-2 pb-2">
          <Text className="color-white text-lg font-semibold py-2">
            Languages:
          </Text>
          <TextInput
            className="color-white bg-dark-300 border-2 border-indigo-100 rounded-lg mx-6 px-6 py-3 min-w-36 my-2"
            placeholder="Enter a language"
            placeholderTextColor="gray"
            value={language}
            onChangeText={setLanguage}
          />
          <TouchableOpacity
            className="bg-indigo-500 p-3 rounded-lg my-2 w-56 ml-20"
            onPress={addLanguage}
          >
            <Text className="mx-6 text-white text-center">Add</Text>
          </TouchableOpacity>

          <FlatList
            data={languages}
            keyExtractor={(item, index) => index.toString()}
            nestedScrollEnabled={true}
            scrollEnabled={false}
            renderItem={({ item, index }) => (
              <View className="flex-row justify-between items-center bg-gray-800 p-2 rounded my-1 mx-6">
                <Text className="text-white bg-gray-800 p-2 rounded my-1">
                  {item}
                </Text>
                <TouchableOpacity
                  className="bg-red-500 px-3 py-1 rounded"
                  onPress={() => removeLanguage(index)}
                >
                  <Text className="text-white">Remove</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
        <View className="flex flex-row items-center border-b-2 pb-2">
          <Text className="color-white text-lg font-semibold py-2">
            Marital Status:{" "}
          </Text>
          <View className="flex flex-row space-x-4">
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${
                maritalStatus && maritalStatus != null
                  ? "bg-indigo-500"
                  : "bg-dark-300"
              }`}
              onPress={() => setMaritalStatus(true)}
            >
              <Text
                className={`${
                  maritalStatus && maritalStatus != null
                    ? "text-white"
                    : "text-gray-300"
                }`}
              >
                Married
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className={`px-4 py-2 rounded-lg ${
                !maritalStatus && maritalStatus === false
                  ? "bg-indigo-500"
                  : "bg-dark-300"
              }`}
              onPress={() => setMaritalStatus(false)}
            >
              <Text
                className={`${
                  !maritalStatus && maritalStatus === false
                    ? "text-white"
                    : "text-gray-300"
                }`}
              >
                Unmarried
              </Text>
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          className="px-2 py-3 mt-8 mb-16 rounded-lg shadow-lg border-2 bg-indigo-500"
          onPress={updateProfile}
        >
          <Text className="color-white text-lg font-semibold text-center">
            Save
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EditProfile;
