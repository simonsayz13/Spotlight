import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Text,
} from "react-native";
import { Image } from "expo-image";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

const images = [
  { id: 1, uri: "https://placehold.co/200x300" },
  { id: 2, uri: "https://placehold.co/300x200" },
  // Add more images as needed
];

const ImageGallery = ({ items }: any) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const scale = useSharedValue(1);
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(0);

  const openImage = (image, layout) => {
    setSelectedImage(image);
    scale.value = withTiming(screenWidth / layout.width, { duration: 300 });
    translateX.value = withTiming(-layout.x, { duration: 300 });
    translateY.value = withTiming(-layout.y, { duration: 300 });
    opacity.value = withTiming(1, { duration: 300 });
  };

  const closeImage = () => {
    scale.value = withTiming(1, { duration: 300 });
    translateX.value = withTiming(0, { duration: 300 });
    translateY.value = withTiming(0, { duration: 300 });
    opacity.value = withTiming(0, { duration: 300 }, () =>
      setSelectedImage(null)
    );
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={(event) => {
        event.target.measure((x, y, width, height, pageX, pageY) => {
          openImage(item, { width, height, x: pageX, y: pageY });
        });
      }}
    >
      <Image source={{ uri: item.uri }} style={styles.thumbnail} />
    </TouchableOpacity>
  );

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <View style={styles.container}>
      <FlatList
        data={images}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.grid}
      />

      {selectedImage && (
        <Animated.View style={[styles.fullScreenContainer, animatedStyle]}>
          <TouchableOpacity onPress={closeImage}>
            <Image
              source={{ uri: selectedImage.uri }}
              style={styles.fullScreenImage}
              contentFit="contain"
            />
          </TouchableOpacity>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  grid: {
    alignItems: "center",
  },
  thumbnail: {
    width: screenWidth / 2 - 10,
    height: 150,
    margin: 5,
    borderRadius: 10,
  },
  fullScreenContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  fullScreenImage: {
    width: screenWidth,
    height: screenHeight,
  },
});

export default ImageGallery;
