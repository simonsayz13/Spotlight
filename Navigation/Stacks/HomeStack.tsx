import React from "react";
import Post from "../../Screens/Home/Post";
import { HomeScreen } from "../../Screens/Home/Home";
import { HomeStackScreens } from "../../Constants/UI";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const HomeStack = createNativeStackNavigator();

const HomeStackScreen = () => (
  <HomeStack.Navigator screenOptions={{ headerShown: false }}>
    <HomeStack.Screen name={HomeStackScreens.Home} component={HomeScreen} />
    <HomeStack.Screen name={HomeStackScreens.Post} component={Post} />
  </HomeStack.Navigator>
);

export default HomeStackScreen;
