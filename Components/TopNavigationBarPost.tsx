import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import SimpleLineIcons from "@expo/vector-icons/SimpleLineIcons";
import { ThemeColours } from "../Constants/UI";
const TopNavigationBarPost = ({ navigation }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.leftWrapper}>
        <TouchableOpacity
          onPress={() => {
            navigation.goBack();
          }}
        >
          <Ionicons
            name="chevron-back"
            size={32}
            color={ThemeColours.SecondaryColour}
          />
        </TouchableOpacity>
        <View style={styles.userWrapper}>
          <Ionicons
            name="person-circle-outline"
            size={34}
            color={ThemeColours.SecondaryColour}
          />
          <Text style={{ color: ThemeColours.SecondaryColour }}>User</Text>
        </View>
      </View>
      <View style={styles.followShareWrapper}>
        <TouchableOpacity>
          <SimpleLineIcons
            name="user-follow"
            size={28}
            color={ThemeColours.SecondaryColour}
          />
        </TouchableOpacity>

        <TouchableOpacity>
          <FontAwesome
            name="share-square-o"
            size={28}
            color={ThemeColours.SecondaryColour}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: ThemeColours.PrimaryColour,
  },
  leftWrapper: {
    flexDirection: "row", // Align children in a row
    alignItems: "center", // Vertically center the content
  },
  textWrapper: {
    position: "relative",
    alignItems: "center",
  },
  userWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
    marginLeft: 10,
  },
  followShareWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
    marginRight: 10,
  },
});

export default TopNavigationBarPost;
