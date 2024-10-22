import React from "react";
import { ProfileStackScreens } from "../../Constants/UI";
import { LoginSignUpScreen } from "../../Screens/Profile/LoginSignUp";
import Login from "../../Screens/Profile/Login";
import Register from "../../Screens/Profile/Register";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const ProfileStack = createNativeStackNavigator();

const LoginSignInStackScreen = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen
        name={ProfileStackScreens.LoginSignUp}
        component={LoginSignUpScreen}
      />
      <ProfileStack.Screen name={ProfileStackScreens.Login} component={Login} />
      <ProfileStack.Screen
        name={ProfileStackScreens.Register}
        component={Register}
      />
    </ProfileStack.Navigator>
  );
};

export default LoginSignInStackScreen;
