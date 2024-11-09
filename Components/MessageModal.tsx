import React, { useEffect, useState } from "react";
import { Modal, View, Text, StyleSheet, Animated } from "react-native";

const MessageModal = ({ message, visible, setModalVisible }) => {
  const [showModal, setShowModal] = useState(visible);
  const fadeAnim = useState(new Animated.Value(0))[0]; // Initial opacity: 0

  useEffect(() => {
    if (visible) {
      setShowModal(true);

      // Fade in animation
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Hide modal after 6 seconds with fade out animation
      const timer = setTimeout(() => {
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          setShowModal(false);
          setModalVisible(false);
        }); // Set showModal to false after fade out
      }, 2000);

      return () => clearTimeout(timer); // Clean up timer on unmount
    }
  }, [visible]);

  if (!showModal) return null;

  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalContainer}>
        <Animated.View style={[styles.messageBox, { opacity: fadeAnim }]}>
          <Text style={styles.messageText}>{message}</Text>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  messageBox: {
    backgroundColor: "#333",
    padding: 12,
    borderRadius: 8,
  },
  messageText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default MessageModal;
