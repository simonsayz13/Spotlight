import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import FadeInWrapper from "./FadeInWrapper";
import { MasonryFlashList } from "@shopify/flash-list";
import PostCard from "./PostCard";
import { ThemeColoursPrimary } from "../Constants/UI";
const { height, width } = Dimensions.get("window");

const PostSearchView = (props: any) => {
  const { visible, postData, searchText, navigation } = props;
  if (!visible) return null;
  const [message, setMessage] = useState(
    "Looking for something specific? Start typing here..."
  );

  useEffect(() => {
    if (searchText !== "")
      setMessage(
        `Unfortunately, there is no similar post found on ${searchText}`
      );
    console.log(postData);
  }, [postData]);

  useEffect(() => {
    console.log(searchText);
  }, [searchText]);

  const renderItem = ({ item }: any) => (
    <View style={styles.cardContainer}>
      <PostCard postData={item} navigation={navigation} />
    </View>
  );

  return (
    <View style={styles.dropdown}>
      {postData.length === 0 ? (
        <Text style={styles.searchPromptText}>{message}</Text>
      ) : (
        <FadeInWrapper delay={1500}>
          <View style={styles.flashListWrapper}>
            <MasonryFlashList
              data={postData}
              keyExtractor={(item) => item.id}
              renderItem={renderItem}
              estimatedItemSize={200} // Estimated size for optimal performance
              numColumns={2} // Setting 2 columns for masonry layout
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.flashListContainer}
              scrollEventThrottle={30}
              onEndReachedThreshold={0.2}
            />
          </View>
        </FadeInWrapper>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    backgroundColor: "white",
    height: "100%", // Takes full height of parent
    width: "100%", // Takes full width of parent
    alignItems: "center",
    position: "absolute", // Stays positioned relative to parent
    top: 0,
    left: 0,
    zIndex: 1000,
  },
  searchPromptText: {
    paddingTop: 10,
  },
  cardContainer: {
    flex: 1,
    width: "100%",
    marginHorizontal: 2, // Horizontal gap between the cards
    marginBottom: 4, // Vertical gap between rows
  },
  flashListContainer: {
    paddingVertical: 4,
    paddingHorizontal: 2, // Padding on the sides
  },
  flashListWrapper: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.LightGreyBackground,
    height: height,
    width: width,
  },
});

export default PostSearchView;
