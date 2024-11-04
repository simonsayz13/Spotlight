import React, { useEffect, useRef, useState } from "react";
import BottomDrawer from "./BottomDrawer";
import { View, StyleSheet, Text, Pressable, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ImageType, ThemeColoursPrimary } from "../Constants/UI";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { getUserConversations } from "../Firebase/FirebaseChat";
import { getOtherParticipants } from "../Util/utility";
import { getUserProfileDetails } from "../Firebase/FirebaseUsers";
import ProfilePicture from "./ProfilePicture";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Loader from "./Loader";
import { copyShareLink, sharePost } from "../Util/Services";
const SharePost = ({
  setIsDrawerOpen,
  navigation,
  postData,
  setModalVisible,
  setModalMessage,
}: any) => {
  const { userId: appUserId } = useSelector((state: RootState) => {
    return state.user;
  });
  const sharePostDrawer = useRef<any>(null);
  const [conversationUsers, setConversationUsers] = useState<any>(null);

  useEffect(() => {
    sharePostDrawer.current.showDrawer();
  }, []);

  const onPressClose = () => {
    setIsDrawerOpen(false);
  };

  const retrieveConversations = async () => {
    const conversations = await getUserConversations(appUserId!);
    // setConversationData();
    const conversationUsersData = await Promise.all(
      getOtherParticipants(conversations, appUserId).map(
        async (conversation: any) =>
          await getUserProfileDetails(conversation.otherParticipantId).then(
            (userDetails) => ({
              conversationId: conversation.conversationId,
              otherParticipantId: conversation.otherParticipantId,
              userDetails, // This includes displayName and profile_picture
            })
          )
      )
    );
    setConversationUsers(conversationUsersData);
  };

  useEffect(() => {
    retrieveConversations();
  }, []);

  const onPressExternalShare = async () => {
    await sharePost(postData);
    onPressClose();
    setModalMessage("Post shared successfully!");
    setModalVisible(true);
  };

  const onPressCopyLink = async () => {
    await copyShareLink(postData);
    onPressClose();
    setModalMessage("Link copied to clipboard.");
    setModalVisible(true);
  };

  return (
    <BottomDrawer
      ref={sharePostDrawer}
      heightPercentage={0.3}
      isPannable={false}
    >
      <View style={styles.topContainer}>
        <Text style={styles.titleText}>Share</Text>
        <Pressable onPress={onPressClose} style={{ alignSelf: "flex-end" }}>
          <Ionicons
            name="close"
            size={24}
            color={ThemeColoursPrimary.SecondaryColour}
          />
        </Pressable>
      </View>
      <View>
        {conversationUsers ? (
          <ScrollView
            contentContainerStyle={styles.usersContainer}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {conversationUsers.map((user: any) => (
              <View key={user.conversationId} style={styles.userProfileWrapper}>
                <ProfilePicture
                  uri={user.userDetails.profilePictureUrl}
                  userDisplayName={user.userDetails.displayName}
                  type={ImageType.Contacts}
                />
                <Text>{user.userDetails.displayName}</Text>
              </View>
            ))}
          </ScrollView>
        ) : (
          <View style={styles.usersContainer}>
            <Loader size="small" color={ThemeColoursPrimary.LogoColour} />
          </View>
        )}

        <View style={styles.divider} />

        <ScrollView
          contentContainerStyle={styles.shareActionContainer}
          horizontal
        >
          <View style={styles.actionButtonWrapper}>
            <Pressable
              style={styles.shareOptionButtonBase}
              onPressIn={onPressCopyLink}
            >
              <AntDesign
                name="link"
                size={24}
                color={ThemeColoursPrimary.PrimaryColour}
              />
            </Pressable>
            <Text style={styles.actionText}>Copy link</Text>
          </View>
          <Pressable
            style={styles.actionButtonWrapper}
            onPressIn={onPressExternalShare}
          >
            <View style={styles.shareOptionButtonBase}>
              <Feather
                name="share"
                size={24}
                color={ThemeColoursPrimary.PrimaryColour}
              />
            </View>
            <Text style={styles.actionText}>Share</Text>
          </Pressable>
        </ScrollView>
      </View>
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
  usersContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 90,
  },
  userProfileWrapper: {
    alignItems: "center",
    marginHorizontal: 6,
  },
  divider: {
    borderBottomWidth: 0.6,
    borderColor: ThemeColoursPrimary.SecondaryColour + "20",
    width: "100%",
    height: 0.8,
  },
  shareActionContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: 90,
  },
  shareOptionButtonBase: {
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: ThemeColoursPrimary.LogoColour,
  },
  actionButtonWrapper: {
    // paddingHorizontal: 10,
    marginHorizontal: 6,
    alignItems: "center",
    gap: 2,
  },
  actionText: {
    fontSize: 12,
    color: ThemeColoursPrimary.SecondaryColour + 100,
  },
});
export default SharePost;
