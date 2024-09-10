import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { MessagingStackScreens } from "../../Constants/UI";
import { Contacts } from "../../Screens/Messages/Contacts";

const MessagingStack = createStackNavigator();

const MessagingStackScreen = () => (
  <MessagingStack.Navigator screenOptions={{ headerShown: false }}>
    <MessagingStack.Screen
      name={MessagingStackScreens.Contacts}
      component={Contacts}
    />
  </MessagingStack.Navigator>
);

export default MessagingStackScreen;
