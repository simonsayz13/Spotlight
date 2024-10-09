import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigation from "./TabNavigation";
import {
  HomeStackScreens,
  MessagingStackScreens,
  MiscStackScreens,
  PostStackScreens,
  ProfileStackScreens,
} from "../Constants/UI";
import Post from "../Screens/Home/Post";
import Chat from "../Screens/Messages/Chat";
import PhotoBrowser from "../Screens/Misc/PhotoBrowser";
import {
  CardStyleInterpolators,
  TransitionPresets,
  createStackNavigator,
} from "@react-navigation/stack";
import ImageCropScreen from "../Screens/Misc/ImageCropper";
import { CreatePost } from "../Screens/Post/CreatePost";
import Profile from "../Screens/Profile/Profile";
const MainStack = createStackNavigator();

const MainNavigationStack = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name={"MainTab"} component={TabNavigation} />
    <MainStack.Screen
      name={HomeStackScreens.Post}
      component={Post}
      options={({ route }: any) => ({
        cardStyleInterpolator:
          route.params?.customAnimation === true
            ? CardStyleInterpolators.forVerticalIOS
            : CardStyleInterpolators.forHorizontalIOS,
      })}
    />
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
    <MainStack.Screen name={ProfileStackScreens.Profile} component={Profile} />
  </MainStack.Navigator>
);

export default MainNavigationStack;
