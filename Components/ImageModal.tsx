import React from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
  Dimensions,
  Platform,
} from "react-native";
import Gallery from "react-native-awesome-gallery";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeColoursPrimary } from "../Constants/UI";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const ImageModal = ({
  imageUri,
  isGalleryVisible,
  setIsGalleryVisible,
}: any) => {
  return (
    <Modal visible={isGalleryVisible} transparent={false}>
      <View style={styles.fullscreenContainer}>
        <Gallery data={[imageUri]} />
      </View>
      <Pressable
        style={styles.closeButton}
        onPress={() => setIsGalleryVisible(false)}
      >
        <Ionicons
          name="close"
          size={32}
          color={ThemeColoursPrimary.PrimaryColour}
        />
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    backgroundColor: "black",
  },
  closeButton: {
    position: "absolute",
    top: Platform.OS === "android" ? 10 : 40,
    right: 20,
    borderRadius: 20,
    padding: 10,
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  fullscreenImage: {
    width: windowWidth,
    height: windowHeight,
  },
});

export default ImageModal;
