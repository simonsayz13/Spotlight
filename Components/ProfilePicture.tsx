import React from "react";
import { StyleSheet, View, Text, Pressable } from "react-native";
import { Image } from "expo-image";
import {
  ImageType,
  ProfilePictureSize,
  ThemeColoursPrimary,
} from "../Constants/UI";
import { getInitials } from "../Util/utility";

const ProfilePicture = React.memo(
  ({ uri, userDisplayName, type = ImageType.Profile, onPressFunc }: any) => {
    const size = ProfilePictureSize[type as ImageType];

    const handleOnPress = () => {
      if (type === ImageType.Profile) {
        onPressFunc(true);
      }
    };

    const ProfilePictureView = () => (
      <>
        {uri ? (
          <Image
            source={{ uri }}
            style={{ width: size, height: size, borderRadius: size / 2 }}
            cachePolicy="disk"
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
      </>
    );

    return onPressFunc ? (
      <Pressable onPress={handleOnPress}>
        <ProfilePictureView />
      </Pressable>
    ) : (
      <View>
        <ProfilePictureView />
      </View>
    );
  }
);

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
