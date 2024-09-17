import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";

import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemeColours } from "../Constants/UI";

const PostCard = ({ title, imageUrl, user, likes, openPost }: any) => {
  return (
    <TouchableOpacity style={styles.card} activeOpacity={1} onPress={openPost}>
      <Image
        source={{
          uri: "https://archive.org/download/placeholder-image/placeholder-image.jpg",
        }}
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
            <AntDesign
              name="hearto"
              size={12}
              color={ThemeColours.SecondaryColour}
            />
            <Text style={styles.userFont}>{likes}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: ThemeColours.PrimaryColour,
    borderRadius: 4,
    ...Platform.select({
      ios: {
        shadowColor: "#000", // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Similar to elevation height
        shadowOpacity: 0.2, // How transparent the shadow is
        shadowRadius: 4, // The blur or spread radius of the shadow
      },
      android: {
        elevation: 2, // Android's elevation property
      },
    }),
    width: "48%",
  },
  image: {
    width: "100%",
    height: 200,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  content: {
    padding: 8,
    gap: 6,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: ThemeColours.SecondaryColour,
  },
  userFont: {
    fontSize: 12,
    color: ThemeColours.SecondaryColour,
    opacity: 0.7,
  },
  userLikes: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  likes: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1.6,
    opacity: 0.7,
  },
});

export default PostCard;
