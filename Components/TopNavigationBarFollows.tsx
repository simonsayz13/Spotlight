import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeColoursPrimary } from "../Constants/UI";

const TopNavigationBarPost = ({
  navigation,
  userId,
  displayName,
  activeTab,
  handleTabPress,
}: any) => {
  const handleBackButtonPress = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleBackButtonPress}
        style={styles.placeHolder}
      >
        <Ionicons
          name="chevron-back"
          size={32}
          color={ThemeColoursPrimary.SecondaryColour}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.userWrapper}
        onPressIn={() => navigation.goBack()}
      >
        <Text style={styles.usernameText}>{displayName}</Text>
      </TouchableOpacity>
      <View style={styles.placeHolder} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 8,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    flexDirection: "row",
  },
  leftWrapper: {
    width: "100%",
    flexDirection: "row", // Align children in a row
    alignItems: "center", // Vertically center the content
    justifyContent: "space-between",
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  textWrapper: {
    position: "relative",
    alignItems: "center",
  },
  userWrapper: {
    alignItems: "center",
    flexDirection: "row",
    marginLeft: 10,
  },
  usernameText: {
    color: ThemeColoursPrimary.SecondaryColour,
    fontSize: 18,
    justifyContent: "center",
  },
  followShareWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 14,
    marginRight: 10,
  },
  profileImage: {
    width: 40, // Width and height should be the same
    height: 42,
    borderRadius: 50, // Half of the width or height for a perfect circle
  },
  placeHolder: {
    width: 32,
  },
});

export default TopNavigationBarPost;
