import React, { memo, useEffect, useRef, useState } from "react";
import BottomDrawer from "./BottomDrawer";
import {
  View,
  StyleSheet,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ImageType, ThemeColoursPrimary } from "../Constants/UI";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { sendMessage } from "../Firebase/FirebaseChat";
import { getOtherParticipants } from "../Util/utility";
import { getUserProfileDetails } from "../Firebase/FirebaseUsers";
import ProfilePicture from "./ProfilePicture";
import AntDesign from "@expo/vector-icons/AntDesign";
import Feather from "@expo/vector-icons/Feather";
import Loader from "./Loader";
import { copyShareLink, sharePost } from "../Util/Services";
import Animated, { SlideInDown } from "react-native-reanimated";

const Participant = memo(({ user, onPressConversation }: any) => {
  const [isSelected, setIsSelected] = useState(false);

  const handlePress = () => {
    setIsSelected((prev) => !prev);
    onPressConversation(user);
  };

  return (
    <Pressable
      key={user.conversationId}
      style={styles.userProfileWrapper}
      onPressIn={handlePress}
    >
      <View style={styles.profileContainer}>
        <ProfilePicture
          uri={user.userDetails.profilePictureUrl}
          userDisplayName={user.userDetails.displayName}
          type={ImageType.Contacts}
        />
        {isSelected && (
          <View style={styles.checkIcon}>
            <Feather name="check" size={16} color="white" />
          </View>
        )}
      </View>
      <Text>{user.userDetails.displayName}</Text>
    </Pressable>
  );
});

const SharePost = ({
  setIsDrawerOpen,
  postData,
  setModalVisible,
  setModalMessage,
}: any) => {
  const { userId: appUserId } = useSelector((state: RootState) => {
    return state.user;
  });
  const { conversations } = useSelector(
    (state: RootState) => state.conversations
  );

  const otherUsers = useSelector((state: RootState) => state.otherUsers);
  const sharePostDrawer = useRef<any>(null);
  const [conversationUsers, setConversationUsers] = useState<any>(null);
  const [selectedConversation, setSelectedConversation] = useState<Array<any>>(
    []
  );
  const [shareMessage, setShareMessage] = useState<string>("");
  const dispatch = useDispatch();

  useEffect(() => {
    sharePostDrawer.current.showDrawer();
  }, []);

  const onPressClose = () => {
    setIsDrawerOpen(false);
  };

  const retrieveConversations = async () => {
    const conversationUsersData = await Promise.all(
      getOtherParticipants(conversations, appUserId).map(
        async (conversation: any) =>
          await getUserProfileDetails(
            conversation.otherParticipantId,
            otherUsers,
            dispatch
          ).then((userDetails) => ({
            conversationId: conversation.conversationId,
            otherParticipantId: conversation.otherParticipantId,
            userDetails, // This includes displayName and profile_picture
          }))
      )
    );
    setConversationUsers(conversationUsersData);
  };

  useEffect(() => {
    retrieveConversations();
  }, []);

  const onPressExternalShare = async () => {
    await sharePost(postData);
    setModalMessage("Post shared successfully!");
    closeShareSheet();
  };

  const onPressCopyLink = async () => {
    await copyShareLink(postData);
    setModalMessage("Link copied to clipboard.");
    closeShareSheet();
  };

  const closeShareSheet = () => {
    setSelectedConversation([]);
    onPressClose();
    setModalVisible(true);
  };

  const onPressConversation = (user: any) => {
    if (selectedConversation.includes(user)) {
      setSelectedConversation((prevArray) =>
        prevArray.filter(
          (arrayUser) => arrayUser.conversationId != user.conversationId
        )
      );
    } else {
      setSelectedConversation((prevArray) => [...prevArray, user]);
    }
  };

  const onPressSend = async () => {
    try {
      for (const conversation of selectedConversation) {
        const { conversationId } = conversation;
        console.log(conversationId);
        await sendMessage(
          conversationId,
          appUserId!,
          shareMessage,
          postData.id
        );
      }
      setModalMessage("Post shared successfully!");
    } catch (error) {
      setModalMessage("An error occurred while sharing the post.");
    } finally {
      closeShareSheet();
    }
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
              <Participant
                key={user.conversationId}
                user={user}
                onPressConversation={onPressConversation}
                isSelected={selectedConversation === user.otherParticipantId}
              />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.usersContainer}>
            <Loader size="small" color={ThemeColoursPrimary.LogoColour} />
          </View>
        )}
        <View style={styles.divider} />
        {selectedConversation.length > 0 ? (
          <Animated.View entering={SlideInDown.duration(300)}>
            <View style={styles.messageBarContainer}>
              <TextInput
                onChangeText={(text) => {
                  setShareMessage(text);
                }}
                placeholder="Write a message..."
                style={styles.messageBarInput}
              />
            </View>
            <Pressable style={styles.sendButton} onPressIn={onPressSend}>
              <Text style={styles.sendButtonText}>Send</Text>
            </Pressable>
          </Animated.View>
        ) : (
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
        )}
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
    height: Platform.OS === "android" ? 90 : 110,
  },
  userProfileWrapper: {
    alignItems: "center",
    marginHorizontal: 6,
  },
  divider: {
    height: 1,
    width: "98%", // Same width as the TouchableOpacity
    backgroundColor: ThemeColoursPrimary.SecondaryColour, // Gray line color
    alignSelf: "center",
    opacity: 0.15,
  },
  shareActionContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    height: Platform.OS === "android" ? 90 : 110,
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
    marginHorizontal: 6,
    alignItems: "center",
    gap: 2,
  },
  actionText: {
    fontSize: 12,
    color: ThemeColoursPrimary.SecondaryColour + 100,
  },
  messageBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    marginHorizontal: 8,
    marginTop: 8,
    marginBottom: 4,
  },
  messageBarInput: {
    flex: 1,
    fontSize: 16,
    paddingHorizontal: 10,
    color: "#333",
    height: 28,
  },
  sendButton: {
    backgroundColor: ThemeColoursPrimary.LogoColour, // Linkify's theme color
    borderRadius: 10,
    marginTop: 4,
    paddingVertical: Platform.OS === "android" ? 4 : 10,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 8,
  },
  sendButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  profileContainer: {
    position: "relative",
  },
  checkIcon: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    bottom: 0,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 20,
    backgroundColor: "green",
  },
});
export default SharePost;
