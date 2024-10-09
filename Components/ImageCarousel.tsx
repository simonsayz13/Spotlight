import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
const { width, height } = Dimensions.get("window");

const MAX_HEIGHT = 500; // Define the maximum height for images
const { width: windowWidth } = Dimensions.get("window");
const ImageCarousel = ({ images }: any) => {
  return (
    <View style={styles.container}>
      {images.map((image: any) => {
        const { width, height } = image;

        let calculatedHeight = (windowWidth / width) * height; // Calculate height based on aspect ratio
        let calculatedWidth = windowWidth;

        // Check if the calculated height exceeds the maximum height
        if (calculatedHeight > MAX_HEIGHT) {
          calculatedHeight = MAX_HEIGHT; // Set to max height
          calculatedWidth = (MAX_HEIGHT / height) * width; // Recalculate width to maintain aspect ratio
        }

        return (
          <Image
            key={image.media_url}
            source={{ uri: image.media_url }}
            style={{
              width: calculatedWidth,
              height: calculatedHeight,
            }}
            contentFit="contain"
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ImageCarousel;
