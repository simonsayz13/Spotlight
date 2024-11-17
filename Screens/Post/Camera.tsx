import {
  Button,
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  CameraView as ExpoCamera,
  useCameraPermissions,
  CameraType,
  FlashMode,
} from "expo-camera";
import React, { useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  PostStackScreens,
  ThemeColours,
  ThemeColoursPrimary,
} from "../../Constants/UI";
import { StatusBar } from "expo-status-bar";
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const Camera = ({ navigation }: any) => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [flash, setFlash] = useState<FlashMode>("off");
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef<ExpoCamera>(null);

  if (!permission) {
    // Camera permissions are still loading.
    return <View />;
  }

  const onCameraReady = () => {
    setIsCameraReady(true);
  };

  const handleBackButton = () => {
    navigation.goBack();
  };

  if (!permission.granted) {
    // Camera permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={styles.message}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "front" ? "back" : "front"));
  };
  const toggleFlash = () => {
    setFlash((current) => (current === "off" ? "on" : "off"));
  };

  const toggleCapture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        navigation.navigate(PostStackScreens.ViewPhoto, {
          photoURI: photo?.uri,
        });
        // Do something with the photo, e.g., save it, navigate, etc.
      } catch (error) {
        console.error("Error taking picture:", error);
      }
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar hidden />
      <View style={styles.cameraContainer}>
        <ExpoCamera
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          onCameraReady={onCameraReady}
          //@ts-ignore
          flash={flash}
        >
          <View style={styles.topButtonsContainer}>
            <TouchableOpacity onPress={handleBackButton}>
              <Ionicons
                name="close"
                size={32}
                color={ThemeColoursPrimary.PrimaryColour}
              />
            </TouchableOpacity>
            <View></View>
          </View>
        </ExpoCamera>
      </View>
      <View style={styles.bottomButtonsContainer}>
        <TouchableOpacity onPress={toggleFlash}>
          <Ionicons
            name={flash === FlashMode.off ? "flash-off" : "flash"}
            size={28}
            color={ThemeColoursPrimary.PrimaryColour}
          />
        </TouchableOpacity>
        <View style={styles.captureRing}>
          <TouchableOpacity onPress={toggleCapture}>
            <View style={styles.captureButton} />
          </TouchableOpacity>
        </View>
        <TouchableOpacity onPress={toggleCameraFacing}>
          <Ionicons
            name="camera-reverse-outline"
            size={32}
            color={ThemeColoursPrimary.PrimaryColour}
          />
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
  cameraContainer: {
    flex: 0.88, // Set 80% height for the camera
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  topButtonsContainer: {
    flexDirection: "row",
    top: Platform.OS === "ios" ? 50 : 20,
    left: 20,
    alignItems: "center",
    padding: 8,
  },
  bottomButtonsContainer: {
    flex: 0.12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    bottom: 0,
    width: windowWidth,
    paddingTop: 6,
    marginBottom: 28,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  captureRing: {
    height: 80,
    width: 80,
    borderWidth: 6,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderColor: ThemeColours.SecondaryColour,
    marginHorizontal: 90,
  },
  captureButton: {
    height: 60,
    width: 60,
    backgroundColor: ThemeColours.SecondaryColour,
    borderRadius: 100,
  },
});

export { Camera };
