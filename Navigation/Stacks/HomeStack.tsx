import React from "react";
import { HomeStackScreens } from "../../Constants/UI";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeTopTabNavigation from "../HomeTopTabNavigation";

const HomeStack = createNativeStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen
      name={HomeStackScreens.Home}
      component={HomeTopTabNavigation}
    />
  </HomeStack.Navigator>
);

export default HomeStackScreen;
