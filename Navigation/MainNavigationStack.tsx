import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigation from "./TabNavigation";
import { HomeStackScreens, MessagingStackScreens } from "../Constants/UI";
import Post from "../Screens/Home/Post";
import Chat from "../Screens/Messages/Chat";
const MainStack = createNativeStackNavigator();

const MainNavigationStack = () => (
  <MainStack.Navigator screenOptions={{ headerShown: false }}>
    <MainStack.Screen name={"MainTab"} component={TabNavigation} />
    <MainStack.Screen name={HomeStackScreens.Post} component={Post} />
    <MainStack.Screen name={MessagingStackScreens.Chat} component={Chat} />
  </MainStack.Navigator>
);

export default MainNavigationStack;
