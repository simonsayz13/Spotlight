import React from "react";
import { View, Text, StyleSheet } from "react-native";

const NoPhotoPlaceHolder = ({ title, description }: any) => {
  return (
    <View style={styles.articleContainer}>
      <Text style={styles.articleTitle}>{title}</Text>
      {description && (
        <Text style={styles.articleContent} numberOfLines={3}>
          {description}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  articleContainer: {
    padding: 10,
    borderColor: "#ddd",
    borderBottomWidth: 1,
    justifyContent: "center",
  },
  articleTitle: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
    marginBottom: 4,
  },
  articleContent: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});

export default NoPhotoPlaceHolder;
