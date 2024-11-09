import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
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
        <TouchableOpacity
          onPress={closeFilter}
          style={{ alignSelf: "flex-end", paddingRight: 8 }}
        >
          <Ionicons
            name="close"
            size={28}
            color={ThemeColoursPrimary.SecondaryColour}
          />
        </TouchableOpacity>
      </View>
      <View>
        {Tags.map((tag) => (
          <TouchableOpacity
            key={tag.id}
            style={[styles.tagButton]}
            onPress={() => {
              selectTag(tag);
              closeFilter();
            }}
          >
            <View
              style={{
                width: 46,
                height: 46,
                backgroundColor: tag.colour,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
                elevation: 5,
              }}
            >
              <Text style={{ fontSize: 18 }}>{tag.icon}</Text>
            </View>
            <View
              style={{
                marginLeft: 10,
                gap: 4,
                flex: 1,
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
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomDrawerTopContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tagButton: {
    flexDirection: "row",
    margin: 8,
    alignItems: "center",
  },
});

export default MapFilters;
