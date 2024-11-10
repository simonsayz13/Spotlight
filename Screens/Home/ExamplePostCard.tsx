import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { SharedElement } from "react-navigation-shared-element";

const ExamplePostCard = ({ post, navigation }: any) => {
  const openPost = () => {
    navigation.navigate("MainPost", { post });
  };

  return (
    <TouchableOpacity onPress={openPost}>
      <View style={styles.card}>
        {/* Shared element for the image */}
        <SharedElement id={`post.${post.id}.image`}>
          <Image source={{ uri: post.image }} style={styles.image} />
        </SharedElement>
        <Text style={styles.title}>{post.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    margin: 10,
    backgroundColor: "white",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },
  image: {
    width: "100%",
    height: 200,
  },
  title: {
    padding: 10,
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ExamplePostCard;
