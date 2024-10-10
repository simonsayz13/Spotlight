import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  Platform,
} from "react-native";
import { PostStackScreens, ThemeColoursPrimary } from "../../Constants/UI";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Image } from "expo-image";
import { StatusBar } from "expo-status-bar";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
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
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: photoURI }}
          style={styles.imageView}
          contentFit="contain"
        >
          <TouchableOpacity style={styles.backButtonView} onPressIn={goBack}>
            <Ionicons
              name="chevron-back"
              size={32}
              color={ThemeColoursPrimary.PrimaryColour}
            />
          </TouchableOpacity>
        </Image>
      </View>

      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity style={styles.submitButton} onPressIn={goNext}>
          <Text style={styles.submitButtonText}>Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.SecondaryColour,
  },
  topBarContainer: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  imageContainer: {
    flex: 0.88,
    justifyContent: "center",
  },
  bottomButtonsContainer: {
    flex: 0.12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    bottom: 0,
    width: windowWidth,
    paddingTop: 6,
    marginBottom: 28,
  },
  backButtonView: {
    flexDirection: "row",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 20,
    alignItems: "center",
    padding: 8,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: ThemeColoursPrimary.SecondaryColour,
  },
  placeholder: {
    width: 32, // same width as the backButton to balance the layout
  },
  imageView: {
    width: windowWidth,
    height: "100%",
  },
  submitButton: {
    width: 78,
    backgroundColor: ThemeColoursPrimary.ThirdColour,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    height: 38,
    marginRight: 20,
  },
  submitButtonText: {
    fontSize: 17,
    fontWeight: "bold",
    color: ThemeColoursPrimary.PrimaryColour,
  },
});

export { ViewPhoto };
