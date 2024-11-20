import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions, Platform } from "react-native";
import FadeInWrapper from "./FadeInWrapper";
import { MasonryFlashList } from "@shopify/flash-list";
import PostCard from "./PostCard";
import { ThemeColoursPrimary } from "../Constants/UI";
import { Entypo } from "@expo/vector-icons";
const { height, width } = Dimensions.get("window");

const PostSearchView = (props: any) => {
  const { visible, postData, searchText, navigation } = props;

  if (!visible) return null;

  const NotFoundMessage = () => (
    <View style={styles.messageContainer}>
      <Entypo
        name="emoji-sad"
        size={40}
        color="black"
        style={styles.notFoundIcon}
      />
      <Text style={styles.messageText}>
        {"Sorry, we couldn't find any posts matching:\n"}
        <Text style={styles.notFoundSearchText}>{`"${searchText}"`}</Text>
      </Text>
    </View>
  );

  const SearchPromptText = () => (
    <View style={styles.messageContainer}>
      <Text>{"Looking for something specific? Search here..."}</Text>
    </View>
  );

  const MessagePrompt = () =>
    postData[0] === "notFound" ? <NotFoundMessage /> : <SearchPromptText />;

  return (
    <View style={styles.dropdown}>
      {postData.length === 0 || postData[0] === "notFound" ? (
        <MessagePrompt />
      ) : (
        <FadeInWrapper delay={1500}>
          <View style={styles.flashListWrapper}>
            <MasonryFlashList
              data={postData}
              keyExtractor={(item: any) => item.id}
              renderItem={({ item }: any) => (
                <View style={styles.cardContainer}>
                  <PostCard postId={item.id} navigation={navigation} />
                </View>
              )}
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
    backgroundColor: ThemeColoursPrimary.LightGreyBackground,
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
  messageContainer: {
    alignItems: "center", // Center align items
    padding: 10,
  },
  notFoundIcon: {
    marginBottom: 8, // Space between icon and message text
  },
  messageText: {
    fontSize: Platform.OS === "android" ? 14 : 16,
    color: "black",
    textAlign: "center", // Center align text if it spans multiple lines
  },
  notFoundSearchText: {
    fontSize: Platform.OS === "android" ? 16 : 18,
    fontWeight: "bold", // Bold style
  },
});

export default PostSearchView;
