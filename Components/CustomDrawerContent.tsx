import React from "react";
import { View, StyleSheet, Pressable, Text } from "react-native";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MainStacks, ThemeColoursPrimary } from "../Constants/UI";
import { logOut } from "../Firebase/firebaseAuth";
import { CommonActions } from "@react-navigation/native";

const CustomDrawerContent = (props: any) => {
  const { navigation } = props;

  const handleLogout = () => {
    navigation.closeDrawer();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: MainStacks.Login }],
      })
    );
    logOut();
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView
        {...props}
        contentContainerStyle={styles.container}
      >
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.footer}>
        <Pressable style={styles.buttonView} onPress={handleLogout}>
          <View style={[styles.button, { backgroundColor: "red" }]}>
            <MaterialIcons
              name="logout"
              size={24}
              color={ThemeColoursPrimary.PrimaryColour}
            />
          </View>
          <Text style={styles.buttonText}>Sign Out</Text>
        </Pressable>
        <View style={styles.buttonView}>
          <Pressable
            style={[
              styles.button,
              { backgroundColor: ThemeColoursPrimary.LogoColour },
            ]}
          >
            <Ionicons
              name="settings-sharp"
              size={24}
              color={ThemeColoursPrimary.PrimaryColour}
            />
          </Pressable>
          <Text style={styles.buttonText}>Settings</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: "#e91e63",
    alignItems: "center",
  },
  headerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    width: "100%",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    justifyContent: "center",
    gap: 24,
  },
  buttonView: {
    alignItems: "center",
    gap: 8,
  },
  buttonText: {
    fontSize: 14,
  },
  button: {
    padding: 8,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    width: 40,
  },
});

export default CustomDrawerContent;
