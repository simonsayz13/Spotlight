import React, { useEffect, useState } from "react";
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
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ProfileStackScreens, ThemeColours } from "../../Constants/UI";
import { signUpWithEmail } from "../../Firebase/firebaseAuth";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import {
  AuthErrorCode,
  FireBaseAuthErrorMessages,
} from "../../Constants/errorMessages";
import { createUserProfile } from "../../Firebase/firebaseFireStore";
const Register = ({ navigation }: any) => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSignUp = async () => {
    setLoading(true);
    const response = await signUpWithEmail(email, username, password);
    setLoading(false);
    if (response.success) {
      navigation.replace(ProfileStackScreens.Profile);
      //@ts-ignore
      await createUserProfile(response.userId, username);
    } else {
      console.log(response.errorMessage);
      const errorCode = response.errorMessage as AuthErrorCode;
      setErrorMessage(FireBaseAuthErrorMessages[errorCode]);
      setTimeout(() => {
        setMessageModalVisible(true);
      }, 200);
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
            <AntDesign name="arrowleft" size={42} color="white" />
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
            color={ThemeColours.SecondaryColour}
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
            color={ThemeColours.SecondaryColour}
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
            color={ThemeColours.SecondaryColour}
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
              color={ThemeColours.SecondaryColour}
            />
          </TouchableOpacity>
        </View>

        <Modal
          transparent={true}
          animationType="fade"
          visible={messageModalVisible}
          onRequestClose={() => {
            setMessageModalVisible(false);
          }}
        >
          <View style={styles.messageModal}>
            <View style={styles.messageModalContent}>
              <Text style={styles.messageModalTitle}>Login Failed</Text>
              <Text style={styles.messageModalMessage}>{errorMessage}</Text>
              <TouchableOpacity
                style={styles.messageModalButton}
                onPress={() => {
                  setMessageModalVisible(false);
                }}
              >
                <Text style={styles.messageModalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal
          transparent={true}
          animationType="fade"
          visible={loading}
          onRequestClose={() => setLoading(false)} // Optional to close the modal
        >
          <View style={styles.modalBackground}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator
                size="large"
                color={ThemeColours.PrimaryColour}
              />
              <Text>Signing up...</Text>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColours.PrimaryColour,
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
    color: ThemeColours.SecondaryColour,
  },
  registrationDescription: {
    fontSize: 16,
    fontWeight: "bold",
    opacity: 0.7,
    color: ThemeColours.SecondaryColour,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 30,
    height: 48,
    borderBottomWidth: 0.4,
    borderBottomColor: ThemeColours.SecondaryColour,
    marginTop: 12,
  },
  textInput: {
    flex: 1,
    paddingLeft: 6,
    color: ThemeColours.SecondaryColour,
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
    color: ThemeColours.SecondaryColour,
    fontSize: 18,
  },
  modalBackground: {
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
  messageModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  messageModalContent: {
    width: "80%",
    paddingVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    paddingHorizontal: 10,
    elevation: 5, // For Android shadow
  },
  messageModalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: ThemeColours.PrimaryColour,
    marginBottom: 10,
  },
  messageModalMessage: {
    fontSize: 16,
    marginBottom: 10,
    color: ThemeColours.PrimaryColour,
  },
  messageModalButton: {
    width: 100,
    backgroundColor: ThemeColours.PrimaryColour,
    padding: 10,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  messageModalButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

export default Register;
