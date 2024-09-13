import React, { useEffect, useState, useRef } from "react";
import {
  Button,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  View,
  PermissionsAndroid,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Animated,
  PanResponder,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MapView, { Marker } from "react-native-maps";
import Geolocation from "@react-native-community/geolocation";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ThemeColours } from "../../Constants/UI";
const Map = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const slideAnim = useRef(new Animated.Value(300)).current;

  const modalPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const { dy } = gestureState;
        if (dy > 0) {
          // Sliding down
          slideAnim.setValue(dy + 20);
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        const { dy, vy } = gestureState;
        if (dy > 100 || vy > 1) {
          // Close the modal if dragged down significantly
          hideModal();
        } else {
          // Otherwise, return to the top position
          showModal();
        }
      },
    })
  ).current;

  const handleMarkerPress = (markerData: any) => {
    setSelectedMarker(markerData);
    setIsModalVisible(true);
  };

  const showModal = () => {
    Animated.spring(slideAnim, {
      toValue: 20, // Final position
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.spring(slideAnim, {
      toValue: 300, // Offscreen position
      useNativeDriver: true,
    }).start(() => {
      setIsModalVisible(false); // Hide modal after animation
    });
  };
  useEffect(() => {
    if (isModalVisible) {
      showModal();
    }
  }, [isModalVisible]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.searchBar}>
          <Ionicons
            name="search"
            size={32}
            color={ThemeColours.PrimaryColour}
          />
          <TextInput
            style={styles.input}
            placeholder="Search..."
            placeholderTextColor={ThemeColours.PrimaryColour}
          />
        </View>
        <MapView style={styles.map}>
          <Marker
            coordinate={{
              latitude: 53.405411,
              longitude: -2.94934,
              //@ts-ignore
              latitudeDelta: 0.005, // Adjust zoom level (smaller = closer)
              longitudeDelta: 0.005, // Adjust zoom level (smaller = closer)
            }}
            onPress={() =>
              handleMarkerPress({
                title: "Custom Title",
                description: "Marker Description",
              })
            }
          >
            <FontAwesome5
              name="map-marker-alt"
              size={32}
              color={ThemeColours.PrimaryColour}
            />
          </Marker>
        </MapView>

        {isModalVisible && (
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ translateY: slideAnim }] },
            ]}
            {...modalPanResponder.panHandlers}
          >
            <View style={styles.modalContent}>
              {selectedMarker && (
                <>
                  <Text style={styles.modalTitle}>找旅游搭子</Text>
                  <Text style={styles.modalDescription}>
                    圣诞节 法国，意大利，西班牙都可
                  </Text>
                </>
              )}
            </View>
          </Animated.View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColours.PrimaryColour,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    borderColor: ThemeColours.PrimaryColour,
    borderWidth: 1.0,
    marginHorizontal: 26,
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  input: {
    height: 36,
    paddingLeft: 8,
    color: ThemeColours.PrimaryColour,
    fontSize: 16,
    width: "90%",
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: ThemeColours.PrimaryColour,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    padding: 16,
    elevation: 5, // For Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    height: "35%",
  },
  modalContent: {
    // alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: ThemeColours.SecondaryColour,
  },
  modalDescription: {
    marginVertical: 10,
    fontSize: 16,
    color: ThemeColours.SecondaryColour,
  },
});

export { Map };
