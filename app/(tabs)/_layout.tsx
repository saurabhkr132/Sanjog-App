import React from "react";
import { View, Text, ImageBackground } from "react-native";
import { Tabs } from "expo-router";
import FontAwesome from '@expo/vector-icons/FontAwesome';

const _layout = () => {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: '#0f0d23',
          height: 64,
          position: 'absolute',
          overflow: 'hidden',
        },
        tabBarIconStyle: {
          height: 50,
          width: 50,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <View>
                <View className={`text-3xl p-2 border-2 rounded-xl ${focused ? "border-blue-400 bg-slate-800" : "border-transparent"}`}><FontAwesome name="home" size={32} color="#ADD8E6" /></View>
              </View>
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <>
              <View>
                <View className={`text-3xl py-2 px-3 border-2 rounded-xl ${focused ? "border-blue-400 bg-slate-800" : "border-transparent"}`}><FontAwesome name="user" size={32} color="#ADD8E6" /></View>
              </View>
            </>
          ),
        }}
      />
    </Tabs>
  );
};

export default _layout;
