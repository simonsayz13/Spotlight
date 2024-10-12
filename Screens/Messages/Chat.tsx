import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { Image } from "expo-image";
import { ThemeColoursPrimary } from "../../Constants/UI";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../Redux/store";
import {
  createOrGetChatRoom,
  messageListener,
  sendMessage,
} from "../../Firebase/firebaseFireStore";
import { formatRelativeTime } from "../../Util/utility";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native"; // Hook for detecting focus
import { selectMessagesByChatRoomId } from "../../Redux/Selectors/messagesSelector";

const { width: windowWidth } = Dimensions.get("window");

const Chat = ({ route, navigation }: any) => {
  const { userId: currentUserId, userProfilePhotoURL } = useSelector(
    (state: RootState) => state.user
  );
  const { userId, userName, profilePicUrl } = route.params;
  const scrollViewRef = useRef<ScrollView>(null);
  const [chatRoomId, setChatRoomId] = useState("");
  const [message, setMessage] = useState<string>("");
  const [inputHeight, setInputHeight] = useState(40);
  const textInputRef = useRef<TextInput>(null);
  const isFocused = useIsFocused();
  const messages = useSelector(selectMessagesByChatRoomId(chatRoomId));
  const dispatch = useDispatch();

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    if (!isFocused) return;

    const initiateChat = async () => {
      await createOrGetChatRoom(currentUserId!, userId, setChatRoomId);
    };

    initiateChat();
  }, [isFocused]);

  useEffect(() => {
    if (!chatRoomId) return;

    // Call messageListener and capture the unsubscribe function
    const unsubscribe = messageListener(chatRoomId, dispatch);

    return () => {
      unsubscribe(); // Unsubscribe from Firestore listener
    };
  }, [chatRoomId]);

  const handleSendMessage = async () => {
    setMessage("");
    setInputHeight(32);
    await sendMessage(chatRoomId, currentUserId!, message, dispatch);
    if (textInputRef.current) {
      textInputRef.current.clear();
    }
  };

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    setInputHeight(Math.min(Math.max(40, height + 20), 120)); // Min height 40, Max height 120
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.KeyboardAvoidingView}
        behavior="padding"
      >
        <View style={styles.topBarContainer}>
          <TouchableOpacity onPress={goBack}>
            <Ionicons
              name="chevron-back"
              size={32}
              color={ThemeColoursPrimary.SecondaryColour}
            />
          </TouchableOpacity>
          <Image
            source={
              profilePicUrl
                ? { uri: profilePicUrl }
                : require("../../assets/test_image/mock_profile_picture.png")
            }
            style={styles.profileImage}
          />

          <View style={styles.usernameActivityContainer}>
            <Text style={styles.userNameText}>{userName}</Text>
            <Text style={styles.activityStatusText}>Active Today</Text>
          </View>
        </View>

        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollView}
          onContentSizeChange={() =>
            scrollViewRef.current?.scrollToEnd({ animated: false })
          }
          onLayout={scrollToBottom}
          bounces={false}
        >
          {messages.map((message: any) => {
            return (
              <View
                key={message.id + message.timestamp}
                style={[
                  styles.messageContainer,
                  {
                    flexDirection:
                      message.senderId === currentUserId
                        ? "row-reverse"
                        : "row",
                    alignSelf:
                      message.senderId === currentUserId
                        ? "flex-end"
                        : "flex-start", // Snap to right or left
                  },
                ]}
              >
                {!userProfilePhotoURL && !profilePicUrl ? (
                  <Image
                    source={require("../../assets/test_image/mock_profile_picture.png")}
                    style={styles.chatProfileImage}
                  />
                ) : (
                  <Image
                    source={
                      message.senderId === currentUserId
                        ? {
                            uri: userProfilePhotoURL!,
                          }
                        : profilePicUrl
                        ? { uri: profilePicUrl }
                        : require("../../assets/test_image/mock_profile_picture.png")
                    }
                    style={styles.chatProfileImage}
                  />
                )}

                <Text
                  style={[
                    styles.messageText,
                    {
                      marginLeft: message.senderId === currentUserId ? 0 : 4,
                      marginRight: message.senderId === currentUserId ? 4 : 0,
                    },
                  ]}
                >
                  {message.text}
                </Text>
                <View style={styles.timeStampContainer}>
                  <Text style={styles.timeStampText}>
                    {formatRelativeTime(message.timestamp)}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.messageBarContainer}>
          <View style={styles.messageBar}>
            <TextInput
              ref={textInputRef}
              style={[styles.input, { height: inputHeight }]}
              placeholder="Send message..."
              placeholderTextColor={ThemeColoursPrimary.SecondaryColour}
              onChangeText={setMessage}
              value={message}
              multiline
              onContentSizeChange={handleContentSizeChange}
              // scrollEnabled={false} // Prevent internal scroll
              textAlignVertical="center"
            />
          </View>
          <TouchableOpacity onPressIn={handleSendMessage}>
            <FontAwesome name="send" size={28} color="black" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  topBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.4,
    borderBottomColor: ThemeColoursPrimary.GreyColour,
    paddingTop: Platform.OS === "android" ? 4 : 0,
    paddingBottom: 4,
  },
  userNameText: {
    fontSize: 20,
    color: ThemeColoursPrimary.SecondaryColour,
    fontWeight: "bold",
  },
  activityStatusText: {
    fontSize: 12,
    color: ThemeColoursPrimary.SecondaryColour,
    opacity: 0.6,
  },
  usernameActivityContainer: {
    marginLeft: 2,
  },
  KeyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    paddingHorizontal: 8,
  },
  messageBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    borderTopWidth: 0.4,
    borderTopColor: ThemeColoursPrimary.GreyColour,
    padding: 8,
  },
  messageBar: {
    flex: 1,
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1f1f1",
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    borderRadius: 20,
    fontSize: 16,
    color: ThemeColoursPrimary.SecondaryColour,
    paddingVertical: Platform.OS === "ios" ? 10 : 0,
    height: "100%",
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 6,
    width: windowWidth * 0.6,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: "transparent",
  },
  messageText: {
    padding: 6,
    fontSize: 14,
    fontWeight: "500",
    borderRadius: 8,
    borderWidth: 1.3,
    borderColor: ThemeColoursPrimary.SecondaryColour,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    color: ThemeColoursPrimary.SecondaryColour,
    overflow: "hidden",
  },
  timeStampContainer: {
    padding: 6, // Optional: Add some padding
  },
  timeStampText: { fontSize: 10, color: ThemeColoursPrimary.SecondaryColour },
  profileImage: {
    width: 50, // Width and height should be the same
    height: 50,
    borderRadius: 50, // Half of the width or height for a perfect circle
    marginRight: 4,
  },
  chatProfileImage: {
    width: 40, // Width and height should be the same
    height: 40,
    borderRadius: 50, // Half of the width or height for a perfect circle
  },
});
export default Chat;
