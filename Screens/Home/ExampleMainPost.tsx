import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { SharedElement } from "react-navigation-shared-element";

const ExampleMainPost = ({ route }: any) => {
  const { post } = route.params;

  return (
    <View style={styles.container}>
      {/* Shared element for the image */}
      <SharedElement id={`post.${post.id}.image`}>
        <Image source={{ uri: post.image }} style={styles.image} />
      </SharedElement>
      <Text style={styles.title}>{post.title}</Text>
      <Text style={styles.content}>{post.content}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  image: {
    width: "100%",
    height: 300,
  },
  title: {
    padding: 15,
    fontSize: 24,
    fontWeight: "bold",
  },
  content: {
    padding: 15,
    fontSize: 16,
    lineHeight: 24,
  },
});

ExampleMainPost.sharedElements = (route: any) => {
  const { post } = route.params;
  return [`post.${post.id}.image`];
};

export default ExampleMainPost;
