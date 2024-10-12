import React, { useEffect, useState, useRef } from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  Text,
  FlatList,
  Animated,
} from "react-native";
import { Image } from "expo-image";
import { ThemeColoursPrimary } from "../Constants/UI";

const { width: windowWidth } = Dimensions.get("window");
const MAX_HEIGHT = 550; // Define the maximum height for images

const ImageCarousel = ({ images }: any) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showIndicator, setShowIndicator] = useState(false);
  const indicatorOpacity = useRef(new Animated.Value(0)).current; // Create a ref for opacity
  const hideTimeout = useRef<any>(null); // Use a ref to hold the timeout ID

  const handleScroll = (event: any) => {
    // Show the indicator when scrolling starts
    setShowIndicator(true);
    Animated.timing(indicatorOpacity, {
      toValue: 0.4,
      duration: 1,
      useNativeDriver: true,
    }).start();

    // Calculate the new index
    const index = Math.round(event.nativeEvent.contentOffset.x / windowWidth);
    setCurrentIndex(index);

    // Clear previous timeout
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }

    // Set timeout to hide the indicator after 3 seconds of inactivity
    hideTimeout.current = setTimeout(() => {
      Animated.timing(indicatorOpacity, {
        toValue: 0, // Fade out
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setShowIndicator(false); // Hide after animation completes
      });
    }, 3000);
  };

  useEffect(() => {
    return () => {
      // Cleanup: Clear timeout on unmount to prevent memory leaks
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  const renderItem = ({ item }: any) => {
    // Calculate dimensions for each image
    const { width, height } = item;
    let calculatedHeight = (windowWidth / width) * height; // Calculate height based on aspect ratio
    let calculatedWidth = windowWidth;

    // If height exceeds max height, adjust the dimensions to fit within max height
    if (calculatedHeight > MAX_HEIGHT) {
      calculatedHeight = MAX_HEIGHT;
      calculatedWidth = (MAX_HEIGHT / height) * width;
    }

    return (
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: item.media_url }}
          style={{
            width: calculatedWidth,
            height: calculatedHeight,
          }}
          contentFit="contain"
        />
      </View>
    );
  };

  const renderDots = (
    <View style={styles.dotsContainer}>
      {images.length > 0 &&
        images.map((_: unknown, index: number) => {
          const isActive = index === currentIndex;
          return (
            <View
              key={index}
              style={[
                styles.dot,
                isActive ? styles.activeDot : styles.inactiveDot,
              ]}
            />
          );
        })}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* FlatList for horizontal scrolling */}
      <FlatList
        data={images}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.media_url} // Ensure unique key for FlatList
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      {/* Top-right indicator */}
      {images.length > 1 && showIndicator && (
        <Animated.View
          style={[styles.indicatorContainer, { opacity: indicatorOpacity }]}
        >
          <Text style={styles.indicatorText}>
            {currentIndex + 1}/{images.length}
          </Text>
        </Animated.View>
      )}

      {/* Dots Indicator */}
      {images.length > 1 && renderDots}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    width: windowWidth, // Full width to enable swiping
    height: MAX_HEIGHT, // Ensure uniform height for all images
  },
  indicatorContainer: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: ThemeColoursPrimary.SecondaryColour,
    opacity: 0.4,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 4,
  },
  indicatorText: {
    color: ThemeColoursPrimary.PrimaryColour,
    fontSize: 14,
  },
  dotsContainer: {
    flexDirection: "row",
    marginTop: 6, // Spacing between the images and the dots
  },
  dot: {
    alignSelf: "center",
    width: 6,
    height: 6,
    borderRadius: 10,
    marginHorizontal: 4,
  },
  activeDot: {
    alignSelf: "center",
    backgroundColor: ThemeColoursPrimary.LogoColour,
    width: 10,
    height: 10,
    borderRadius: 10,
  },
  inactiveDot: {
    backgroundColor: "gray",
  },
});

export default ImageCarousel;
