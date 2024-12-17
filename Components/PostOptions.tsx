import React, { useEffect, useRef } from "react";
import { StyleSheet, View, Text, TouchableOpacity, Alert } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PostStackScreens, ThemeColoursPrimary } from "../Constants/UI";
import BottomDrawer from "./BottomDrawer";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ScrollView } from "react-native-gesture-handler";
import { deletePost } from "../Firebase/firebaseFireStore";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { useAppContext } from "../Context/AppContext";

const PostOptions = ({ setIsDrawerOpen, navigation, postData }: any) => {
  const { userId: appUserId } = useSelector((state: RootState) => {
    return state.user;
  });
  const postId = postData?.id;
  const postSettingDrawer = useRef<any>(null);
  const { setModalMessage } = useAppContext();

  useEffect(() => {
    postSettingDrawer.current.showDrawer();
  }, []);

  const hideDrawer = () => {
    setIsDrawerOpen(false);
  };

  const openEditPost = () => {
    navigation.navigate(PostStackScreens.EditPost, { postData });
    hideDrawer();
  };

  const handleDeletePost = async () => {
    hideDrawer();
    await deletePost(postId, appUserId!);
    navigation.goBack();
    setModalMessage("Post Deleted");
  };

  const handleDeletePress = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this post?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Confirm",
          onPress: () => {
            handleDeletePost();
          },
          style: "destructive",
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <BottomDrawer
      ref={postSettingDrawer}
      heightPercentage={0.18}
      isPannable={false}
    >
      <View style={styles.topContainer}>
        <Text style={styles.titleText}>Post Options</Text>
        <TouchableOpacity
          onPress={hideDrawer}
          style={{ alignSelf: "flex-end" }}
        >
          <Ionicons
            name="close"
            size={24}
            color={ThemeColoursPrimary.SecondaryColour}
          />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.postActionContainer} horizontal>
        <View style={styles.actionButtonWrapper}>
          <TouchableOpacity
            style={styles.optionButtonBase}
            onPressIn={openEditPost}
          >
            <AntDesign
              name="edit"
              size={24}
              color={ThemeColoursPrimary.PrimaryColour}
            />
          </TouchableOpacity>
          <Text style={styles.actionText}>Edit</Text>
        </View>
        <TouchableOpacity
          style={styles.actionButtonWrapper}
          onPressIn={handleDeletePress}
        >
          <View style={styles.optionButtonBase}>
            <AntDesign
              name="delete"
              size={24}
              color={ThemeColoursPrimary.PrimaryColour}
            />
          </View>
          <Text style={styles.actionText}>Delete</Text>
        </TouchableOpacity>
      </ScrollView>
    </BottomDrawer>
  );
};

const styles = StyleSheet.create({
  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  titleText: {
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
  postActionContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 8,
  },
  optionButtonBase: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ThemeColoursPrimary.LogoColour,
  },
  actionButtonWrapper: {
    alignItems: "center",
    gap: 2,
  },
  actionText: {
    fontSize: 12,
    color: ThemeColoursPrimary.SecondaryColour + 100,
  },
});
export default PostOptions;
