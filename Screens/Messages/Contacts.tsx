import {
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
import {
  ImageType,
  MessagingStackScreens,
  ThemeColoursPrimary,
} from "../../Constants/UI";
import { Pressable, ScrollView, Swipeable } from "react-native-gesture-handler";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { useEffect, useRef, useState } from "react";
import { searchUsers } from "../../Firebase/firebaseFireStore";
import { formatRelativeTime } from "../../Util/utility";
import AntDesign from "@expo/vector-icons/AntDesign";
import { UserDetails } from "../../type/Messenger";
import ActivityLoader from "../../Components/ActivityLoader";
import ProfilePicture from "../../Components/ProfilePicture";
import { getUserProfileDetails } from "../../Firebase/FirebaseUsers";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { deleteChatRoom } from "../../Redux/Slices/chatSlices";
import { removeConversation } from "../../Redux/Slices/conversationSlice";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const Contacts = ({ navigation }: any) => {
  const { userId: currentUserId } = useSelector(
    (state: RootState) => state.user
  );
  const { conversations } = useSelector(
    (state: RootState) => state.conversations
  );
  const otherUsers = useSelector((state: RootState) => state.otherUsers);

  const [userDetails, setUserDetails] = useState<{
    [key: string]: UserDetails;
  }>({});
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState<Array<any>>([]);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Add loading state
  const textInputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();
  const dispatch = useDispatch();

  const clearSearch = () => {
    setSearchQuery(""); // Reset the searchQuery state
    textInputRef.current?.clear(); // Use ref to clear the TextInput value
    Keyboard.dismiss(); // Optionally dismiss the keyboard
  };

  const goToChat = (
    userId: string,
    userName: string,
    profilePicUrl: string,
    conversationId: string
  ) => {
    navigation.navigate(MessagingStackScreens.Chat, {
      userId,
      userName,
      profilePicUrl,
      conversationId,
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
            const details = await getUserProfileDetails(
              userId,
              otherUsers,
              dispatch
            );
            newDetails[userId] = details;
          }
        })
      );
      setUserDetails((prevDetails) => ({ ...prevDetails, ...newDetails }));
      setLoading(false);
    };
    fetchUserDetails();
  }, [conversations]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchQuery.length > 0) {
        const results = await searchUsers(searchQuery);
        const conversationMap = userConversationMap(); // Create the map

        const filtered = results
          .filter((user) => user.userId !== currentUserId)
          .map((user) => ({
            ...user,
            conversationId: conversationMap[user.userId] || "", // Attach conversationId if exists
          }));
        setFilteredUsers(filtered);
      } else {
        setFilteredUsers([]);
      }
    };

    fetchUsers();
  }, [searchQuery]);

  const userConversationMap = () => {
    const map: { [key: string]: string } = {};
    conversations.forEach((conversation) => {
      conversation.participants.forEach((userId: string) => {
        map[userId] = conversation.id; // Map userId to conversationId
      });
    });
    return map;
  };

  const renderRightActions = (chatId: string) => (
    <Pressable
      style={styles.deleteButton}
      onPress={() => {
        dispatch(removeConversation(chatId));
        dispatch(deleteChatRoom(chatId));
      }}
    >
      <Text style={styles.deleteText}>Delete</Text>
    </Pressable>
  );

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
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
                    user.profile_picture_url!,
                    user.conversationId
                  );
                  Keyboard.dismiss(); // Hide the keyboard when navigating
                }}
              >
                <View style={styles.dropdownItem}>
                  <ProfilePicture
                    uri={user.profile_picture_url}
                    userDisplayName={user.display_name}
                    type={ImageType.Contacts}
                  />
                  <Text style={styles.usernameText}>{user.display_name}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      {loading ? (
        <ActivityLoader indicator={loading} text={"Loading..."} />
      ) : (
        searchQuery.length === 0 && (
          <ScrollView>
            {conversations.map((conversation) => {
              const userId = conversation.participants.find(
                (userId: string) => userId != currentUserId
              );
              const { displayName, profilePictureUrl } =
                userDetails[userId || ""] || {};
              return (
                <Swipeable
                  key={`key_${userId}`}
                  renderRightActions={() => renderRightActions(conversation.id)}
                >
                  <Pressable
                    onPress={() => {
                      goToChat(
                        userId!,
                        displayName!,
                        profilePictureUrl!,
                        conversation.id
                      );
                    }}
                  >
                    <View style={styles.messageCardContainer}>
                      <ProfilePicture
                        uri={profilePictureUrl}
                        userDisplayName={displayName}
                        type={ImageType.Contacts}
                      />
                      <View style={{ marginLeft: 6, gap: 6 }}>
                        <View style={styles.usernameTimeStampContainer}>
                          <Text style={styles.usernameText}>{displayName}</Text>
                          <Text style={styles.timeStamp}>
                            {formatRelativeTime(
                              conversation.lastMessage.timestamp
                            )}
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

                    <View style={styles.divider} />
                  </Pressable>
                </Swipeable>
              );
            })}
          </ScrollView>
        )
      )}
    </View>
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
    gap: 6,
  },
  divider: {
    borderBottomWidth: 0.6,
    borderColor: ThemeColoursPrimary.SecondaryColour + "20",
    marginLeft: 76,
    width: "100%",
    height: 0.8,
  },
  deleteButton: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    zIndex: 100,
  },
  deleteText: {
    color: "white",
    fontWeight: "bold",
  },
});

export { Contacts };
