import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import { Tags, ThemeColoursPrimary } from "../Constants/UI";
import { Tag } from "../type/General";
import AntDesign from "@expo/vector-icons/AntDesign";

const TagSelection = ({ handleSetTags }: any) => {
  const [tags, setTags] = useState(Tags);

  const handleTagToggle = (id: number) => {
    setTags((prevTags) =>
      prevTags.map(
        (tag) =>
          tag.id === id
            ? { ...tag, checked: !tag.checked } // Toggle the selected tag
            : { ...tag, checked: false } // Uncheck all other tags
      )
    );
  };

  const handleConfirmSelection = () => {
    const selectedTags = tags
      .filter((tag: Tag) => tag.checked) // Filter tags with checked = true
      .map((tag: Tag) => ({
        icon: tag.icon,
        label: tag.label,
        colour: tag.colour,
      })); // Get the icon, label, and color of each selected tag

    handleSetTags(selectedTags); // Pass the array of selected tags
  };

  return (
    <View>
      <View style={styles.tagSelectionTopContainer}>
        <Text style={styles.tagTitle}>Tags</Text>
        <TouchableOpacity
          style={styles.confirmButton}
          onPressIn={handleConfirmSelection}
        >
          <Text style={styles.confirmButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.tagSelectionBodyContainer}>
        {tags.map((tag: Tag) => (
          <TouchableOpacity
            key={tag.id}
            style={styles.tagItem}
            onPressIn={() => handleTagToggle(tag.id)}
            activeOpacity={1}
          >
            <View style={styles.tagRow}>
              <Text style={styles.tagIcon}>{tag.icon}</Text>
              <Text style={styles.tagLabel}>{tag.label}</Text>
            </View>
            <View style={styles.checkBox}>
              {tag.checked && (
                <AntDesign
                  name="check"
                  size={24}
                  color={ThemeColoursPrimary.LogoColour}
                />
              )}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  tagSelectionTopContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 6,
  },
  tagTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center", // Center the text itself (optional, in case of long text)
  },
  tagSelectionBodyContainer: {
    marginTop: 10,
  },
  tagItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagIcon: {
    fontSize: Platform.OS === "android" ? 20 : 30,
    marginRight: 10,
  },
  tagLabel: {
    fontSize: 18,
  },
  checkBox: {
    paddingRight: 10,
  },
  confirmButton: {
    backgroundColor: ThemeColoursPrimary.LogoColour, // Use your theme color
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default TagSelection;
