import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  MessagingStackScreens,
  ThemeColours,
  ThemeColoursPrimary,
} from "../../Constants/UI";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useEffect, useState } from "react";
import {
  conversationListener,
  getUserDetails,
} from "../../Firebase/firebaseFireStore";
import { formatRelativeTime } from "../../Util/utility";
import { Image } from "expo-image";
const Contacts = ({ navigation }: any) => {
  const { userId: currentUserId } = useSelector(
    (state: RootState) => state.user
  );
  const goToChat = (
    userId: string,
    userName: string,
    profilePicUrl: string
  ) => {
    navigation.navigate(MessagingStackScreens.Chat, {
      userId,
      userName,
      profilePicUrl,
    });
  };

  const [conversations, setConversations] = useState<Array<any>>([]);
  const [userDetails, setUserDetails] = useState<{
    [key: string]: UserDetails;
  }>({});

  useEffect(() => {
    const unsubscribe = conversationListener(currentUserId!, setConversations);
    return () => {
      unsubscribe();
    };
  }, [currentUserId]);

  type UserDetails = {
    display_name: string | null;
    profile_picture_url: string | null;
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      const newDetails: any = {};
      // Fetch the display name and profile picture for each participant (except the current user)
      await Promise.all(
        conversations.map(async (conversation) => {
          const userId = conversation.participants.find(
            (userId: any) => userId !== currentUserId
          );
          if (userId && !userDetails[userId]) {
            const details = await getUserDetails(userId);
            newDetails[userId] = details;
          }
        })
      );
      setUserDetails((prevDetails) => ({ ...prevDetails, ...newDetails }));
    };
    fetchUserDetails();
  }, [conversations]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={32}
            color={ThemeColoursPrimary.SecondaryColour}
          />
          <TextInput
            style={styles.input}
            placeholder="Search..."
            placeholderTextColor={ThemeColoursPrimary.SecondaryColour}
          />
        </View>
      </View>
      <ScrollView style={styles.scrollViewContainer}>
        {conversations.map((conversation) => {
          const userId = conversation.participants.find(
            (userId: string) => userId != currentUserId
          );
          const { display_name: displayName, profile_picture_url } =
            userDetails[userId || ""] || {};
          return (
            <TouchableOpacity
              key={`key_${userId}`}
              onPress={() => {
                goToChat(userId, displayName!, profile_picture_url!);
              }}
            >
              <View style={styles.messageCardContainer}>
                {profile_picture_url ? (
                  <Image
                    source={{ uri: profile_picture_url }}
                    style={styles.profileImage}
                  />
                ) : (
                  <Image
                    source={require("../../assets/test_image/mock_profile_picture.png")}
                    style={styles.profileImage}
                  />
                )}

                <View>
                  <View style={styles.usernameTimeStampContainer}>
                    <Text style={styles.usernameText}>{displayName}</Text>
                    <Text style={styles.timeStamp}>
                      {formatRelativeTime(conversation.lastMessage.timestamp)}
                    </Text>
                  </View>
                  <Text
                    style={styles.lastMessageText}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {conversation.lastMessage.text}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 0.2,
    borderBottomColor: ThemeColoursPrimary.GreyColour,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    borderColor: ThemeColoursPrimary.PrimaryColour,
    borderWidth: 1.0,
    marginHorizontal: 26,
    marginVertical: 6,
    paddingHorizontal: 8,
  },
  input: {
    height: 36,
    paddingLeft: 8,
    fontSize: 16,
    width: "90%",
  },
  scrollViewContainer: {
    // paddingHorizontal: 2,
  },
  messageCardContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 4,
  },
  usernameTimeStampContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 300,
  },
  usernameText: {
    fontWeight: "bold",
    color: ThemeColoursPrimary.SecondaryColour,
    fontSize: 20,
  },
  lastMessageText: {
    color: ThemeColoursPrimary.SecondaryColour,
    opacity: 0.7,
    fontSize: 16,
    width: 300,
  },
  timeStamp: {
    color: ThemeColoursPrimary.SecondaryColour,
    opacity: 0.7,
    fontSize: 12,
  },
  profileImage: {
    width: 60, // Width and height should be the same
    height: 60,
    borderRadius: 50, // Half of the width or height for a perfect circle
    marginRight: 6,
  },
});

export { Contacts };
