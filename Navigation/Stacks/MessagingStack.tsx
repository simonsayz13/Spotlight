import React from "react";
import { MessagingStackScreens } from "../../Constants/UI";
import { Contacts } from "../../Screens/Messages/Contacts";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const MessagingStack = createNativeStackNavigator();

const MessagingStackScreen = () => (
  <MessagingStack.Navigator screenOptions={{ headerShown: false }}>
    <MessagingStack.Screen
      name={MessagingStackScreens.Contacts}
      component={Contacts}
    />
  </MessagingStack.Navigator>
);

export default MessagingStackScreen;
