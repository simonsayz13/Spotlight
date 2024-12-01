import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
  Pressable,
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
      <View>
        {tags.map((tag: Tag) => (
          <Pressable
            key={tag.id}
            style={styles.tagItem}
            onPressIn={() => handleTagToggle(tag.id)}
          >
            <View style={styles.tagRow}>
              <View style={[styles.tagIcon, { backgroundColor: tag.colour }]}>
                <Text style={{ fontSize: 18 }}>{tag.icon}</Text>
              </View>
              <View
                style={{
                  marginLeft: 10,
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                  {tag.label}
                </Text>
                <Text style={{ marginTop: "auto" }}>
                  {tag.examples.join(", ")}
                </Text>
              </View>
            </View>
            <View style={styles.checkBox}>
              {tag.checked && (
                <AntDesign
                  name="check"
                  size={30}
                  color={ThemeColoursPrimary.LogoColour}
                />
              )}
            </View>
          </Pressable>
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
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  tagTitle: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center", // Center the text itself (optional, in case of long text)
  },
  tagItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
    marginHorizontal: 8,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagIcon: {
    width: 38,
    height: 38,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
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
    borderRadius: 8,
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
export default TagSelection;
