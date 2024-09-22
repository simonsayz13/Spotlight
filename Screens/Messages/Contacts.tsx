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
import { mockContactsList } from "../../Constants/mockData";
import { ScrollView } from "react-native-gesture-handler";
const Contacts = ({ navigation }: any) => {
  const goToChat = (userId: string, userName: string) => {
    navigation.navigate(MessagingStackScreens.Chat, { userId, userName });
  };

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
        {mockContactsList.map((contact) => {
          return (
            <TouchableOpacity
              key={`key_${contact.userId}`}
              onPress={() => {
                goToChat(contact.userId, contact.userName);
              }}
            >
              <View style={styles.messageCardContainer}>
                <Ionicons
                  name="person-circle-outline"
                  size={62}
                  color={ThemeColoursPrimary.SecondaryColour}
                />
                <View>
                  <View style={styles.usernameTimeStampContainer}>
                    <Text style={styles.usernameText}>{contact.userName}</Text>
                    <Text style={styles.lastMessageText}>
                      {contact.lastMessageTimeStamp}
                    </Text>
                  </View>
                  <Text style={styles.lastMessageText}>
                    {contact.lastMessage}
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
    // color: ThemeColoursPrimary.PrimaryColour,
    fontSize: 16,
    width: "90%",
  },
  scrollViewContainer: {
    paddingHorizontal: 10,
  },
  messageCardContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  usernameTimeStampContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
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
  },
});

export { Contacts };
