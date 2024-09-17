import AsyncStorage from "@react-native-async-storage/async-storage";
import { getApps, initializeApp } from "firebase/app";
import { getReactNativePersistence, initializeAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDVGogj64hXPp1s1Pc5HsLnLm6rmTZz2LU",
  authDomain: "project-1337-23378.firebaseapp.com",
  projectId: "project-1337-23378",
  storageBucket: "project-1337-23378.appspot.com",
  messagingSenderId: "487959376506",
  appId: "1:487959376506:web:7c6e80b925c791b15541c3",
  measurementId: "G-4MR3EBVSNX",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default app;
