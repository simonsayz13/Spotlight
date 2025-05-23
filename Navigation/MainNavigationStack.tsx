import React from "react";
import TabNavigation from "./TabNavigation";
import {
  HomeStackScreens,
  MainStacks,
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
import { useSelector } from "react-redux";
import LoginSignInStackScreen from "./Stacks/LoginSignInStack";
import { RootState } from "../Redux/store";
import FollowStackScreen from "./Stacks/FollowStack";
import EditPost from "../Screens/Post/EditPost";
const MainStack = createNativeStackNavigator();
const MainNavigationStack = () => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const initialRouteName = userId ? MainStacks.MainTab : MainStacks.Login;
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={initialRouteName}
    >
      <MainStack.Screen
        name={MainStacks.Login}
        component={LoginSignInStackScreen}
      />
      <MainStack.Screen name={MainStacks.MainTab} component={TabNavigation} />
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
      <MainStack.Screen
        name={ProfileStackScreens.Profile}
        component={Profile}
      />
      <MainStack.Screen
        name={PostStackScreens.CreatePost}
        component={CreatePost}
        options={{
          animation: "slide_from_bottom",
        }}
      />
      <MainStack.Screen name={PostStackScreens.Camera} component={Camera} />
      <MainStack.Screen
        name={PostStackScreens.ViewPhoto}
        component={ViewPhoto}
      />
      <MainStack.Screen
        name={ProfileStackScreens.ViewProfile}
        component={ViewProfile}
      />
      <MainStack.Screen
        name={"FollowStack"}
        component={FollowStackScreen}
        options={{ headerShown: false }}
      />
      <MainStack.Screen
        name={PostStackScreens.EditPost}
        component={EditPost}
        options={{
          presentation: "modal", // Equivalent to gestureDirection: 'vertical'
          animation: "slide_from_bottom",
        }}
      />
      <MainStack.Screen name={"appUserProfileView"} component={Profile} />
    </MainStack.Navigator>
  );
};

export default MainNavigationStack;
