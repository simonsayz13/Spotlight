import React from "react";
import { ProfileStackScreens } from "../../Constants/UI";
import SignIn from "../../Screens/Profile/SignIn";
import SignUp from "../../Screens/Profile/SignUp";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const ProfileStack = createNativeStackNavigator();

const LoginSignInStackScreen = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen
        name={ProfileStackScreens.SignIn}
        component={SignIn}
      />
      <ProfileStack.Screen
        name={ProfileStackScreens.SignUp}
        component={SignUp}
      />
    </ProfileStack.Navigator>
  );
};

export default LoginSignInStackScreen;
