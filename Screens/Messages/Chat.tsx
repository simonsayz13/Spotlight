import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Keyboard,
  TouchableOpacity,
  Platform,
} from "react-native";
import { Image } from "expo-image";
import { ThemeColours, ThemeColoursPrimary } from "../../Constants/UI";
import Ionicons from "@expo/vector-icons/Ionicons";
import { mockChatData } from "../../Constants/mockData";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import {
  createOrGetChatRoom,
  messageListener,
  sendMessage,
} from "../../Firebase/firebaseFireStore";
import { formatRelativeTime } from "../../Util/utility";

const Chat = ({ route, navigation }: any) => {
  const { userId: currentUserId, userProfilePhotoURL } = useSelector(
    (state: RootState) => state.user
  );
  const { userId, userName, profilePicUrl } = route.params;
  const scrollViewRef = useRef<ScrollView>(null);
  const [chatRoomId, setChatRoomId] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Array<any>>([]);
  const goBack = () => {
    navigation.goBack();
  };
  const textInputRef = useRef<TextInput>(null);
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    );
    const initiateChat = async () => {
      await createOrGetChatRoom(currentUserId!, userId, setChatRoomId);
    };
    initiateChat();
    return () => {
      keyboardDidShowListener.remove();
    };
  }, [userId]);

  useEffect(() => {
    if (chatRoomId) messageListener(chatRoomId, setMessages);
  }, [chatRoomId]);

  const handleSendMessage = async () => {
    await sendMessage(chatRoomId, currentUserId!, message);
    if (textInputRef.current) {
      textInputRef.current.clear();
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBarContainer}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons
            name="chevron-back"
            size={32}
            color={ThemeColoursPrimary.SecondaryColour}
          />
        </TouchableOpacity>
        <Image source={{ uri: profilePicUrl }} style={styles.profileImage} />
        <View style={styles.usernameActivityContainer}>
          <Text style={styles.userNameText}>{userName}</Text>
          <Text style={styles.activityStatusText}>Active Today</Text>
        </View>
      </View>
      <KeyboardAvoidingView
        style={styles.KeyboardAvoidingView}
        behavior="padding"
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.scrollView}
          onContentSizeChange={() => {
            scrollViewRef.current?.scrollToEnd({ animated: false });
          }}
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
                <Image
                  source={{
                    uri:
                      message.senderId === currentUserId
                        ? userProfilePhotoURL
                        : profilePicUrl,
                  }}
                  style={styles.chatProfileImage}
                />
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
              style={styles.input}
              placeholder="Send message..."
              placeholderTextColor={ThemeColoursPrimary.SecondaryColour}
              returnKeyType="send"
              onChangeText={(text: string) => {
                setMessage(text);
              }}
              onSubmitEditing={handleSendMessage}
            />
          </View>
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
    marginHorizontal: 8,
  },
  messageBarContainer: {
    borderTopWidth: 0.4,
    borderTopColor: ThemeColoursPrimary.GreyColour,
  },
  messageBar: {
    borderRadius: 12,
    marginHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderWidth: 1,
    marginVertical: 8,
  },
  input: {
    height: 42,
    paddingLeft: 8,
    fontSize: 16,
    width: "90%",
    color: ThemeColoursPrimary.SecondaryColour,
  },
  messageContainer: {
    flexDirection: "row",

    marginTop: 6,
    width: "60%",
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
    marginRight: 4,
  },
});
export default Chat;
