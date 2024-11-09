import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { ThemeColoursPrimary } from "../Constants/UI";

const EditProfileItem = ({ itemTitle, itemData, onClickItem }: any) => {
  return (
    <TouchableOpacity
      onPressIn={onClickItem}
      style={styles.container}
      activeOpacity={1}
    >
      <Text style={styles.itemTitle}>{itemTitle}</Text>
      <View style={styles.itemTextView}>
        <Text style={styles.itemText} numberOfLines={1} ellipsizeMode="tail">
          {itemData}
        </Text>
        <EvilIcons name="chevron-right" size={32} color="black" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  itemTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: ThemeColoursPrimary.SecondaryColour,
  },
  itemTextView: {
    flexShrink: 1, // Enables shrinking when space is limited
    flexDirection: "row",
    alignItems: "center",
    maxWidth: 240,
  },
  itemText: {
    flexShrink: 1,
    color: ThemeColoursPrimary.SecondaryColour,
    fontSize: 20,
    marginRight: 6,
  },
});

export default EditProfileItem;
