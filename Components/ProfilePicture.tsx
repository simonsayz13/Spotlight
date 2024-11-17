import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Pressable,
  Image,
  Platform,
} from "react-native";
import { Image as ExpoImage } from "expo-image";
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
          type === ImageType.PostCard && Platform.OS === "ios" ? (
            <Image
              source={{ uri, cache: "force-cache" }}
              style={{ width: size, height: size, borderRadius: size / 2 }}
            />
          ) : (
            <ExpoImage
              source={{ uri }}
              style={{ width: size, height: size, borderRadius: size / 2 }}
              cachePolicy="memory-disk"
            />
          )
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
