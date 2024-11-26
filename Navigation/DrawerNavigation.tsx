import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { MainStacks, OtherScreens, ThemeColoursPrimary } from "../Constants/UI";
import AboutUs from "../Screens/Misc/AboutUs";
import MainNavigationStack from "./MainNavigationStack";
import CustomDrawerContent from "../Components/CustomDrawerContent";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
const Drawer = createDrawerNavigator();

const DrawerNavigation = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: { backgroundColor: "#fff", width: "70%" },
        drawerActiveTintColor: ThemeColoursPrimary.LogoColour,
        drawerActiveBackgroundColor: "transparent",
        drawerLabelStyle: {
          fontSize: 16,
        },
        swipeEdgeWidth: 0,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen
        name={MainStacks.HomeStack}
        component={MainNavigationStack}
        options={{
          title: "Home",
          drawerIcon: ({ focused }) => (
            <Ionicons
              name={"home"}
              size={24}
              color={
                focused
                  ? ThemeColoursPrimary.LogoColour
                  : ThemeColoursPrimary.SecondaryColour
              }
            />
          ),
        }}
      />
      <Drawer.Screen
        name={OtherScreens.AboutUs}
        component={AboutUs}
        options={{
          drawerIcon: ({ focused }) => (
            <Feather
              name="info"
              size={24}
              color={
                focused
                  ? ThemeColoursPrimary.LogoColour
                  : ThemeColoursPrimary.SecondaryColour
              }
            />
          ),
          drawerLabel: "About Us",
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
