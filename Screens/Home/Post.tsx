import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import TopNavigationBarPost from "../../Components/TopNavigationBarPost";
import PostInteractionBar from "../../Components/PostInteractionBar";
import MainPost from "../../Components/MainPost";
import { useFocusEffect } from "@react-navigation/native";
import { ThemeColours } from "../../Constants/UI";

const Post = ({ navigation }: any) => {
  useFocusEffect(
    React.useCallback(() => {
      navigation.getParent()?.setOptions({ tabBarStyle: { display: "none" } });
      return () =>
        navigation.getParent()?.setOptions({
          tabBarStyle: {
            backgroundColor: ThemeColours.PrimaryColour,
            borderTopWidth: 0,
            ...Platform.select({
              ios: {
                shadowColor: "#000", // Shadow color
                shadowOffset: { width: 0, height: 1 }, // Offset for the shadow
                shadowOpacity: 0.2, // Shadow opacity
                shadowRadius: 4, // Radius of the shadow
              },
              android: {
                elevation: 20, // Elevation for Android shadow
              },
            }),
          },
        });
    }, [navigation])
  );

  return (
    <SafeAreaView style={styles.container}>
      <TopNavigationBarPost navigation={navigation} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "height" : "padding"}
        style={styles.container}
      >
        <MainPost />
        <View style={styles.bottomView}>
          <PostInteractionBar />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomView: {
    height: 60,
  },
});
export default Post;
