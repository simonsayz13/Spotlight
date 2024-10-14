import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./Stacks/HomeStack";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Map } from "../Screens/Map/Map";
import ProfileStack from "./Stacks/ProfileStack";
import {
  NavigationTabs,
  PostStackScreens,
  ThemeColoursPrimary,
} from "../Constants/UI";
import MessagingStackScreen from "./Stacks/MessagingStack";

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get("window");

const TabNavigation = ({ navigation }: any) => {
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? undefined : "height"}
      keyboardVerticalOffset={Platform.OS === "android" ? -60 : 0}
    >
      {/* Main Tab Navigator */}
      <Tab.Navigator
        initialRouteName={NavigationTabs.Contents}
        screenOptions={{
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarActiveTintColor: ThemeColoursPrimary.SecondaryColour,
          tabBarInactiveTintColor: ThemeColoursPrimary.SecondaryColour,
          tabBarLabelStyle: {
            fontWeight: "bold",
            backgroundColor: ThemeColoursPrimary.PrimaryColour,
          },
          tabBarStyle: {
            backgroundColor: ThemeColoursPrimary.PrimaryColour,
            borderTopWidth: 0,
            ...Platform.select({
              ios: {
                shadowColor: "#000", // Shadow color
                shadowOffset: { width: 0, height: 2 }, // Offset for the shadow
                shadowOpacity: 0.2, // Shadow opacity
                shadowRadius: 3, // Radius of the shadow
              },
              android: {
                elevation: 20, // Elevation for Android shadow
              },
            }),
          },
        }}
      >
        <Tab.Screen
          name={NavigationTabs.Home}
          component={HomeStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={28}
                color={ThemeColoursPrimary.SecondaryColour}
              />
            ),
          }}
        />
        <Tab.Screen
          name={NavigationTabs.Map}
          component={Map}
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "map" : "map-outline"}
                size={28}
                color={ThemeColoursPrimary.SecondaryColour}
              />
            ),
            tabBarItemStyle: { marginRight: 30 }, // Adjust this to control the space
          }}
        />
        <Tab.Screen
          name={NavigationTabs.Messages}
          component={MessagingStackScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "chatbox-ellipses" : "chatbox-ellipses-outline"}
                size={28}
                color={ThemeColoursPrimary.SecondaryColour}
              />
            ),
            tabBarItemStyle: { marginLeft: 30 },
          }}
        />
        <Tab.Screen
          name={NavigationTabs.Me}
          component={ProfileStack}
          options={{
            tabBarIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={28}
                color="black"
              />
            ),
          }}
        />
      </Tab.Navigator>

      {/* Custom Floating Post Button */}
      <TouchableOpacity
        style={styles.customPostButton}
        onPress={() => navigation.navigate(PostStackScreens.CreatePost)} // Navigate to your Post screen
        activeOpacity={1}
      >
        <FontAwesome
          name="plus-square-o"
          size={40}
          color={ThemeColoursPrimary.LogoColour}
        />
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  customPostButton: {
    position: "absolute",
    bottom: Platform.OS === "ios" ? 30 : 2, // Adjust position for different platforms
    left: width / 2 - 30, // Center the button horizontally
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    borderRadius: 35,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5, // Android shadow
  },
});

export default TabNavigation;
