import React from "react";
import { View, Text, StyleSheet } from "react-native";

const PostSearchView = (props: any) => {
  const { visible } = props;

  if (!visible) return null;

  return (
    <View style={styles.dropdown}>
      <Text style={styles.searchPromptText}>
        Looking for something specific? Start typing here...
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: "white",
    height: "100%", // Takes full height of parent
    width: "100%", // Takes full width of parent
    alignItems: "center",
    position: "absolute", // Stays positioned relative to parent
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  searchPromptText: {
    paddingTop: 10,
    // fontSize: 1,
  },
});

export default PostSearchView;
