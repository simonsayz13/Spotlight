import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Platform,
  View,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./Stacks/HomeStack";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Map } from "../Screens/Map/Map";
import ProfileStack from "./Stacks/ProfileStack";
import {
  NavigationTabs,
  PostStackScreens,
  ThemeColoursPrimary,
} from "../Constants/UI";
import MessagingStackScreen from "./Stacks/MessagingStack";
import Feather from "@expo/vector-icons/Feather";
import { CreatePost } from "../Screens/Post/CreatePost";

const Tab = createBottomTabNavigator();
const { width, height } = Dimensions.get("window");

const TabNavigation = ({ navigation }: any) => {
  return (
    <View style={{ flex: 1 }}>
      {/* Main Tab Navigator */}
      <Tab.Navigator
        initialRouteName={NavigationTabs.Home}
        screenOptions={{
          tabBarHideOnKeyboard: true,
          headerShown: false,
          tabBarActiveTintColor: ThemeColoursPrimary.SecondaryColour,
          tabBarInactiveTintColor: ThemeColoursPrimary.SecondaryColour,
          tabBarLabelStyle: {
            fontWeight: "bold",
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
          }}
        />

        <Tab.Screen
          name={NavigationTabs.CreatePost}
          component={CreatePost}
          options={{
            tabBarButton: (props) => (
              <View style={{ alignItems: "center", justifyContent: "center" }}>
                <TouchableOpacity
                  style={styles.customPostButton}
                  onPress={() =>
                    navigation.navigate(PostStackScreens.CreatePost)
                  } // Navigate to your Post screen
                  activeOpacity={1}
                >
                  <Feather
                    name="plus"
                    size={44}
                    color={ThemeColoursPrimary.LogoColour}
                  />
                </TouchableOpacity>
              </View>
            ),
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
    </View>
  );
};

const styles = StyleSheet.create({
  customPostButton: {
    bottom: 8,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    borderRadius: 35,
    width: 56,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 4, // Android shadow
    // zIndex: 10,
  },
});

export default TabNavigation;
