import React from "react";
import { StyleSheet, View, Text } from "react-native";
import { Image } from "expo-image";
import {
  ImageType,
  ProfilePictureSize,
  ThemeColoursPrimary,
} from "../Constants/UI";
import { getInitials } from "../Util/utility";

const ProfilePicture = ({
  uri,
  userDisplayName,
  type = ImageType.Profile,
}: any) => {
  const size = ProfilePictureSize[type as ImageType];
  return (
    <View>
      {uri ? (
        <Image
          source={{ uri }}
          style={{ width: size, height: size, borderRadius: size / 2 }}
        />
      ) : (
        <View
          style={[
            styles.initialsContainer,
            { width: size, height: size, borderRadius: size / 2 },
          ]}
        >
          <Text style={[styles.initialsText, { fontSize: size / 2 }]}>
            {getInitials(userDisplayName)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  initialsContainer: {
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  initialsText: {
    color: ThemeColoursPrimary.LogoColour, // Text color

    fontFamily: "Shrikhand_400Regular",
  },
});

export default ProfilePicture;
