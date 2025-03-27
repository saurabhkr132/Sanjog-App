import { Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import { database, ref, onValue } from "@/FirebaseConfig";

const Test = () => {
  const [val1, setVal1] = useState(null);
  
  useEffect(() => {
    const dbRef = ref(database, "value"); // Ensure correct path
    onValue(
      dbRef,
      (snapshot) => {
        if (snapshot.exists()) {
          console.log("Data received:", snapshot.val()); // ✅ Debugging Log
          setVal1(snapshot.val());
        } else {
          console.log("No data available");
        }
      },
      (error) => {
        console.error("Error reading data:", error);
      }
    );
  }, [database]);
  

  return (
    <View className="flex-1 justify-center items-center bg-dark-200 gap-12">
      <Text className="text-5xl text-white">Test! {val1}</Text>
      
      <TouchableOpacity className="w-[90%] bg-indigo-500 p-5 rounded-lg items-center justify-center shadow-lg mt-4" 
      onPress={() => router.push("/")}
      >
        
        <Text className="text-white text-lg font-semibold">Home</Text>
      </TouchableOpacity>
    </View>
  );
}

export default Test
