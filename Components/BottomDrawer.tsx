import React, {
  forwardRef,
  ReactNode,
  useImperativeHandle,
  useRef,
} from "react";
import { Dimensions, PanResponder, StyleSheet, View } from "react-native";
import { ThemeColoursPrimary } from "../Constants/UI";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from "react-native-reanimated";

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
    const slideAnim = useSharedValue(windowHeight); // Use Reanimated shared value

    const modalPanResponder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, gestureState) => {
          const { dy } = gestureState;
          // Allow movement only downwards (dy > 0), and stop at original position (translateY 0)
          if (dy > 0) {
            // slideAnim.setValue(dy);
            slideAnim.value = dy;
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
      slideAnim.value = withTiming(0, {
        duration: 300,
        easing: Easing.out(Easing.exp),
      });
    };

    const hideDrawer = () => {
      slideAnim.value = withTiming(windowHeight, {
        duration: 300,
        easing: Easing.in(Easing.exp),
      });
    };

    useImperativeHandle(ref, () => ({
      hideDrawer,
      showDrawer,
    }));

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{ translateY: slideAnim.value }],
    }));

    return (
      <Animated.View
        style={[
          styles.modalContainer,
          animatedStyle,
          {
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
    elevation: 10, // For Android shadow
    zIndex: 100,
    overflow: "hidden", // Add this line
    width: "100%",
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
