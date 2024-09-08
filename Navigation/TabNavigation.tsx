import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./Stacks/HomeStack";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ShopScreen } from "../Screens/Shop/Shop";
import { Camera } from "../Screens/Post/Camera";
import { MessagesScreen } from "../Screens/Messages/Messages";
import ProfileStack from "./Stacks/ProfileStack";
import { Platform } from "react-native";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#feea00",
        tabBarInactiveTintColor: "white",
        tabBarLabelStyle: {
          fontWeight: "bold",
          backgroundColor: "#ef6e6e",
        },
        tabBarStyle: {
          backgroundColor: "#ef6e6e",
          borderTopWidth: 0,
          ...Platform.select({
            ios: {
              shadowColor: "#000", // Shadow color
              shadowOffset: { width: 0, height: 1 }, // Offset for the shadow
              shadowOpacity: 0.2, // Shadow opacity
              shadowRadius: 4, // Radius of the shadow
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
        options={{
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Feather name="home" size={32} color="#feea00" />
            ) : (
              <Feather name="home" size={32} color="#ffffff" />
            );
          },
        }}
      />
      <Tab.Screen
        name="Shop"
        component={ShopScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Entypo name="shop" size={32} color="#feea00" />
            ) : (
              <Entypo name="shop" size={32} color="#ffffff" />
            );
          },
        }}
      />
      <Tab.Screen
        name="Post"
        component={Camera}
        options={{
          // tabBarLabelStyle: { display: "none" },
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <FontAwesome name="plus-square-o" size={32} color="#feea00" />
            ) : (
              <FontAwesome name="plus-square-o" size={32} color="#ffffff" />
            );
          },
          tabBarStyle: { display: "none" },
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Ionicons name="chatbubble-ellipses" size={32} color="#feea00" />
            ) : (
              <Ionicons name="chatbubble-ellipses" size={32} color="#ffffff" />
            );
          },
        }}
      />
      <Tab.Screen
        name="Me"
        component={ProfileStack}
        options={{
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Ionicons name="person-circle-sharp" size={32} color="#feea00" />
            ) : (
              <Ionicons name="person-circle-sharp" size={32} color="#ffffff" />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
