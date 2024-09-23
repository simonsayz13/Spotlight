import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Modal,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  ProfileStackScreens,
  ThemeColours,
  ThemeColoursPrimary,
} from "../../Constants/UI";
import { signUpWithEmail } from "../../Firebase/firebaseAuth";
import {
  AuthErrorCode,
  FireBaseAuthErrorMessages,
} from "../../Constants/errorMessages";
import { createUserProfile } from "../../Firebase/firebaseFireStore";
import ActivityLoader from "../../Components/ActivityLoader";
const Register = ({ navigation }: any) => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const handleSignUp = async () => {
    setLoading(true);
    const response = await signUpWithEmail(email, username, password);
    setLoading(false);
    if (response.success) {
      navigation.replace(ProfileStackScreens.Profile);
      //@ts-ignore
      await createUserProfile(response.userId, username);
    } else {
      const errorCode = response.errorMessage as AuthErrorCode;
      Alert.alert("Error", FireBaseAuthErrorMessages[errorCode]);
    }
  };

  const backButton = () => {
    navigation.goBack();
  };
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.backButtonContainer}>
          <TouchableOpacity onPress={backButton}>
            <AntDesign
              name="arrowleft"
              size={42}
              color={ThemeColoursPrimary.SecondaryColour}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.registrationTitle}>Sign up</Text>
          <Text style={styles.registrationDescription}>
            Fill in the details below to create your account.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons
            name="email"
            size={42}
            color={ThemeColoursPrimary.SecondaryColour}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Email"
            placeholderTextColor="#d3d3d3"
            onChangeText={(text: string) => setEmail(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <AntDesign
            name="user"
            size={42}
            color={ThemeColoursPrimary.SecondaryColour}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Username"
            placeholderTextColor="#d3d3d3"
            onChangeText={(text: string) => setUsername(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons
            name="password"
            size={42}
            color={ThemeColoursPrimary.SecondaryColour}
          />
          <TextInput
            style={styles.textInput}
            placeholder="Password"
            placeholderTextColor="#d3d3d3"
            secureTextEntry={true}
            returnKeyType="done"
            onChangeText={(text: string) => setPassword(text)}
          />
        </View>

        <View style={styles.registrationButtonContainer}>
          <TouchableOpacity
            style={styles.registrationButton}
            onPress={handleSignUp}
          >
            <Text style={styles.registrationButtonText}>Register</Text>
            <AntDesign
              name="arrowright"
              size={30}
              color={ThemeColoursPrimary.SecondaryColour}
            />
          </TouchableOpacity>
        </View>
        <ActivityLoader indicator={loading} text={"Signing up..."} />
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  backButtonContainer: { marginLeft: 14, marginBottom: "22%", marginTop: 10 },
  titleContainer: {
    marginHorizontal: 16,
    marginBottom: 10,
  },
  registrationTitle: {
    fontSize: 52,
    fontWeight: "bold",
    marginBottom: 8,
    color: ThemeColoursPrimary.SecondaryColour,
  },
  registrationDescription: {
    fontSize: 16,
    fontWeight: "bold",
    opacity: 0.7,
    color: ThemeColoursPrimary.SecondaryColour,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 30,
    height: 48,
    borderBottomWidth: 0.4,
    borderBottomColor: ThemeColoursPrimary.SecondaryColour,
    marginTop: 12,
  },
  textInput: {
    flex: 1,
    paddingLeft: 6,
    color: ThemeColoursPrimary.SecondaryColour,
    fontSize: 18,
  },
  registrationButtonContainer: {
    marginHorizontal: 40,
    marginTop: 22,
    alignItems: "flex-end",
  },
  registrationButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  registrationButtonText: {
    fontWeight: "bold",
    color: ThemeColoursPrimary.SecondaryColour,
    fontSize: 18,
  },
});

export default Register;
