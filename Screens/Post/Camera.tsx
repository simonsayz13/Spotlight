import {
  Button,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CameraView as ExpoCamera, useCameraPermissions } from "expo-camera";
import { CameraType } from "expo-camera/legacy";
import { useRef, useState } from "react";
import React from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PostStackScreens, ThemeColours } from "../../Constants/UI";
const Camera = ({ navigation }: any) => {
  const [facing, setFacing] = useState<CameraType>(CameraType.back);
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
    setFacing((current) =>
      current === CameraType.front ? CameraType.back : CameraType.front
    );
  };

  const toggleCapture = async () => {
    if (cameraRef.current && isCameraReady) {
      try {
        const photo = await cameraRef.current.takePictureAsync();
        console.log("Picture taken:", photo?.uri);
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
    <SafeAreaView style={styles.container}>
      <ExpoCamera
        ref={cameraRef}
        style={styles.camera}
        facing={facing}
        onCameraReady={onCameraReady}
      >
        <View style={styles.topButtonsContainer}>
          <TouchableOpacity onPress={handleBackButton}>
            <Ionicons
              name="chevron-back"
              size={32}
              color={ThemeColours.SecondaryColour}
            />
          </TouchableOpacity>
          <View>
            <TouchableOpacity onPress={toggleCameraFacing}>
              <Ionicons
                name="camera-reverse-outline"
                size={32}
                color={ThemeColours.SecondaryColour}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.bottomButtonsContainer}>
          <View style={styles.captureRing}>
            <TouchableOpacity onPress={toggleCapture}>
              <View style={styles.captureButton} />
            </TouchableOpacity>
          </View>
        </View>
      </ExpoCamera>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColours.PrimaryColour,
  },
  message: {
    textAlign: "center",
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
  },
  topButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    backgroundColor: ThemeColours.PrimaryColour,
  },
  bottomButtonsContainer: {
    flex: 1,
    alignItems: "center",
    position: "absolute",
    height: 100,
    justifyContent: "center",
    bottom: 0,
    width: "100%",
    backgroundColor: ThemeColours.PrimaryColour,
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
  },
  captureButton: {
    height: 60,
    width: 60,
    backgroundColor: ThemeColours.SecondaryColour,
    borderRadius: 100,
  },
});

export { Camera };
