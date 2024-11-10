import React from "react";
import { FlatList } from "react-native";
import PostCard from "./ExamplePostCard";

const posts = [
  {
    id: "1",
    title: "Post 1",
    image:
      "https://m.media-amazon.com/images/M/MV5BNmEyZjI0M2MtNGFkOC00YTRlLWI0MGQtYTgyODY2MGRhMjc4XkEyXkFqcGc@._V1_.jpg",
    content: "Full content of post 1",
  },
  {
    id: "2",
    title: "Post 2",
    image:
      "https://m.media-amazon.com/images/M/MV5BNmEyZjI0M2MtNGFkOC00YTRlLWI0MGQtYTgyODY2MGRhMjc4XkEyXkFqcGc@._V1_.jpg",
    content: "Full content of post 2",
  },
  // Add more posts as needed
];

const PostListScreen = ({ navigation }: any) => {
  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PostCard post={item} navigation={navigation} />
      )}
    />
  );
};

export default PostListScreen;
