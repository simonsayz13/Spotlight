import { useEffect, useState, useRef } from "react";
import { Dimensions, StyleSheet, View, Text, FlatList } from "react-native";
import { Image } from "expo-image";
import { ThemeColoursPrimary } from "../Constants/UI";
import { TapGestureHandler } from "react-native-gesture-handler";
import Animated, {
  runOnJS,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import ImageModal from "./ImageModal";
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const MAX_HEIGHT = 550; // Define the maximum height for images

const ImageCarousel = ({ images }: any) => {
  const [isGalleryVisible, setIsGalleryVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showIndicator, setShowIndicator] = useState(false);
  const indicatorOpacity = useSharedValue(0); // Create a ref for opacity
  const hideTimeout = useRef<any>(null); // Use a ref to hold the timeout ID

  const handleScroll = (event: any) => {
    // Show the indicator when scrolling starts
    setShowIndicator(true);
    indicatorOpacity.value = withTiming(0.4, { duration: 100 });

    // Calculate the new index
    const index = Math.round(event.nativeEvent.contentOffset.x / windowWidth);
    setCurrentIndex(index);

    // Clear previous timeout
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }

    // Set timeout to hide the indicator after 3 seconds of inactivity
    hideTimeout.current = setTimeout(() => {
      indicatorOpacity.value = withTiming(0, { duration: 500 }, () => {
        runOnJS(setShowIndicator)(false); // Hide after animation completes
      });
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (hideTimeout.current) clearTimeout(hideTimeout.current);
    };
  }, []);

  const onClickImage = () => {
    setIsGalleryVisible(true);
  };

  const renderImage = ({ item, index }: any) => {
    const { width: originalWidth, height: originalHeight } = item;

    // Calculate the scaled dimensions
    const aspectRatio = originalWidth / originalHeight;
    let scaledWidth = windowWidth;
    let scaledHeight = windowWidth / aspectRatio;

    // Restrict the height to MAX_HEIGHT if necessary
    if (scaledHeight > MAX_HEIGHT) {
      scaledWidth = MAX_HEIGHT * aspectRatio;
    }

    return (
      <TapGestureHandler
        numberOfTaps={1}
        maxDurationMs={200} // Adjust as needed to filter out scrolls
        onActivated={onClickImage}
      >
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: item.media_url }}
            style={{
              width: scaledWidth,
              height: originalHeight,
            }}
            contentFit="contain"
            cachePolicy="memory-disk"
          />
        </View>
      </TapGestureHandler>
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
        renderItem={renderImage}
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

      <ImageModal
        imageUri={images[currentIndex].media_url}
        isGalleryVisible={isGalleryVisible}
        setIsGalleryVisible={setIsGalleryVisible}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
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
    marginTop: 4, // Spacing between the images and the dots
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
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  inactiveDot: {
    backgroundColor: "gray",
  },
});

export default ImageCarousel;
