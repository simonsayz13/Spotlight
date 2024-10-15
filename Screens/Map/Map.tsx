import React, { useEffect, useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Platform,
  KeyboardAvoidingView,
  Animated,
  PanResponder,
  TouchableOpacity,
  Alert,
  Dimensions,
} from "react-native";
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
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import BottomDrawer from "../../Components/BottomDrawer";
import MapFilters from "../../Components/MapFilters";
import FilterButton from "../../Components/FilterButton";

const { width: windowWidth, height: windowHeight } = Dimensions.get("window");

const Map = ({ navigation }: any) => {
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [currentCoordinate, setCurrentCoordinate] = useState<any>(null);
  const [gotLocation, setGotLocation] = useState(false);
  const [posts, setPosts] = useState([]);
  const slideAnim = useRef(new Animated.Value(300)).current;
  const [mapRegion, setMapRegion] = useState<any>(null);
  const mapRef = useRef<MapView>(null);
  const [heading, setHeading] = useState(0); // Track heading (bearing)
  const activityFilterDrawerRef = useRef<any>(null);
  const [selectedTag, setSelectedTag] = useState<any>(null);

  const initialise = async () => {
    const permission = await getLocationPermission();
    if (permission !== "OK") {
      return Alert.alert("Error", permission);
    }
    setGotLocation(true);
    await getLocation(setCurrentCoordinate);
    const fetchedPosts = await getLocationPosts(); // Assuming this returns an array of posts
    const postsWithUserDetails = await Promise.all(
      fetchedPosts.map(async (post: any) => {
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
          hideModal();
        } else {
          showModal();
        }
      },
    })
  ).current;

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
    }).start();
  };

  const handleMarkerPress = (post: any) => {
    showModal();
    setSelectedPost(post);
    const { latitude, longitude } = post.coordinates;
    centreMap(latitude, longitude);
  };

  const centreMap = (latitude: number, longitude: number) => {
    if (mapRef.current) {
      mapRef.current.animateCamera(
        {
          center: { latitude, longitude },
          altitude: 1200, // Zoom level for Apple map
          zoom: 12, // Adjust zoom level as needed for Google map
        },
        { duration: 800 }
      );
    }
  };

  const centerMapToCurrentLocation = async () => {
    await getLocation(setCurrentCoordinate);
    hideModal();
    if (currentCoordinate) {
      const { latitude, longitude } = currentCoordinate;
      centreMap(latitude, longitude);
    }
  };

  const onRegionChangeComplete = async () => {
    if (mapRef.current) {
      const camera = await mapRef.current.getCamera();
      setHeading(camera.heading || 0); // Set the heading (bearing) from the camera object
    }
  };

  const rotateHeading = () => {
    if (mapRef.current) {
      mapRef.current.animateCamera(
        {
          heading: 0, // Reset the map's heading (bearing) to north
        },
        { duration: 800 } // Adjust the duration for smoothness
      );
      setHeading(0);
    }
  };

  const onFilterButtonPress = () => {
    hideModal();
    activityFilterDrawerRef.current.showDrawer();
  };

  const closeFilter = () => {
    activityFilterDrawerRef.current.hideDrawer();
  };

  const selectTag = (tag: any) => {
    const newTag = tag.id === selectedTag?.id ? null : tag;
    setSelectedTag(newTag); // Deselect if clicked again
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
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
              onRegionChangeComplete();
            }}
            showsUserLocation={true}
            showsPointsOfInterest={false}
            showsMyLocationButton={false}
            showsCompass={false}
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

        <View style={styles.actionBarContainer}>
          <FilterButton
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            onFilterButtonPress={onFilterButtonPress}
          />
          <TouchableOpacity
            style={styles.buttonBase}
            onPressIn={centerMapToCurrentLocation}
          >
            <FontAwesome5
              name="location-arrow"
              size={20}
              color={ThemeColoursPrimary.PrimaryColour}
            />
          </TouchableOpacity>

          {heading !== 0 && (
            <TouchableOpacity
              style={styles.buttonBase}
              onPressIn={rotateHeading}
            >
              <FontAwesome5
                name="compass"
                size={26}
                color={ThemeColoursPrimary.PrimaryColour}
              />
            </TouchableOpacity>
          )}
        </View>

        <BottomDrawer
          heightPercentage={0.5}
          ref={activityFilterDrawerRef}
          isPannable={false}
        >
          <MapFilters selectTag={selectTag} closeFilter={closeFilter} />
        </BottomDrawer>

        <Animated.View
          style={[
            styles.modalContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
          {...modalPanResponder.panHandlers}
        >
          <View style={styles.panIndicator} />
          {selectedPost && (
            <MapPostContent
              postData={selectedPost}
              navigation={navigation}
              hideModal={hideModal}
            />
          )}
        </Animated.View>
      </KeyboardAvoidingView>
    </View>
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
  buttonBase: {
    backgroundColor: ThemeColoursPrimary.SecondaryColour,
    borderRadius: 25,
    padding: 2,
    elevation: 5,
    height: 40,
    width: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  locateButton: {
    position: "absolute",
    top: 64,
    right: 16,
  },
  compassButton: {
    position: "absolute",
    top: 80,
    right: 16,
  },
  actionBarContainer: {
    position: "absolute",
    top: 56,
    right: 16,
    gap: 16,
    alignItems: "flex-end", // Align buttons vertically
  },
});

export { Map };
