import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeStack from "./Stacks/HomeStack";
import Feather from "@expo/vector-icons/Feather";
import Entypo from "@expo/vector-icons/Entypo";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ShopScreen } from "../Screens/Shop/Shop";
import { PostScreen } from "../Screens/Post/Post";
import { MessagesScreen } from "../Screens/Messages/Messages";
import { ProfileScreen } from "../Screens/Profile/Profile";

const Tab = createBottomTabNavigator();

const TabNavigation = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "red",
        tabBarInactiveTintColor: "black",
        tabBarLabelStyle: {
          fontWeight: "bold",
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeStack}
        options={{
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Feather name="home" size={32} color="red" />
            ) : (
              <Feather name="home" size={32} color="black" />
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
              <Entypo name="shop" size={32} color="red" />
            ) : (
              <Entypo name="shop" size={32} color="black" />
            );
          },
        }}
      />
      <Tab.Screen
        name="Post"
        component={PostScreen}
        options={{
          // tabBarLabelStyle: { display: "none" },
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <FontAwesome name="plus-square-o" size={32} color="red" />
            ) : (
              <FontAwesome name="plus-square-o" size={32} color="black" />
            );
          },
        }}
      />
      <Tab.Screen
        name="Messages"
        component={MessagesScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Ionicons name="chatbubble-ellipses" size={32} color="red" />
            ) : (
              <Ionicons name="chatbubble-ellipses" size={32} color="black" />
            );
          },
        }}
      />
      <Tab.Screen
        name="Profiles"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return focused ? (
              <Ionicons name="person-circle-sharp" size={32} color="red" />
            ) : (
              <Ionicons name="person-circle-sharp" size={32} color="black" />
            );
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigation;
