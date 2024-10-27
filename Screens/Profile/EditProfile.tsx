import React, { useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  Platform,
  ScrollView,
  Animated,
  PanResponder,
  KeyboardAvoidingView,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  EditProfileType,
  Gender,
  ImageType,
  ThemeColours,
  ThemeColoursPrimary,
} from "../../Constants/UI";
import { useSelector } from "react-redux";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TextInput } from "react-native-gesture-handler";
import { updateProfileField } from "../../Firebase/firebaseFireStore";
import { FireStoreUsersField } from "../../Constants/dbReference";
import {
  updateAge,
  updateBio,
  updateDisplayName,
  updateGender,
  updateLocation,
  updateProfilePhotoURL,
} from "../../Redux/Slices/userSlice";
import store, { RootState } from "../../Redux/store";
import * as ImagePicker from "expo-image-picker";
import { uploadProfilePicture } from "../../Firebase/firebaseStorage";
import ActivityLoader from "../../Components/ActivityLoader";
import ProfilePicture from "../../Components/ProfilePicture";

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
  const slideAnim = useRef(new Animated.Value(400)).current;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editType, setEditType] = useState<string>("");

  const [displayName, setDisplayName] = useState<string | null>(
    userDisplayName
  );
  const [bio, setBio] = useState<string | null>(userBio);
  const [selectedGender, setSelectedGender] = useState<Gender | null>(
    userGender
  );
  const [age, setAge] = useState<number | null>(userAge);
  const [location, setLocation] = useState<string | null>(userLocation);
  const [uploading, setUploading] = useState(false);

  const handleEditPress = (editType: string) => {
    setEditType(editType);
    setIsModalVisible(true);
    showModal();
  };

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

  const showModal = () => {
    Animated.spring(slideAnim, {
      toValue: 0, // Final position
      useNativeDriver: true,
    }).start();
  };

  const hideModal = () => {
    Animated.spring(slideAnim, {
      toValue: 400, // Offscreen position
      useNativeDriver: true,
    }).start(() => {
      setIsModalVisible(false); // Hide modal after animation
    });
  };

  const modalPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        const { dy } = gestureState;
        if (dy > 0) {
          // Sliding down
          slideAnim.setValue(dy);
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

  const handleSaveDisplayName = async () => {
    await updateProfileField(userId!, {
      [FireStoreUsersField.DisplayName]: displayName,
    });
    store.dispatch(updateDisplayName(displayName));
    hideModal();
  };
  const handleSaveBio = async () => {
    await updateProfileField(userId!, {
      [FireStoreUsersField.Bio]: bio,
    });
    store.dispatch(updateBio(bio));
    hideModal();
  };
  const handleSaveGender = async () => {
    await updateProfileField(userId!, {
      [FireStoreUsersField.Gender]: selectedGender,
    });
    store.dispatch(updateGender(selectedGender));
    hideModal();
  };
  const handleSaveAge = async () => {
    await updateProfileField(userId!, {
      [FireStoreUsersField.Age]: age,
    });
    store.dispatch(updateAge(age));
    hideModal();
  };
  const handleSaveLocation = async () => {
    await updateProfileField(userId!, {
      [FireStoreUsersField.Location]: location,
    });
    store.dispatch(updateLocation(location));
    hideModal();
  };

  const modalBodyDom = (type: EditProfileType) => {
    if (type === EditProfileType.Name) {
      return (
        <View style={{ alignItems: "center" }}>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.nameTextInput}
              onChangeText={(text) => setDisplayName(text)}
            >
              {userDisplayName!}
            </TextInput>
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPressIn={handleSaveDisplayName}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (type === EditProfileType.Bio) {
      return (
        <View style={{ alignItems: "center" }}>
          <View style={styles.bioTextInputContainer}>
            <TextInput
              style={styles.nameTextInput}
              multiline={true}
              onChangeText={(text) => setBio(text)}
            >
              {userBio}
            </TextInput>
          </View>
          <TouchableOpacity style={styles.saveButton} onPressIn={handleSaveBio}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (type === EditProfileType.Gender) {
      return (
        <View style={{ alignItems: "center" }}>
          <View
            style={{
              alignSelf: "flex-start",
              paddingLeft: 30,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: ThemeColours.SecondaryColour }}>
              Choose Gender
            </Text>
          </View>
          <View style={styles.optionPickerContainer}>
            <TouchableOpacity
              style={styles.optionPicker}
              activeOpacity={1}
              onPressIn={() => {
                setSelectedGender(Gender.Male);
              }}
            >
              <Text style={styles.optionText}>{Gender.Male}</Text>
              {selectedGender === Gender.Male && (
                <AntDesign
                  name="check"
                  size={24}
                  color={ThemeColours.PrimaryColour}
                />
              )}
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.optionPicker}
              activeOpacity={1}
              onPressIn={() => setSelectedGender(Gender.Female)}
            >
              <Text style={styles.optionText}>{Gender.Female}</Text>
              {selectedGender === Gender.Female && (
                <AntDesign
                  name="check"
                  size={26}
                  color={ThemeColours.PrimaryColour}
                />
              )}
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.optionPicker}
              activeOpacity={1}
              onPressIn={() => setSelectedGender(Gender.Other)}
            >
              <Text style={styles.optionText}>{Gender.Other}</Text>
              {selectedGender === Gender.Other && (
                <AntDesign
                  name="check"
                  size={26}
                  color={ThemeColours.PrimaryColour}
                />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPressIn={handleSaveGender}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (type === EditProfileType.Age) {
      return (
        <View style={{ alignItems: "center" }}>
          <View style={styles.ageInputContainer}>
            <TextInput
              style={styles.ageTextInput}
              keyboardType="numeric"
              onChangeText={(text) => setAge(Number(text))}
            >
              {userAge}
            </TextInput>
          </View>
          <TouchableOpacity style={styles.saveButton} onPressIn={handleSaveAge}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (type === EditProfileType.Location) {
      return (
        <View style={{ alignItems: "center" }}>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.nameTextInput}
              onChangeText={(text) => setLocation(text)}
            >
              {userLocation}
            </TextInput>
          </View>
          <TouchableOpacity
            style={styles.saveButton}
            onPressIn={handleSaveLocation}
          >
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return <></>;
  };

  return (
    <SafeAreaView style={styles.container}>
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
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>
                {EditProfileType.Name}
              </Text>
              <View style={styles.detailSectionTextView}>
                <Text style={styles.detailSectionText}>{userDisplayName}</Text>
                <TouchableOpacity
                  onPressIn={() => {
                    handleEditPress(EditProfileType.Name);
                  }}
                >
                  <AntDesign
                    name="edit"
                    size={20}
                    color={ThemeColoursPrimary.SecondaryColour}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>
                {EditProfileType.Bio}
              </Text>
              <View style={styles.detailSectionTextView}>
                <Text
                  style={[
                    styles.detailSectionText,
                    { width: 260, textAlign: "right" },
                  ]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {userBio}
                </Text>
                <TouchableOpacity
                  onPressIn={() => {
                    handleEditPress(EditProfileType.Bio);
                  }}
                >
                  <AntDesign
                    name="edit"
                    size={20}
                    color={ThemeColoursPrimary.SecondaryColour}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>
                {EditProfileType.Gender}
              </Text>
              <View style={styles.detailSectionTextView}>
                <Text
                  style={styles.detailSectionText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {selectedGender}
                </Text>
                <TouchableOpacity
                  onPressIn={() => {
                    handleEditPress(EditProfileType.Gender);
                  }}
                >
                  <AntDesign
                    name="edit"
                    size={20}
                    color={ThemeColoursPrimary.SecondaryColour}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>
                {EditProfileType.Age}
              </Text>
              <View style={styles.detailSectionTextView}>
                <Text
                  style={styles.detailSectionText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {userAge}
                </Text>
                <TouchableOpacity
                  onPressIn={() => {
                    handleEditPress(EditProfileType.Age);
                  }}
                >
                  <AntDesign
                    name="edit"
                    size={20}
                    color={ThemeColoursPrimary.SecondaryColour}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.divider} />
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>
                {EditProfileType.Location}
              </Text>
              <View style={styles.detailSectionTextView}>
                <Text
                  style={styles.detailSectionText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {userLocation}
                </Text>
                <TouchableOpacity
                  onPressIn={() => {
                    handleEditPress(EditProfileType.Location);
                  }}
                >
                  <AntDesign
                    name="edit"
                    size={20}
                    color={ThemeColoursPrimary.SecondaryColour}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* loading modal for uploading picture */}
        <ActivityLoader indicator={uploading} text={"Uploading..."} />

        {/* Pop up modal */}
        {isModalVisible && (
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ translateY: slideAnim }] },
            ]}
            {...modalPanResponder.panHandlers}
          >
            <View>
              <Text style={styles.modalTitle}>Edit {editType}</Text>
              {modalBodyDom(editType as EditProfileType)}
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
  detailSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255, 255, 255, 0.2)",
    paddingVertical: 12,
  },
  detailSectionTitle: {
    fontWeight: "bold",
    fontSize: 20,
    color: ThemeColoursPrimary.SecondaryColour,
  },
  detailSectionTextView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailSectionText: {
    color: ThemeColoursPrimary.SecondaryColour,
    fontSize: 20,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    elevation: 10, // For Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: ThemeColoursPrimary.SecondaryColour,
    paddingVertical: 8,
    alignSelf: "center",
  },
  modalDescription: {
    marginVertical: 10,
    fontSize: 16,
    color: ThemeColoursPrimary.SecondaryColour,
  },
  textInputContainer: {
    width: 300,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    paddingLeft: 6,
    marginBottom: 10,
    backgroundColor: ThemeColoursPrimary.BackgroundColour,
    // borderWidth: 2,
  },
  nameTextInput: {
    fontSize: 16,
    color: ThemeColoursPrimary.SecondaryColour,
  },
  saveButton: {
    backgroundColor: ThemeColoursPrimary.LogoColour,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
  },
  saveButtonText: {
    color: ThemeColoursPrimary.PrimaryColour,
    fontSize: 16,
    fontWeight: "bold",
  },
  bioTextInputContainer: {
    width: 300,
    height: 160,
    backgroundColor: ThemeColoursPrimary.BackgroundColour,
    borderRadius: 10,
    paddingLeft: 8,
    paddingTop: 6,
    marginBottom: 10,
  },
  optionPickerContainer: {
    width: Platform.OS === "ios" ? 360 : 320,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    borderRadius: 20,
    paddingHorizontal: 16,
    justifyContent: "center",
    marginBottom: 10,
    borderWidth: 1.2,
  },
  optionPicker: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  optionText: { fontSize: 18, color: ThemeColoursPrimary.SecondaryColour },
  divider: {
    height: 1,
    width: "100%", // Same width as the TouchableOpacity
    backgroundColor: ThemeColoursPrimary.SecondaryColour, // Gray line color
    alignSelf: "center",
    opacity: 0.15,
  },
  ageInputContainer: {
    width: 100,
    height: 50,
    backgroundColor: ThemeColoursPrimary.BackgroundColour,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  ageTextInput: {
    fontSize: 22,
    color: ThemeColoursPrimary.SecondaryColour,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Slight dark overlay
  },
  loadingModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});

export default EditProfile;
