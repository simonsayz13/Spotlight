import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MessagingStackScreens, ThemeColoursPrimary } from "../../Constants/UI";
import { ScrollView } from "react-native-gesture-handler";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useEffect, useRef, useState } from "react";
import {
  conversationListener,
  getUserDetails,
  searchUsers,
} from "../../Firebase/firebaseFireStore";
import { formatRelativeTime } from "../../Util/utility";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import { UserDetails } from "../../type/Messenger";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const Contacts = ({ navigation }: any) => {
  const { userId: currentUserId } = useSelector(
    (state: RootState) => state.user
  );

  const [conversations, setConversations] = useState<Array<any>>([]);
  const [userDetails, setUserDetails] = useState<{
    [key: string]: UserDetails;
  }>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<Array<UserDetails>>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const textInputRef = useRef<TextInput>(null);
  useEffect(() => {
    const unsubscribe = conversationListener(currentUserId!, setConversations);
    return () => {
      unsubscribe();
    };
  }, [currentUserId]);

  const clearSearch = () => {
    setSearchQuery(""); // Reset the searchQuery state
    textInputRef.current?.clear(); // Use ref to clear the TextInput value
    Keyboard.dismiss(); // Optionally dismiss the keyboard
  };

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
    clearSearch();
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

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery.length > 0) {
        const results = await searchUsers(searchQuery);
        setFilteredUsers(
          results.filter((user) => user.userId !== currentUserId)
        );
      } else {
        setFilteredUsers([]);
      }
    };

    fetchUsers();
  }, [searchQuery]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBarContainer}>
        <View style={styles.searchBar}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons
              name="search"
              size={32}
              color={ThemeColoursPrimary.SecondaryColour}
            />
            <TextInput
              ref={textInputRef}
              style={styles.input}
              placeholder="Search..."
              placeholderTextColor={ThemeColoursPrimary.SecondaryColour}
              value={searchQuery}
              onFocus={() => setIsDropdownVisible(true)} // Show dropdown when input is focused
              onChangeText={(text) => setSearchQuery(text)}
            />
          </View>
          {searchQuery.length > 0 && (
            <TouchableOpacity onPressIn={clearSearch}>
              <AntDesign name="closecircleo" size={20} color="black" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Show dropdown list if searchQuery is not empty */}
      {isDropdownVisible && searchQuery.length > 0 && (
        <ScrollView
          style={styles.dropdownContainer}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {filteredUsers.map((user) => {
            return (
              <TouchableOpacity
                key={`dropdown_${user.userId}`}
                onPress={() => {
                  goToChat(
                    user.userId,
                    user.display_name!,
                    user.profile_picture_url!
                  );
                  Keyboard.dismiss(); // Hide the keyboard when navigating
                }}
              >
                <View style={styles.dropdownItem}>
                  {user.profile_picture_url ? (
                    <Image
                      source={{ uri: user.profile_picture_url }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <Image
                      source={require("../../assets/test_image/mock_profile_picture.png")}
                      style={styles.profileImage}
                    />
                  )}

                  <Text style={styles.usernameText}>{user.display_name}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
      {searchQuery.length === 0 && (
        <ScrollView bounces={false}>
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
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  searchBarContainer: {
    borderBottomWidth: 0.2,
    borderBottomColor: ThemeColoursPrimary.GreyColour,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColoursPrimary.BackgroundColour,
    borderRadius: 10,
    borderColor: ThemeColoursPrimary.PrimaryColour,
    borderWidth: 1.0,
    marginHorizontal: 12,
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  input: {
    height: 36,
    paddingLeft: 8,
    fontSize: 16,
    width: Platform.OS === "ios" ? windowWidth * 0.76 : windowWidth * 0.74,
  },
  messageCardContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 6,
  },
  usernameTimeStampContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: windowWidth * 0.76,
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
    width: windowWidth * 0.76,
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
  dropdownContainer: {
    height: windowHeight, // Limit height of dropdown list
    width: windowWidth,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    zIndex: 10, // Ensure it appears above other elements
  },
  dropdownItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f1f1",
  },
});

export { Contacts };
