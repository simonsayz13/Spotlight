import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Animated,
  PanResponder,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ThemeColoursPrimary } from "../Constants/UI";

const { width } = Dimensions.get("window");

const CustomDrawer = ({ drawerContent, children }: any) => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerWidth = width * 0.75;
  const translateX = new Animated.Value(-drawerWidth);
  // PanResponder for swipe gestures
  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: (_, gestureState) => {
      return gestureState.dx > 10 || gestureState.dx < -10;
    },
    onPanResponderMove: (_, gestureState) => {
      if (gestureState.dx >= 0) {
        translateX.setValue(-drawerWidth + gestureState.dx);
      }
    },
    onPanResponderRelease: (_, gestureState) => {
      if (gestureState.dx > drawerWidth / 2) {
        openDrawer();
      } else {
        closeDrawer();
      }
    },
  });

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.timing(translateX, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const closeDrawer = () => {
    Animated.timing(translateX, {
      toValue: -drawerWidth,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setDrawerOpen(false); // Ensure the drawer is marked as closed only after animation ends
    });
  };

  useEffect(() => {
    drawerOpen ? openDrawer() : closeDrawer();
  }, [drawerOpen]);

  return (
    <View style={styles.container}>
      {/* Drawer - Positioned absolutely to slide over the main content */}
      {drawerOpen && (
        <Animated.View
          style={[
            styles.drawer,
            { transform: [{ translateX }] },
            { width: drawerWidth },
          ]}
          {...panResponder.panHandlers}
        >
          {drawerContent()}
        </Animated.View>
      )}

      {/* Main Content */}
      <View style={styles.mainContent}>{children({ openDrawer })}</View>

      {/* Touchable overlay to close the drawer when clicking outside */}
      {drawerOpen && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={closeDrawer}
          activeOpacity={1}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  drawer: {
    position: "absolute", // Positioning drawer absolutely
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    zIndex: 2, // Ensure drawer is above main content
    paddingVertical: 20,
  },
  mainContent: {
    flex: 1,
    zIndex: 1, // Main content stays behind the drawer
  },
  overlay: {
    position: "absolute",
    width: "100%",
    height: "100%",
    color: "red",
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1,
  },
});

export default CustomDrawer;
