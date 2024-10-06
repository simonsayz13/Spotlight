import * as Location from "expo-location";
import { SetStateAction } from "react";

export const getLocationPermission = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== "granted") {
    return "Permission to access location was denied";
  }
  return "OK";
};

export const getLocation = async (setCoordinate?: SetStateAction<any>) => {
  try {
    const currentLocation = await Location.getCurrentPositionAsync({});

    console.log(currentLocation);
    if (currentLocation)
      setCoordinate({
        longitude: currentLocation.coords.longitude,
        latitude: currentLocation.coords.latitude,
      });
  } catch (error) {
    return "Error getting location coordinates";
  }
};
