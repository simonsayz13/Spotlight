import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MessagingStackScreens, ThemeColours } from "../../Constants/UI";
import { mockContactsList } from "../../Constants/mockData";
import { ScrollView } from "react-native-gesture-handler";
const Contacts = ({ navigation }: any) => {
  const goToChat = (userId: string, userName: string) => {
    navigation.navigate(MessagingStackScreens.Chat, { userId, userName });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <Ionicons name="search" size={32} color={ThemeColours.PrimaryColour} />
        <TextInput
          style={styles.input}
          placeholder="Search..."
          placeholderTextColor={ThemeColours.PrimaryColour}
        />
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
                  color={ThemeColours.SecondaryColour}
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
    backgroundColor: ThemeColours.PrimaryColour,
  },
  searchBarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    borderColor: ThemeColours.PrimaryColour,
    borderWidth: 1.0,
    marginHorizontal: 26,
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  input: {
    height: 36,
    paddingLeft: 8,
    color: ThemeColours.PrimaryColour,
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
    color: ThemeColours.SecondaryColour,
    fontSize: 20,
  },
  lastMessageText: {
    color: ThemeColours.SecondaryColour,
    opacity: 0.7,
    fontSize: 16,
  },
});

export { Contacts };
