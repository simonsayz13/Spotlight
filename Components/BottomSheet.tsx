import React, { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { ThemeColoursPrimary } from "../Constants/UI";
import AntDesign from "@expo/vector-icons/AntDesign";
const { height: windowHeight } = Dimensions.get("window");

const BottomSheet = ({ children, menuBar, heightPercentage }: any) => {
  const sheetHeight = windowHeight * heightPercentage;
  const slideAnim = useRef(new Animated.Value(sheetHeight)).current;
  const [opened, setOpened] = useState(false);
  const iconRotation = useRef(new Animated.Value(0)).current;
  const showModal = () => {
    setOpened(true);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: windowHeight * 0.1,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(iconRotation, {
        toValue: 1, // 1 for down icon
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const hideModal = () => {
    setOpened(false);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: sheetHeight,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(iconRotation, {
        toValue: 0, // 0 for up icon
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Interpolating rotation for flipping effect
  const rotateInterpolate = iconRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-180deg"],
  });

  return (
    <Animated.View
      style={[
        styles.modalContainer,
        { transform: [{ translateY: slideAnim }], height: sheetHeight },
      ]}
    >
      <View style={styles.menuBar}>
        {menuBar}
        {/* Animated Icon */}
        <Animated.View
          style={{
            transform: [{ rotate: rotateInterpolate }],
          }}
        >
          <TouchableOpacity
            onPress={() => (opened ? hideModal() : showModal())}
          >
            <AntDesign
              name="up"
              size={32}
              color={ThemeColoursPrimary.SecondaryColour}
            />
          </TouchableOpacity>
        </Animated.View>
      </View>
      {opened && <View style={styles.children}>{children}</View>}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: "absolute",
    bottom: windowHeight * 0.1,
    left: 0,
    right: 0,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    padding: 10,
    elevation: 10, // For Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: ThemeColoursPrimary.SecondaryColour,
  },
  menuBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  children: {},
});

export default BottomSheet;
