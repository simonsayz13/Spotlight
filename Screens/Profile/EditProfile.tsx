import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  SafeAreaView,
  Image,
  Platform,
  ScrollView,
  Animated,
  PanResponder,
  KeyboardAvoidingView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { EditProfileType, Gender, ThemeColours } from "../../Constants/UI";
import { useSelector } from "react-redux";
import AntDesign from "@expo/vector-icons/AntDesign";
import { RootState } from "../../Redux/store";
import { mockUserBio } from "../../Constants/mockData";
import { TextInput } from "react-native-gesture-handler";

const EditProfile = ({ navigation }: any) => {
  const { userDisplayName } = useSelector((state: RootState) => state.user);
  const slideAnim = useRef(new Animated.Value(400)).current;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editType, setEditType] = useState<string>("");
  const [selectedGender, setSelectedGender] = useState<Gender>(Gender.Male);
  const handleEditPress = (editType: string) => {
    setEditType(editType);
    setIsModalVisible(true);
    showModal();
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

  const modalBodyDom = (type: EditProfileType) => {
    if (type === EditProfileType.Name) {
      return (
        <View style={{ alignItems: "center" }}>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.nameTextInput}
              placeholder={userDisplayName!}
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={hideModal}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (type === EditProfileType.Bio) {
      return (
        <View style={{ alignItems: "center" }}>
          <View style={styles.bioTextInputContainer}>
            <TextInput style={styles.nameTextInput} multiline={true}>
              {mockUserBio}
            </TextInput>
          </View>
          <TouchableOpacity style={styles.saveButton}>
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
              onPress={() => setSelectedGender(Gender.Male)}
            >
              <Text style={styles.optionText}>Male</Text>
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
              onPress={() => setSelectedGender(Gender.Female)}
            >
              <Text style={styles.optionText}>Female</Text>
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
              onPress={() => setSelectedGender(Gender.Other)}
            >
              <Text style={styles.optionText}>Other</Text>
              {selectedGender === Gender.Other && (
                <AntDesign
                  name="check"
                  size={26}
                  color={ThemeColours.PrimaryColour}
                />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.saveButton}>
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
              placeholder="29"
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={hideModal}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (type === EditProfileType.Location) {
      return (
        <View style={{ alignItems: "center" }}>
          <View style={styles.textInputContainer}>
            <TextInput style={styles.nameTextInput} placeholder="Liverpool" />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={hideModal}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      );
    } else if (type === EditProfileType.Education) {
      return (
        <View style={{ alignItems: "center" }}>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.nameTextInput}
              placeholder="Unversity of Liverpool"
            />
          </View>
          <TouchableOpacity style={styles.saveButton} onPress={hideModal}>
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
          <TouchableOpacity onPress={goBack} style={styles.backButton}>
            <Ionicons
              name="chevron-back"
              size={32}
              color={ThemeColours.SecondaryColour}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={styles.placeholder} />
        </View>
        <ScrollView style={styles.scrollView}>
          <View style={styles.detailsView}>
            <View style={styles.imageSection}>
              <View style={styles.imageContainer}>
                <Image
                  source={require("../../assets/test_image/mock_profile_picture.png")}
                  style={styles.image}
                  resizeMode="contain"
                />
                <TouchableOpacity style={styles.iconContainer}>
                  <Ionicons name="camera-sharp" size={18} color="black" />
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
                  onPress={() => {
                    handleEditPress(EditProfileType.Name);
                  }}
                >
                  <AntDesign
                    name="edit"
                    size={20}
                    color={ThemeColours.SecondaryColour}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>
                {EditProfileType.Bio}
              </Text>
              <View style={styles.detailSectionTextView}>
                <Text
                  style={[styles.detailSectionText, { width: 260 }]}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {mockUserBio}
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    handleEditPress(EditProfileType.Bio);
                  }}
                >
                  <AntDesign
                    name="edit"
                    size={20}
                    color={ThemeColours.SecondaryColour}
                  />
                </TouchableOpacity>
              </View>
            </View>
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
                  Male
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    handleEditPress(EditProfileType.Gender);
                  }}
                >
                  <AntDesign
                    name="edit"
                    size={20}
                    color={ThemeColours.SecondaryColour}
                  />
                </TouchableOpacity>
              </View>
            </View>
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
                  29
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    handleEditPress(EditProfileType.Age);
                  }}
                >
                  <AntDesign
                    name="edit"
                    size={20}
                    color={ThemeColours.SecondaryColour}
                  />
                </TouchableOpacity>
              </View>
            </View>
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
                  Liverpool
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    handleEditPress(EditProfileType.Location);
                  }}
                >
                  <AntDesign
                    name="edit"
                    size={20}
                    color={ThemeColours.SecondaryColour}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>
                {EditProfileType.Education}
              </Text>
              <View style={styles.detailSectionTextView}>
                <Text
                  style={styles.detailSectionText}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  Unviersity of Liverpool
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    handleEditPress(EditProfileType.Education);
                  }}
                >
                  <AntDesign
                    name="edit"
                    size={20}
                    color={ThemeColours.SecondaryColour}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* Pop up modal */}
        {isModalVisible && (
          <Animated.View
            style={[
              styles.modalContainer,
              { transform: [{ translateY: slideAnim }] },
            ]}
            {...modalPanResponder.panHandlers}
          >
            <View style={styles.modalContent}>
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
    backgroundColor: ThemeColours.PrimaryColour,
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
    color: ThemeColours.SecondaryColour,
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
  image: {
    width: 100, // Width and height should be the same
    height: 100,
    borderRadius: 50, // Half of the width or height for a perfect circle
  },
  imageContainer: {
    position: "relative", // To position the icon inside
  },
  iconContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
    justifyContent: "center",
    backgroundColor: ThemeColours.SecondaryColour,
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
    color: ThemeColours.SecondaryColour,
  },
  detailSectionTextView: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  detailSectionText: {
    color: ThemeColours.SecondaryColour,
    fontSize: 20,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: ThemeColours.PrimaryColour,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    elevation: 10, // For Android shadow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    height: 300,
  },
  modalContent: {
    // alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: ThemeColours.SecondaryColour,
    paddingVertical: 8,
    alignSelf: "center",
  },
  modalDescription: {
    marginVertical: 10,
    fontSize: 16,
    color: ThemeColours.SecondaryColour,
  },
  textInputContainer: {
    width: 300,
    height: 50,
    backgroundColor: ThemeColours.SecondaryColour,
    borderRadius: 10,
    justifyContent: "center",
    paddingLeft: 6,
    marginBottom: 10,
  },
  nameTextInput: {
    fontSize: 16,
    color: ThemeColours.PrimaryColour,
  },
  saveButton: {
    backgroundColor: ThemeColours.SecondaryColour,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    padding: 10,
  },
  saveButtonText: {
    color: ThemeColours.PrimaryColour,
    fontSize: 16,
    fontWeight: "bold",
  },
  bioTextInputContainer: {
    width: 300,
    height: 160,
    backgroundColor: ThemeColours.SecondaryColour,
    borderRadius: 10,
    paddingLeft: 8,
    paddingTop: 6,
    marginBottom: 10,
  },
  optionPickerContainer: {
    width: 360,
    backgroundColor: ThemeColours.SecondaryColour,
    borderRadius: 8,
    paddingHorizontal: 16,
    justifyContent: "center",
    marginBottom: 10,
  },
  optionPicker: {
    height: 30,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 6,
  },
  optionText: { fontSize: 18, color: ThemeColours.PrimaryColour },
  divider: {
    height: 1,
    width: "100%", // Same width as the TouchableOpacity
    backgroundColor: ThemeColours.PrimaryColour, // Gray line color
    alignSelf: "center",
    opacity: 0.2,
  },
  ageInputContainer: {
    width: 100,
    height: 50,
    backgroundColor: ThemeColours.SecondaryColour,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  ageTextInput: {
    fontSize: 22,
    color: ThemeColours.PrimaryColour,
  },
});

export default EditProfile;
