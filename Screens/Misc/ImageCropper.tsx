import React, { useState, useRef } from "react";
import {
  View,
  Image,
  Button,
  StyleSheet,
  Alert,
  Dimensions,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import {
  PinchGestureHandler,
  State,
  PinchGestureHandlerGestureEvent,
} from "react-native-gesture-handler";
const { width } = Dimensions.get("window");
const CIRCLE_SIZE = width * 0.8; // Set the diameter of the circle

const ImageCropScreen = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const scale = useRef(1);
  const imageRef = useRef<Image | null>(null); // Explicitly type the ref

  // Typing the event parameter for the pinch gesture handler
  const onPinchEvent = (event: PinchGestureHandlerGestureEvent) => {
    if (event.nativeEvent.scale && imageRef.current) {
      scale.current = event.nativeEvent.scale;
      imageRef.current.setNativeProps({
        style: { transform: [{ scale: scale.current }] },
      });
    }
  };

  const onPinchStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      scale.current = event.nativeEvent.scale;
    }
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Allows cropping
      aspect: [3, 4], // Specify aspect ratio (optional)
      quality: 1,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Pick an image" onPress={pickImage} />
      {selectedImage && (
        <>
          <PinchGestureHandler
            onGestureEvent={onPinchEvent}
            onHandlerStateChange={onPinchStateChange}
          >
            <Image
              ref={imageRef}
              source={{ uri: selectedImage }}
              style={styles.image}
              resizeMode="contain"
            />
          </PinchGestureHandler>
          <Button
            title="Crop Image"
            onPress={() => {
              Alert.alert(
                "Cropped Image",
                `Cropped image URI: ${selectedImage}`
              );
            }}
          />
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "80%",
    transform: [{ scale: 1 }],
  },
});

export default ImageCropScreen;
