import React, { useEffect, useState, useRef } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  View,
  Platform,
  KeyboardAvoidingView,
  Animated,
  PanResponder,
  TouchableOpacity,
  Alert,
  Dimensions,
  Text,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MapView, { Marker } from "react-native-maps";
import { ThemeColoursPrimary } from "../../Constants/UI";
import { getLocation, getLocationPermission } from "../../Util/LocationService";
import ActivityLoader from "../../Components/ActivityLoader";
import {
  getLocationPosts,
  getUserDetails,
} from "../../Firebase/firebaseFireStore";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MapPostContent from "../../Components/MapPostContent";
const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const Map = ({ navigation }: any) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [currentCoordinate, setCurrentCoordinate] = useState<any>(null);
  const [gotLocation, setGotLocation] = useState(false);
  const [posts, setPosts] = useState([]);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const [mapRegion, setMapRegion] = useState<any>(null);
  const mapRef = useRef<MapView>(null);

  const initialise = async () => {
    const permission = await getLocationPermission();
    if (permission !== "OK") {
      return Alert.alert("Error", permission);
    }
    setGotLocation(true);
    await getLocation(setCurrentCoordinate);
    const fetchedPosts = await getLocationPosts(); // Assuming this returns an array of posts
    const postsWithUserDetails = await Promise.all(
      fetchedPosts.map(async (post) => {
        //@ts-ignore
        const userDetails = await getUserDetails(post.postData.user_id); // Assuming user_id is available in post
        return {
          ...post.postData,
          id: post.id,
          //@ts-ignore
          userDisplayName: userDetails.display_name,
          //@ts-ignore
          userProfilePic: userDetails.profile_picture_url,
        };
      })
    );
    setPosts(postsWithUserDetails);
    setGotLocation(false);
    setMapRegion(currentCoordinate);
  };

  useEffect(() => {
    initialise();
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

  const handleMarkerPress = (post: any) => {
    setSelectedPost(post);
    setIsModalVisible(true);
    const { latitude, longitude } = post.coordinates;
    centreMap(latitude, longitude);
  };

  const centreMap = (latitude: number, longitude: number) => {
    if (mapRef.current) {
      mapRef.current.animateCamera(
        {
          center: { latitude, longitude },
          altitude: 1000, // Zoom level for Apple map
          zoom: 7, // Adjust zoom level as needed for Google map
        },
        { duration: 800 }
      );
    }
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

  const centerMapToCurrentLocation = async () => {
    await getLocation(setCurrentCoordinate);
    hideModal();
    if (currentCoordinate) {
      const { latitude, longitude } = currentCoordinate;
      centreMap(latitude, longitude);
    }
  };
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
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              latitude: currentCoordinate.latitude, // Initial latitude
              longitude: currentCoordinate.longitude, // Initial longitude
              latitudeDelta: 0.02, // Controls the amount of zoom (smaller means more zoomed in)
              longitudeDelta: 0.02, // Controls the horizontal zoom level (smaller means more zoomed in)
            }}
            region={mapRegion}
            onRegionChangeComplete={(region) => {
              setMapRegion(region);
            }}
            showsUserLocation={true}
            showsPointsOfInterest={false}
          >
            {posts.map((post: any) => (
              <Marker
                key={post.id}
                coordinate={{
                  latitude: post.coordinates.latitude,
                  longitude: post.coordinates.longitude,
                }}
                onPress={() => handleMarkerPress(post)}
              >
                <MaterialCommunityIcons
                  name="sign-text"
                  size={32}
                  color={ThemeColoursPrimary.LogoColour}
                />
              </Marker>
            ))}
          </MapView>
        )}
        {Platform.OS === "ios" && (
          <TouchableOpacity
            style={styles.locateButton}
            onPressIn={() => {
              centerMapToCurrentLocation();
            }}
          >
            <Ionicons name="locate" size={24} color="black" />
          </TouchableOpacity>
        )}
        {isModalVisible && (
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ translateY: slideAnim }] },
            ]}
            {...modalPanResponder.panHandlers}
          >
            <View style={styles.panIndicator} />
            <View style={styles.modalContent}>
              {selectedPost && (
                <MapPostContent
                  postData={selectedPost}
                  navigation={navigation}
                  hideModal={hideModal}
                />
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
  panIndicator: {
    alignSelf: "center",
    borderWidth: 1,
    width: 38,
    height: 4,
    borderRadius: 10,
    backgroundColor: ThemeColoursPrimary.SecondaryColour,
    marginBottom: 6,
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
    width: windowWidth,
    height: windowHeight,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 8,
    elevation: 10, // For Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    height: windowHeight * 0.22,
  },
  modalContent: {},
  locateButton: {
    position: "absolute",
    top: 70,
    left: 10,
    // right: 10,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    borderRadius: 25,
    padding: 2,
    elevation: 5,
  },
});

export { Map };
