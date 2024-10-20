import React from "react";
import { ProfileStackScreens } from "../../Constants/UI";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Profile from "../../Screens/Profile/Profile";
import EditProfile from "../../Screens/Profile/EditProfile";

const ProfileStack = createNativeStackNavigator();

const ProfileStackScreen = () => {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
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
