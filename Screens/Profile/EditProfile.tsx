import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  EditProfileType,
  ImageType,
  ProfileStackScreens,
  ThemeColoursPrimary,
} from "../../Constants/UI";
import { useSelector } from "react-redux";
import { updateProfileField } from "../../Firebase/firebaseFireStore";
import { updateProfilePhotoURL } from "../../Redux/Slices/userSlice";
import store, { RootState } from "../../Redux/store";
import * as ImagePicker from "expo-image-picker";
import { uploadProfilePicture } from "../../Firebase/firebaseStorage";
import ActivityLoader from "../../Components/ActivityLoader";
import ProfilePicture from "../../Components/ProfilePicture";
import EditProfileItem from "../../Components/EditProfileItem";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const EditProfile = ({ navigation }: any) => {
  const {
    userId,
    userDisplayName,
    userProfilePhotoURL,
    userAge,
    userBio,
    userGender,
    userLocation,
  } = useSelector((state: RootState) => state.user);
  const [uploading, setUploading] = useState(false);
  const insets = useSafeAreaInsets();

  const goToPhotoBrowser = () => {
    pickImage();
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true, // Allows cropping
      aspect: [3, 4], // Specify aspect ratio (optional)
      quality: 1,
    });

    if (!result.canceled) {
      setUploading(true);
      try {
        const uploadResponse = await uploadProfilePicture(
          userId!,
          result.assets[0].uri
        );
        await updateProfileField(userId!, {
          profile_picture_url: uploadResponse,
        });
        store.dispatch(updateProfilePhotoURL(uploadResponse));
      } catch (error) {
        Alert.alert(
          "Error",
          "Error updating profile picture, please try again"
        );
      }
      setUploading(false);
    }
  };

  const goBack = () => {
    navigation.goBack();
  };

  const goToEdit = (itemName: any, itemData: any) => {
    navigation.navigate(ProfileStackScreens.EditScreen, {
      itemName,
      itemData,
    });
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "height" : "padding"}
      >
        <View style={styles.topBarContainer}>
          <TouchableOpacity onPressIn={goBack} style={styles.backButton}>
            <Ionicons
              name="chevron-back"
              size={32}
              color={ThemeColoursPrimary.SecondaryColour}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={styles.placeholder} />
        </View>
        <ScrollView style={styles.scrollView}>
          <View style={styles.detailsView}>
            <View style={styles.imageSection}>
              <View style={styles.imageContainer}>
                <ProfilePicture
                  uri={userProfilePhotoURL}
                  userDisplayName={userDisplayName}
                  type={ImageType.Profile}
                />
                <TouchableOpacity
                  style={styles.iconContainer}
                  onPressIn={goToPhotoBrowser}
                >
                  <Ionicons
                    name="camera-sharp"
                    size={18}
                    color={ThemeColoursPrimary.PrimaryColour}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <EditProfileItem
              itemTitle={EditProfileType.Name}
              itemData={userDisplayName}
              onClickItem={() => {
                goToEdit(EditProfileType.Name, userDisplayName);
              }}
            />
            <View style={styles.divider} />
            <EditProfileItem
              itemTitle={EditProfileType.Bio}
              itemData={userBio}
              onClickItem={() => {
                goToEdit(EditProfileType.Bio, userBio);
              }}
            />
            <View style={styles.divider} />
            <EditProfileItem
              itemTitle={EditProfileType.Gender}
              itemData={userGender}
              onClickItem={() => {
                goToEdit(EditProfileType.Gender, userGender);
              }}
            />
            <View style={styles.divider} />
            <EditProfileItem
              itemTitle={EditProfileType.Age}
              itemData={userAge}
              onClickItem={() => {
                goToEdit(EditProfileType.Age, userAge);
              }}
            />
            <View style={styles.divider} />
            <EditProfileItem
              itemTitle={EditProfileType.Location}
              itemData={userLocation}
              onClickItem={() => {
                goToEdit(EditProfileType.Location, userLocation);
              }}
            />
            <View style={styles.divider} />
          </View>
        </ScrollView>

        {/* loading modal for uploading picture */}
        <ActivityLoader indicator={uploading} text={"Uploading..."} />
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    paddingTop: Platform.OS === "android" ? 8 : 0,
  },
  topBarContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 32, // same width as the icon
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: ThemeColoursPrimary.SecondaryColour,
  },
  placeholder: {
    width: 32, // same width as the backButton to balance the layout
  },
  scrollView: {
    flexGrow: 1,
  },
  detailsView: {
    marginHorizontal: 14,
  },
  imageSection: {
    alignItems: "center",
    paddingVertical: 8,
  },
  imageContainer: {
    position: "relative", // To position the icon inside
  },
  iconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    justifyContent: "center",
    backgroundColor: ThemeColoursPrimary.SecondaryColour,
    borderRadius: 20, // Half of the size of the icon to make it circular
    padding: 4, // Padding to make the icon stand out
  },
  divider: {
    height: 1,
    width: "100%", // Same width as the TouchableOpacity
    backgroundColor: ThemeColoursPrimary.SecondaryColour, // Gray line color
    alignSelf: "center",
    opacity: 0.15,
  },
});

export default EditProfile;
