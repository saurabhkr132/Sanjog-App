import * as dotenv from 'dotenv';
dotenv.config();

export default {
  expo: {
    name: "Sanjog",
    slug: "sanjog",
    description: "Connecting the people",
    version: "1.0.4",
    orientation: "portrait",
    icon: "./assets/images/logo.png",
    scheme: "myapp",
    splash: {
      image: "./assets/images/logo.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    sdkVersion: "52.0.0",
    extra: {
      FIREBASE_API_KEY: process.env.FIREBASE_API_KEY,
      FIREBASE_AUTH_DOMAIN: process.env.FIREBASE_AUTH_DOMAIN,
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
      FIREBASE_STORAGE_BUCKET: process.env.FIREBASE_STORAGE_BUCKET,
      FIREBASE_MESSAGING_SENDER_ID: process.env.FIREBASE_MESSAGING_SENDER_ID,
      FIREBASE_APP_ID: process.env.FIREBASE_APP_ID,
      FIREBASE_DATABASE_URL: process.env.FIREBASE_DATABASE_URL,
      CLOUDINARY_UPLOAD_URL: process.env.CLOUDINARY_UPLOAD_URL,
      CLOUDINARY_DELETE_URL: process.env.CLOUDINARY_DELETE_URL,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
      CLOUDINARY_UPLOAD_PRESET: process.env.CLOUDINARY_UPLOAD_PRESET,
      eas: {
        projectId: "fc5d6abb-60e6-4364-afe2-6b7e84b2597f",
      },
    },
    android: {
      package: "com.sanjog.sanjog",
      compileSdkVersion: 35,
      targetSdkVersion: 35
    },
    plugins: [
      [
        "expo-build-properties",
        {
          android: {
            compileSdkVersion: 35,
            targetSdkVersion: 35,
            minSdkVersion: 24,
          },
        },
      ],
    ],
  },
};
