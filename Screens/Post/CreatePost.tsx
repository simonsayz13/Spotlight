import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { ThemeColours } from "../../Constants/UI";
import Ionicons from "@expo/vector-icons/Ionicons";
import { uploadImage } from "../../Firebase/firebaseStorage";
const CreatePost = ({ navigation, route }: any) => {
  const { photoURI } = route.params;

  const goBack = () => {
    navigation.goBack();
  };

  const handleSend = () => {
    uploadImage(photoURI);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBarContainer}>
        <TouchableOpacity onPressIn={goBack} style={styles.backButton}>
          <Ionicons
            name="chevron-back"
            size={32}
            color={ThemeColours.SecondaryColour}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Create Post</Text>
        <View style={styles.placeholder} />
      </View>
      <Image source={{ uri: photoURI }} style={styles.imageView} />
      <TouchableOpacity style={styles.buttonView} onPressIn={handleSend}>
        <Text style={styles.buttonText}>Send</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    alignItems: "center",
    backgroundColor: ThemeColours.PrimaryColour,
  },
  topBarContainer: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColours.PrimaryColour,
  },
  backButton: {
    width: 32, // same width as the icon
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: ThemeColours.SecondaryColour,
  },
  placeholder: {
    width: 32, // same width as the backButton to balance the layout
  },
  imageView: {
    width: "70%",
    height: "50%",
    marginTop: 4,
  },
  buttonView: {
    width: 120,
    height: 40,
    backgroundColor: ThemeColours.SecondaryColour,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: ThemeColours.PrimaryColour,
  },
});

export { CreatePost };
