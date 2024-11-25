import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from "react-native";
import {
  ImageType,
  ProfileStackScreens,
  ThemeColoursPrimary,
} from "../../Constants/UI";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../Redux/store";
import {
  createOrGetChatRoom,
  messageListener,
  sendMessage,
} from "../../Firebase/FirebaseChat";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useIsFocused } from "@react-navigation/native"; // Hook for detecting focus
import { selectMessagesByChatRoomId } from "../../Redux/Selectors/messagesSelector";
import Message from "../../Components/Message";
import { clusterMessages } from "../../Util/utility";
import { FlashList } from "@shopify/flash-list";
import ProfilePicture from "../../Components/ProfilePicture";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Chat = ({ route, navigation }: any) => {
  const { userId: currentUserId } = useSelector(
    (state: RootState) => state.user
  );
  const { userId, userName, profilePicUrl, conversationId } = route.params;
  const FlatListRef = useRef<any>(null);
  const [chatRoomId, setChatRoomId] = useState(conversationId);
  const [message, setMessage] = useState<string>("");
  const [inputHeight, setInputHeight] = useState(40);
  const textInputRef = useRef<TextInput>(null);
  const isFocused = useIsFocused();
  const messages = useSelector(selectMessagesByChatRoomId(chatRoomId));
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();
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
  }, [chatRoomId, dispatch]);

  const handleSendMessage = async () => {
    if (message) {
      setMessage("");
      setInputHeight(40);
      await sendMessage(chatRoomId, currentUserId!, message);
      if (textInputRef.current) {
        textInputRef.current.clear();
      }
    }
  };

  const scrollToTop = () => {
    FlatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
  };

  const handleContentSizeChange = (event: any) => {
    const { height } = event.nativeEvent.contentSize;
    setInputHeight(Math.min(Math.max(40, height), 120)); // Min height 40, Max height 120
  };

  const goToProfile = () => {
    navigation.navigate(ProfileStackScreens.ViewProfile, {
      userId,
    });
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.KeyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.topBarContainer}>
          <TouchableOpacity onPress={goBack}>
            <Ionicons
              name="chevron-back"
              size={32}
              color={ThemeColoursPrimary.SecondaryColour}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPressIn={goToProfile}
            activeOpacity={1}
            style={styles.profileContainer}
          >
            <ProfilePicture
              uri={profilePicUrl}
              userDisplayName={userName}
              type={ImageType.Contacts}
            />
            <View style={styles.usernameActivityContainer}>
              <Text style={styles.userNameText}>{userName}</Text>
              {/* <Text style={styles.activityStatusText}>Active Today</Text> */}
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.messagContainer}>
          <FlashList
            ref={FlatListRef}
            data={clusterMessages(messages).reverse()}
            renderItem={({ item: message }) => (
              <Message
                message={message}
                profilePicUrl={profilePicUrl}
                userDisplayName={userName}
                navigation={navigation}
              />
            )}
            contentContainerStyle={styles.messagesList}
            onLayout={scrollToTop}
            estimatedItemSize={50}
            inverted={true}
            bounces={false}
          />
        </View>
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
            />
          </View>
          <TouchableOpacity onPressIn={handleSendMessage}>
            <FontAwesome
              name="send"
              size={28}
              color={ThemeColoursPrimary.LogoColour}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  messagContainer: {
    flex: 1,
    height: "100%",
    backgroundColor: ThemeColoursPrimary.LightGreyBackground,
  },
  messagesList: {
    paddingHorizontal: 8,
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
    marginLeft: 6,
  },
  KeyboardAvoidingView: {
    flex: 1,
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
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});
export default Chat;
