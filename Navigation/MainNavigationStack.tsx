import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigation from "./TabNavigation";
import {
  HomeStackScreens,
  MessagingStackScreens,
  MiscStackScreens,
  PostStackScreens,
} from "../Constants/UI";
import Post from "../Screens/Home/Post";
import Chat from "../Screens/Messages/Chat";
import PhotoBrowser from "../Screens/Misc/PhotoBrowser";
import {
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import ImageCropScreen from "../Screens/Misc/ImageCropper";
import { CreatePost } from "../Screens/Post/CreatePost";
const MainStack = createStackNavigator();

const MainNavigationStack = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name={"MainTab"} component={TabNavigation} />
    <MainStack.Screen name={HomeStackScreens.Post} component={Post} />
    <MainStack.Screen name={MessagingStackScreens.Chat} component={Chat} />
    <MainStack.Screen
      name={MiscStackScreens.PhotoBrowser}
      component={PhotoBrowser}
      options={{
        gestureDirection: "vertical",
        presentation: "modal",
      }}
    />
    <MainStack.Screen
      name={MiscStackScreens.ImageCropper}
      component={ImageCropScreen}
    />
  </MainStack.Navigator>
);

export default MainNavigationStack;
