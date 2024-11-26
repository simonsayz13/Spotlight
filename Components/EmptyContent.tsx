import React from "react";
import { View, Text, StyleSheet } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
const EmptyContent = () => {
  return (
    <View style={styles.container}>
      <FontAwesome5 name="box-open" size={24} color="black" />
      <Text>There's nothing here</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 6,
  },
});

export default EmptyContent;
