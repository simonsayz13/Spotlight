import * as Location from "expo-location";
import { SetStateAction } from "react";
import { Float } from "react-native/Libraries/Types/CodegenTypes";

export const getLocationPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return "Please allow location service for the app.";
  }
  return "OK";
};

export const getLocation = async (
  setCoordinates?: SetStateAction<any>
): Promise<any> => {
  try {
    const currentLocation = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Low,
    });
    const coordinates = {
      latitude: currentLocation?.coords?.latitude,
      longitude: currentLocation?.coords?.longitude,
    };
    if (setCoordinates) {
      setCoordinates(coordinates);
    }
    return coordinates;
  } catch (error) {
    return "Error getting location coordinates";
  }
};

export const getCity = async (
  latitude: Float,
  longitude: Float,
  setCity: SetStateAction<any>
) => {
  if (location) {
    try {
      const address = await Location.reverseGeocodeAsync({
        latitude: latitude,
        longitude: longitude,
      });

      // Set the city name if the response is valid
      if (address.length > 0) {
        return address[0].city ?? "Unknown City";
      }
    } catch (error) {
      console.error("Couldn't fetch the city name", error);
    }
  }
};
