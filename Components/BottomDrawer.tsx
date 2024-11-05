import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
} from "react";
import {
  Animated,
  Dimensions,
  Easing,
  PanResponder,
  StyleSheet,
  View,
} from "react-native";
import { ThemeColoursPrimary } from "../Constants/UI";

const { height: windowHeight } = Dimensions.get("window");

type ComponentProps = {
  heightPercentage: number;
  isPannable: boolean;
  isAbsolute?: boolean;
  children: ReactNode;
};

const BottomDrawer = forwardRef(
  (
    { heightPercentage, isPannable, isAbsolute, children }: ComponentProps,
    ref
  ) => {
    const slideAnim = useRef(new Animated.Value(windowHeight)).current;

    const modalPanResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
          const { dy } = gestureState;
          // Allow movement only downwards (dy > 0), and stop at original position (translateY 0)
          if (dy > 0) {
            // slideAnim.setValue(dy);
            slideAnim.setValue(dy);
          }
        },
        onPanResponderRelease: (_, gestureState) => {
          const { dy, vy } = gestureState;
          if (dy > windowHeight * heightPercentage * 0.5 || vy > 1) {
            // Dismiss drawer if dragged far or fast enough
            hideDrawer();
          } else {
            // Snap back to original position if not
            showDrawer();
          }
        },
      })
    ).current;

    const showDrawer = () => {
      console.log("he");
      Animated.timing(slideAnim, {
        toValue: 0, // Final position
        duration: 300, // Adjust the duration for a smooth transition
        easing: Easing.out(Easing.exp), // Optional: Adjust easing for smoothness
        useNativeDriver: true,
      }).start();
    };

    const hideDrawer = () => {
      Animated.timing(slideAnim, {
        toValue: windowHeight, // Offscreen position
        duration: 300, // Adjust the duration for a smooth transition
        easing: Easing.in(Easing.exp), // Optional: Adjust easing for smoothness
        useNativeDriver: true,
      }).start();
    };

    useImperativeHandle(ref, () => ({
      hideDrawer,
      showDrawer,
    }));

    return (
      <Animated.View
        style={[
          styles.modalContainer,
          {
            transform: [{ translateY: slideAnim }],
            height: windowHeight * heightPercentage,
          },
          isAbsolute && { position: "absolute" },
        ]}
        {...(isPannable ? modalPanResponder.panHandlers : {})}
      >
        {isPannable && <View style={styles.panIndicator} />}
        {children}
      </Animated.View>
    );
  }
);

const styles = StyleSheet.create({
  modalContainer: {
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingVertical: 6,
    // paddingHorizontal: 8,
    elevation: 10, // For Android shadow
    // shadowColor: ThemeColoursPrimary.SecondaryColour,
    // shadowOffset: { width: 0, height: -1 },
    // shadowOpacity: 0.2,
    // shadowRadius: 2,
    zIndex: 100,
  },
  panIndicator: {
    alignSelf: "center",
    borderWidth: 1,
    width: 38,
    height: 4,
    borderRadius: 10,
    backgroundColor: ThemeColoursPrimary.SecondaryColour,
    marginBottom: 6,
  },
});

export default BottomDrawer;
