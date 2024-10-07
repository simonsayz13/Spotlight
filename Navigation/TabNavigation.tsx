import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./Stacks/HomeStack";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Map } from "../Screens/Map/Map";
import ProfileStack from "./Stacks/ProfileStack";
import { Platform } from "react-native";
import { ThemeColoursPrimary } from "../Constants/UI";
import MessagingStackScreen from "./Stacks/MessagingStack";
import PostStackScreen from "./Stacks/PostStack";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
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
        name="Home"
        component={HomeStack}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action if tab is already focused
            if (navigation.isFocused()) {
              e.preventDefault();
            }
          },
        })}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={28}
                color={ThemeColoursPrimary.SecondaryColour}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Map"
        component={Map}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action if tab is already focused
            if (navigation.isFocused()) {
              e.preventDefault();
            }
          },
        })}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name={focused ? "map" : "map-outline"}
                size={28}
                color={ThemeColoursPrimary.SecondaryColour}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Post"
        component={PostStackScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action if tab is already focused
            if (navigation.isFocused()) {
              e.preventDefault();
            }
          },
        })}
        options={{
          tabBarIcon: () => {
            return (
              <FontAwesome
                name="plus-square-o"
                size={40}
                color={ThemeColoursPrimary.LogoColour}
              />
            );
          },
          tabBarStyle: { display: "none" },
          title: "Create",
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagingStackScreen}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action if tab is already focused
            if (navigation.isFocused()) {
              e.preventDefault();
            }
          },
        })}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name={focused ? "chatbox-ellipses" : "chatbox-ellipses-outline"}
                size={28}
                color={ThemeColoursPrimary.SecondaryColour}
              />
            );
          },
        }}
      />
      <Tab.Screen
        name="Me"
        component={ProfileStack}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            // Prevent default action if tab is already focused
            if (navigation.isFocused()) {
              e.preventDefault();
            }
          },
        })}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={28}
                color="black"
              />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
