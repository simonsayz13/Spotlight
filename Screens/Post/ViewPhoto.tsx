import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { PostStackScreens, ThemeColours } from "../../Constants/UI";
import Ionicons from "@expo/vector-icons/Ionicons";
const ViewPhoto = ({ navigation, route }: any) => {
  const { photoURI } = route.params;

  const goBack = () => {
    navigation.goBack();
  };

  const goNext = () => {
    navigation.navigate(PostStackScreens.CreatePost, {
      photoURI,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topBarContainer}>
        <TouchableOpacity onPressIn={goBack} style={styles.button}>
          <Ionicons
            name="chevron-back"
            size={32}
            color={ThemeColours.SecondaryColour}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Photo View</Text>
        <TouchableOpacity onPressIn={goNext} style={styles.button}>
          <Ionicons
            name="chevron-forward"
            size={32}
            color={ThemeColours.SecondaryColour}
          />
        </TouchableOpacity>
      </View>
      <Image source={{ uri: photoURI }} style={styles.imageView} />
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
  button: {
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
    width: "100%",
    height: "100%",
    // marginVertical: 20,
  },
});

export { ViewPhoto };
