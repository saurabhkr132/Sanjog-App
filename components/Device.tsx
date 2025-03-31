import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { ref, get } from "firebase/database";
import { database } from "@/FirebaseConfig"; // Adjust the import based on your project structure

const Device = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [deviceData, setDeviceData] = useState<{
    mac?: string;
    location?: string;
  }>({});
  const [loading, setLoading] = useState(false);

  // Fetch ESP32 Data from Firebase
  const fetchDeviceData = async () => {
    setLoading(true);
    try {
      const snapshot = await get(ref(database, "esp32Device"));
      if (snapshot.exists()) {
        setDeviceData(snapshot.val());
      } else {
        setDeviceData({ mac: "N/A", location: "Unknown" });
      }
    } catch (error) {
      console.error("Error fetching ESP32 data:", error);
    }
    setLoading(false);
  };

  return (
    <View className="bg-gray-900 p-4 rounded-lg shadow-lg w-full items-center">
      <View className="mb-4">
        <Image
          className="w-56 h-56 "
          source={require("@/assets/images/device.jpg")}
          resizeMode="contain"
        />
      </View>
      <TouchableOpacity
        onPress={() => {
          fetchDeviceData();
          setModalVisible(true);
        }}
        className="bg-blue-500 px-4 py-2 rounded-lg"
      >
        <Text className="text-white text-lg font-semibold">
          View ESP32 Status
        </Text>
      </TouchableOpacity>

      {/* Status Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white p-6 rounded-lg w-80 shadow-lg">
              <Text className="text-xl font-bold text-center mb-4">
                Your device
              </Text>

              {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
              ) : (
                <>
                  <Text className="text-lg">
                    🔹 MAC Address: {deviceData.mac || "Unknown"}
                  </Text>
                  <Text className="text-lg mt-2">
                    📍 Location: {deviceData.location || "Unknown"}
                  </Text>
                </>
              )}
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                className="mt-4 bg-red-500 p-2 rounded"
              >
                <Text className="text-white text-center">Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default Device;
