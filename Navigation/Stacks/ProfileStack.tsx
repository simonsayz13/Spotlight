import React from "react";
import { ProfileStackScreens } from "../../Constants/UI";
import { LoginSignUpScreen } from "../../Screens/Profile/LoginSignUp";
import Login from "../../Screens/Profile/Login";
import Register from "../../Screens/Profile/Register";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../../Screens/Profile/Profile";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import EditProfile from "../../Screens/Profile/EditProfile";

const ProfileStack = createNativeStackNavigator();

const ProfileStackScreen = () => {
  const userId = useSelector((state: RootState) => state.user.userId);
  const initialRouteName = userId
    ? ProfileStackScreens.Profile
    : ProfileStackScreens.LoginSignUp;

  return (
    <ProfileStack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <ProfileStack.Screen
        name={ProfileStackScreens.LoginSignUp}
        component={LoginSignUpScreen}
      />
      <ProfileStack.Screen name={ProfileStackScreens.Login} component={Login} />
      <ProfileStack.Screen
        name={ProfileStackScreens.Register}
        component={Register}
      />
      <ProfileStack.Screen
        name={ProfileStackScreens.Profile}
        component={Profile}
        options={{ gestureEnabled: false }}
      />
      <ProfileStack.Screen
        name={ProfileStackScreens.EditProfile}
        component={EditProfile}
      />
    </ProfileStack.Navigator>
  );
};

export default ProfileStackScreen;
