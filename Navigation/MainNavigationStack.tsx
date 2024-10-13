import React from "react";
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
import ImageCropScreen from "../Screens/Misc/ImageCropper";
import Profile from "../Screens/Profile/Profile";
import { Camera } from "../Screens/Post/Camera";
import { ViewPhoto } from "../Screens/Post/ViewPhoto";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { CreatePost } from "../Screens/Post/CreatePost";
import ViewProfile from "../Screens/Profile/ViewProfile";
const MainStack = createNativeStackNavigator();

const MainNavigationStack = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name={"MainTab"} component={TabNavigation} />
    <MainStack.Screen
      name={HomeStackScreens.Post}
      component={Post}
      options={({ route }: any) => ({
        animation:
          route.params?.customAnimation === true
            ? "slide_from_bottom"
            : "slide_from_right",
      })}
    />
    <MainStack.Screen name={MessagingStackScreens.Chat} component={Chat} />
    <MainStack.Screen
      name={MiscStackScreens.PhotoBrowser}
      component={PhotoBrowser}
      options={{
        presentation: "modal", // Equivalent to gestureDirection: 'vertical'
        animation: "slide_from_bottom",
      }}
    />
    <MainStack.Screen
      name={MiscStackScreens.ImageCropper}
      component={ImageCropScreen}
    />
    <MainStack.Screen name={ProfileStackScreens.Profile} component={Profile} />
    <MainStack.Screen
      name={PostStackScreens.CreatePost}
      component={CreatePost}
      options={{
        animation: "slide_from_bottom",
      }}
    />
    <MainStack.Screen name={PostStackScreens.Camera} component={Camera} />
    <MainStack.Screen name={PostStackScreens.ViewPhoto} component={ViewPhoto} />
    <MainStack.Screen
      name={ProfileStackScreens.ViewProfile}
      component={ViewProfile}
    />
  </MainStack.Navigator>
);

export default MainNavigationStack;
