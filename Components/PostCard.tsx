import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";

const PostCard = ({ title, imageUrl, user, likes, openPost }: any) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={1} onPress={openPost}>
      <Image
        source={require("../assets/test_data/image_placeholder.jpg")}
        style={styles.image}
      />
      {/* <Image
        style={styles.image}
        source={{
          uri: "https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM=",
        }}
      /> */}

      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.userLikes}>
          <Text style={styles.userFont}>{user}</Text>
          <View style={styles.likes}>
            <AntDesign name="hearto" size={12} color="black" />
            <Text style={styles.userFont}>{likes}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 4,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
    borderWidth: 1,
    width: "48%",
  },
  image: {
    width: "100%",
    height: 200,
  },
  content: {
    padding: 8,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  userFont: {
    fontSize: 12,
    color: "#666",
  },
  userLikes: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    // alignItems: "center",
  },
  likes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1.5,
  },
});

export default PostCard;
