import React from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
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
          <TouchableOpacity onPressIn={goToCamera}>
            <MaterialCommunityIcons name="camera" size={34} color="black" />
          </TouchableOpacity>
        )}
        {goToPhotoBrowser && (
          <TouchableOpacity onPressIn={goToPhotoBrowser}>
            <MaterialCommunityIcons name="image-plus" size={32} color="black" />
          </TouchableOpacity>
        )}
        {handleShowDrawer && (
          <TouchableOpacity onPressIn={handleShowDrawer}>
            <MaterialCommunityIcons name="tag-text" size={30} color="black" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity style={{ marginLeft: 4 }}>
        <MaterialCommunityIcons name="map-marker" size={30} color="black" />
      </TouchableOpacity>
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
