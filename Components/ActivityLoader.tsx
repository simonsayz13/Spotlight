import React from "react";
import { ActivityIndicator, Modal, View, Text, StyleSheet } from "react-native";
import { ThemeColoursPrimary } from "../Constants/UI";

type ComponentProps = {
  indicator: boolean;
  text: string;
};

const ActivityLoader = (props: ComponentProps) => {
  const { indicator, text } = props;
  return (
    <Modal transparent={true} visible={indicator}>
      <View style={styles.loadingModal}>
        <View style={styles.activityIndicatorWrapper}>
          <ActivityIndicator
            size="large"
            color={ThemeColoursPrimary.SecondaryColour}
          />
          <Text>{text}</Text>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  loadingModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});

export default ActivityLoader;
