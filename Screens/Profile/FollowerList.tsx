import React from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Text,
} from "react-native";
// import TopNavigationBarPost from "../../Components/TopNavigationBarPost";
// import PostInteractionBar from "../../Components/PostInteractionBar";
// import MainPost from "../../Components/MainPost";
import { ThemeColoursPrimary } from "../../Constants/UI";

const FollowerList = ({ navigation, route }: any) => {
  const { followers } = route.params;

  console.log("followers", followers);
  return (
    <SafeAreaView style={styles.container}>
      <Text>abc</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  bottomView: {
    height: 60,
  },
});
export default FollowerList;
