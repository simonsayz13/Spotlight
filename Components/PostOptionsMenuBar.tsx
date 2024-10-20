import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
const PostOptionsMenuBar = ({
  goToCamera,
  goToPhotoBrowser,
  handleShowDrawer,
}: any) => {
  return (
    <View style={styles.menuBarContainer}>
      <TouchableOpacity onPressIn={goToCamera}>
        <MaterialCommunityIcons name="camera" size={34} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPressIn={goToPhotoBrowser}>
        <MaterialCommunityIcons name="image-plus" size={34} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPressIn={handleShowDrawer}>
        <AntDesign name="tag" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  menuBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
});
export default PostOptionsMenuBar;
