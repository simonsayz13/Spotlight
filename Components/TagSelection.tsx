import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { Tags } from "../Constants/UI";
import { Tag } from "../type/General";

const TagSelection = ({ handleSetTags }: any) => {
  const [tags, setTags] = useState(Tags);

  const handleTagToggle = (id: number) => {
    setTags((prevTags) =>
      prevTags.map((tag) =>
        tag.id === id ? { ...tag, checked: !tag.checked } : tag
      )
    );
  };

  return (
    <View>
      <View style={styles.tagSelectionTopContainer}>
        <Text style={styles.tagTitle}>Tags</Text>
        <TouchableOpacity onPressIn={handleSetTags}>
          <Feather name="check" size={32} color="black" />
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
              <Feather
                name={tag.checked ? "check-square" : "square"}
                size={24}
                color="black"
              />
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
});
export default TagSelection;
