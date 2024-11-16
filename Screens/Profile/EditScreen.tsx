import React, { useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  Platform,
  TextInput,
  Alert,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  EditProfileType,
  EditProfileTypeMap,
  Gender,
  ThemeColoursPrimary,
} from "../../Constants/UI";
import { updateProfileField } from "../../Firebase/firebaseFireStore";
import store, { RootState } from "../../Redux/store";
import {
  updateAge,
  updateBio,
  updateDisplayName,
  updateGender,
  updateLocation,
} from "../../Redux/Slices/userSlice";
import { useSelector } from "react-redux";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EditScreen = ({ navigation, route }: any) => {
  const { userId, userAge, userBio, userLocation }: any = useSelector(
    (state: RootState) => state.user
  );
  const { itemName, itemData } = route.params;
  const [fieldValue, setFieldValue] = useState(itemData);
  const insets = useSafeAreaInsets();

  const goBack = () => {
    navigation.goBack();
  };

  const fieldUpdateActions = {
    [EditProfileType.Name]: updateDisplayName,
    [EditProfileType.Bio]: updateBio,
    [EditProfileType.Gender]: updateGender,
    [EditProfileType.Age]: updateAge,
    [EditProfileType.Location]: updateLocation,
  };

  const handleSaveField = async (fieldName: EditProfileType, value: any) => {
    try {
      // Update the field in Firestore
      await updateProfileField(userId, {
        [EditProfileTypeMap[fieldName]]: value,
      });

      //Update Redux
      const action = fieldUpdateActions[fieldName];
      store.dispatch(action(value));

      // Go back
      goBack();
    } catch (error: any) {
      Alert.alert(`Failed to save ${fieldName}:`, error);
    }
  };

  const editContent = (type: EditProfileType) => {
    switch (type) {
      case EditProfileType.Name:
        return (
          <View style={{ alignItems: "center" }}>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.nameTextInput}
                value={fieldValue}
                onChangeText={(text) => setFieldValue(text)}
              />
            </View>
          </View>
        );
      case EditProfileType.Bio:
        return (
          <View style={{ alignItems: "center" }}>
            <View style={styles.bioTextInputContainer}>
              <TextInput
                style={styles.nameTextInput}
                multiline={true}
                onChangeText={(text) => setFieldValue(text)}
              >
                {userBio}
              </TextInput>
            </View>
          </View>
        );
      case EditProfileType.Gender:
        return (
          <View style={{ alignItems: "center" }}>
            <View style={styles.optionPickerContainer}>
              <TouchableOpacity
                style={styles.optionPicker}
                activeOpacity={1}
                onPressIn={() => {
                  setFieldValue(Gender.Male);
                }}
              >
                <Text style={styles.optionText}>{Gender.Male}</Text>
                {fieldValue === Gender.Male && (
                  <AntDesign
                    name="check"
                    size={24}
                    color={ThemeColoursPrimary.LogoColour}
                  />
                )}
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.optionPicker}
                activeOpacity={1}
                onPressIn={() => setFieldValue(Gender.Female)}
              >
                <Text style={styles.optionText}>{Gender.Female}</Text>
                {fieldValue === Gender.Female && (
                  <AntDesign
                    name="check"
                    size={26}
                    color={ThemeColoursPrimary.LogoColour}
                  />
                )}
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity
                style={styles.optionPicker}
                activeOpacity={1}
                onPressIn={() => setFieldValue(Gender.Other)}
              >
                <Text style={styles.optionText}>{Gender.Other}</Text>
                {fieldValue === Gender.Other && (
                  <AntDesign
                    name="check"
                    size={26}
                    color={ThemeColoursPrimary.LogoColour}
                  />
                )}
              </TouchableOpacity>
            </View>
          </View>
        );
      case EditProfileType.Age:
        return (
          <View style={{ alignItems: "center" }}>
            <View style={styles.ageInputContainer}>
              <TextInput
                style={styles.ageTextInput}
                keyboardType="numeric"
                onChangeText={(text) => setFieldValue(Number(text))}
              >
                {userAge}
              </TextInput>
            </View>
          </View>
        );
      case EditProfileType.Location:
        return (
          <View style={{ alignItems: "center" }}>
            <View style={styles.textInputContainer}>
              <TextInput
                style={styles.nameTextInput}
                onChangeText={(text) => setFieldValue(text)}
              >
                {userLocation}
              </TextInput>
            </View>
          </View>
        );
      default:
        return <></>;
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topBarContainer}>
        <TouchableOpacity onPressIn={goBack} style={styles.backButton}>
          <Ionicons
            name="chevron-back"
            size={32}
            color={ThemeColoursPrimary.SecondaryColour}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Edit {itemName}</Text>
        <TouchableOpacity
          style={styles.saveButton}
          onPressIn={() => {
            handleSaveField(itemName, fieldValue);
          }}
        >
          <Text style={styles.saveButtonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.bodyContainer}>{editContent(itemName)}</View>
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
    width: 64, // same width as the icon
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: ThemeColoursPrimary.SecondaryColour,
  },
  saveButton: {
    paddingHorizontal: 8,
    backgroundColor: ThemeColoursPrimary.LogoColour,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    height: 32,
    marginRight: 8,
  },
  saveButtonText: {
    color: ThemeColoursPrimary.PrimaryColour,
    fontSize: 16,
    fontWeight: "bold",
  },
  bodyContainer: {
    marginTop: 14,
  },
  detailSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  textInputContainer: {
    width: 300,
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    paddingLeft: 6,
    marginBottom: 10,
    backgroundColor: ThemeColoursPrimary.BackgroundColour,
  },
  nameTextInput: {
    fontSize: 16,
    color: ThemeColoursPrimary.SecondaryColour,
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
    borderWidth: 1,
  },
  optionPicker: {
    height: 40,
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
});

export default EditScreen;
