import React, { useEffect, useLayoutEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import { ThemeColours } from "../../Constants/UI";
import Ionicons from "@expo/vector-icons/Ionicons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { mockChatData } from "../../Constants/mockData";
const Chat = ({ route, navigation }: any) => {
  const { userId, userName } = route.params;
  const currentUserID = "1337";
  const scrollViewRef = useRef<ScrollView>(null);
  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    );
    return () => {
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBarContainer}>
        <TouchableOpacity onPress={goBack}>
          <Ionicons
            name="chevron-back"
            size={32}
            color={ThemeColours.SecondaryColour}
          />
        </TouchableOpacity>
        <Ionicons
          name="person-circle-outline"
          size={48}
          color={ThemeColours.SecondaryColour}
        />
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
          {mockChatData.map((message: any) => {
            return (
              <View
                key={message.messageId + message.messageTimeStamp}
                style={[
                  styles.messageContainer,
                  {
                    flexDirection:
                      message.userId === currentUserID ? "row-reverse" : "row",
                    alignSelf:
                      message.userId === currentUserID
                        ? "flex-end"
                        : "flex-start", // Snap to right or left
                  },
                ]}
              >
                <Ionicons
                  name="person-circle-outline"
                  size={38}
                  color={ThemeColours.SecondaryColour}
                />
                <Text
                  style={[
                    styles.messageText,
                    {
                      marginLeft: message.userId === currentUserID ? 0 : 4,
                      marginRight: message.userId === currentUserID ? 4 : 0,
                    },
                  ]}
                >
                  {message.message}
                </Text>
                <View style={styles.timeStampContainer}>
                  <Text style={styles.timeStampText}>
                    {message.messageTimeStamp}
                  </Text>
                </View>
              </View>
            );
          })}
        </ScrollView>

        <View style={styles.messageBarContainer}>
          <TextInput
            style={styles.input}
            placeholder="Send message..."
            placeholderTextColor={ThemeColours.PrimaryColour}
            returnKeyType="send"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColours.PrimaryColour,
  },
  topBarContainer: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
  },
  userNameText: {
    fontSize: 20,
    color: ThemeColours.SecondaryColour,
    fontWeight: "bold",
  },
  activityStatusText: {
    fontSize: 12,
    color: ThemeColours.SecondaryColour,
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
    borderRadius: 12,
    marginHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderColor: ThemeColours.PrimaryColour,
    borderWidth: 1.0,
    paddingHorizontal: 8,
    marginVertical: 8,
  },
  input: {
    height: 42,
    paddingLeft: 8,
    fontSize: 16,
    width: "90%",
    color: ThemeColours.PrimaryColour,
  },
  messageContainer: {
    flexDirection: "row",
    marginVertical: 6,
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
    borderWidth: 1,
    borderColor: ThemeColours.PrimaryColour,
    backgroundColor: ThemeColours.SecondaryColour,
    color: ThemeColours.PrimaryColour,
    overflow: "hidden",
  },
  timeStampContainer: {
    padding: 6, // Optional: Add some padding
  },
  timeStampText: { fontSize: 10, color: ThemeColours.SecondaryColour },
});
export default Chat;
