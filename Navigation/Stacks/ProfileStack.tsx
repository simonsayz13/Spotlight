import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { HomeScreen } from "../../Screens/Home/Home";
import { ProfileStackScreens } from "../../Constants/UI";
import { ProfileScreen } from "../../Screens/Profile/Profile";
import Login from "../../Screens/Profile/Login";
import Register from "../../Screens/Profile/Register";

const ProfileStack = createStackNavigator();

const ProfileStackScreen = () => (
  <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
    <ProfileStack.Screen
      name={ProfileStackScreens.Profile}
      component={ProfileScreen}
    />
    <ProfileStack.Screen name={ProfileStackScreens.Login} component={Login} />
    <ProfileStack.Screen
      name={ProfileStackScreens.Register}
      component={Register}
    />
  </ProfileStack.Navigator>
);

export default ProfileStackScreen;
