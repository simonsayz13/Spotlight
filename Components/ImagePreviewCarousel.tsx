import { memo } from "react";
import { ScrollView, TouchableOpacity, View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemeColoursPrimary } from "../Constants/UI";

const ImagePreviewCarousel = memo(({ photoArray, setPhotoArray }: any) => {
  const handleDelete = (photoURI: string) => {
    setPhotoArray((prevArray: string[]) =>
      prevArray.filter((uri) => uri !== photoURI)
    );
  };

  return (
    <View style={styles.imagePreviewContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        bounces={false}
      >
        {photoArray.map((photoURI: string) => (
          <View key={photoURI} style={styles.imageWrapper}>
            <TouchableOpacity key={photoURI} activeOpacity={1}>
              <Image source={{ uri: photoURI }} style={styles.imageView} />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(photoURI)}
              >
                <AntDesign name="closecircleo" size={20} color="black" />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  imagePreviewContainer: {
    marginTop: 8,
    alignSelf: "flex-start",
    marginHorizontal: 10,
    flexDirection: "row",
  },
  imageView: {
    width: 110,
    height: 110,
    borderRadius: 10,
    marginRight: 6,
  },
  menuBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  deleteButton: {
    position: "absolute",
    top: -6,
    right: -2,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    borderRadius: 12,
    zIndex: 20,
  },
  imageWrapper: {
    paddingTop: 8,
    paddingRight: 8,
    position: "relative", // To position the delete button correctly
  },
});

export default ImagePreviewCarousel;
