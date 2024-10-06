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
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MapView, { Marker } from "react-native-maps";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { ThemeColours, ThemeColoursPrimary } from "../../Constants/UI";
import { getLocation, getLocationPermission } from "../../Util/LocationService";
import ActivityLoader from "../../Components/ActivityLoader";
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
const Map = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [currentCoordinate, setCurrentCoordinate] = useState(null);
  const [gotLocation, setGotLocation] = useState(false);
  const slideAnim = useRef(new Animated.Value(300)).current;

  const checkPermission = async () => {
    const permission = await getLocationPermission();
    if (permission !== "OK") {
      Alert.alert("Error", permission);
    }
  };

  const getCoordinates = async () => {
    setGotLocation(true);
    await getLocation(setCurrentCoordinate);
    setGotLocation(false);
  };

  useEffect(() => {
    checkPermission();
    getCoordinates();
  }, []);

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
        <View style={styles.searchBarContainer}>
          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={32}
              color={ThemeColoursPrimary.SecondaryColour}
            />
            <TextInput
              style={styles.input}
              placeholder="Search..."
              placeholderTextColor={ThemeColoursPrimary.SecondaryColour}
            />
          </View>
        </View>
        <ActivityLoader indicator={gotLocation} text={"Locating..."} />
        {currentCoordinate && (
          <MapView
            style={styles.map}
            initialRegion={{
              //@ts-ignore
              latitude: currentCoordinate.latitude, // Initial latitude
              //@ts-ignore
              longitude: currentCoordinate.longitude, // Initial longitude
              latitudeDelta: 0.09, // Controls the amount of zoom (smaller means more zoomed in)
              longitudeDelta: 0.04, // Controls the horizontal zoom level (smaller means more zoomed in)
            }}
          >
            <Marker
              coordinate={{
                //@ts-ignore
                latitude: currentCoordinate.latitude,
                //@ts-ignore
                longitude: currentCoordinate.longitude,
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
        )}

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
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },

  searchBarContainer: {
    borderBottomWidth: 0.2,
    borderBottomColor: ThemeColoursPrimary.GreyColour,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColoursPrimary.BackgroundColour,
    borderRadius: 10,
    borderColor: ThemeColoursPrimary.PrimaryColour,
    borderWidth: 1.0,
    marginHorizontal: 12,
    marginVertical: 8,
    paddingHorizontal: 8,
  },
  input: {
    height: 36,
    paddingLeft: 8,
    color: ThemeColoursPrimary.SecondaryColour,
    fontSize: 16,
    width: Platform.OS === "ios" ? windowWidth * 0.76 : windowWidth * 0.74,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
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
    color: ThemeColoursPrimary.SecondaryColour,
  },
  modalDescription: {
    marginVertical: 10,
    fontSize: 16,
    color: ThemeColoursPrimary.SecondaryColour,
  },
});

export { Map };
