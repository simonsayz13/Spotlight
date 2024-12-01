import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Tags, ThemeColoursPrimary } from "../Constants/UI";
import Ionicons from "@expo/vector-icons/Ionicons";

const MapFilters = ({ selectTag, closeFilter }: any) => {
  return (
    <View>
      <View style={styles.bottomDrawerTopContainer}>
        <Text
          style={{
            alignItems: "center",
            fontWeight: "bold",
            fontSize: 22,
            paddingLeft: 8,
          }}
        >
          Filters
        </Text>
        <Pressable onPress={closeFilter} style={styles.closeButton}>
          <Ionicons
            name="close"
            size={28}
            color={ThemeColoursPrimary.SecondaryColour}
          />
        </Pressable>
      </View>
      <View>
        {Tags.map((tag) => (
          <Pressable
            key={tag.id}
            style={[styles.tagButton]}
            onPress={() => {
              selectTag(tag);
              closeFilter();
            }}
          >
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
          </Pressable>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomDrawerTopContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  tagButton: {
    flexDirection: "row",
    margin: 8,
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
  closeButton: { position: "absolute", right: 8 },
});

export default MapFilters;
