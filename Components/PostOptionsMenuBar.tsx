import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
const PostOptionsMenuBar = ({
  goToCamera,
  goToPhotoBrowser,
  handleShowDrawer,
}: any) => {
  return (
    <View style={{ flexDirection: "row", alignItems: "center" }}>
      <View style={styles.menuBarContainer}>
        {goToCamera && (
          <Pressable onPressIn={goToCamera}>
            <MaterialCommunityIcons name="camera" size={34} color="black" />
          </Pressable>
        )}
        {goToPhotoBrowser && (
          <Pressable onPressIn={goToPhotoBrowser}>
            <MaterialCommunityIcons name="image-plus" size={32} color="black" />
          </Pressable>
        )}
        {handleShowDrawer && (
          <Pressable onPressIn={handleShowDrawer}>
            <MaterialCommunityIcons name="tag-text" size={30} color="black" />
          </Pressable>
        )}
      </View>
      {/* <Pressable style={{ marginLeft: 4 }}>
        <MaterialCommunityIcons name="map-marker" size={30} color="black" />
      </Pressable> */}
    </View>
  );
};

const styles = StyleSheet.create({
  menuBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
export default PostOptionsMenuBar;
