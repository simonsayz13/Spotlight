import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Modal,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ProfileStackScreens, ThemeColours } from "../../Constants/UI";
import { signInWithEmail } from "../../Firebase/firebaseAuth";
import {
  AuthErrorCode,
  FireBaseAuthErrorMessages,
} from "../../Constants/errorMessages";
const Login = ({ navigation }: any) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [messageModalVisible, setMessageModalVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const backButton = () => {
    navigation.goBack();
  };

  const handleLogin = async () => {
    setLoading(true);
    const response = await signInWithEmail(email, password);
    setLoading(false);
    if (response.success) {
      navigation.replace(ProfileStackScreens.Profile);
    } else {
      const errorCode = response.errorMessage as AuthErrorCode;
      setErrorMessage(FireBaseAuthErrorMessages[errorCode]);
      setTimeout(() => {
        setMessageModalVisible(true);
      }, 200);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity onPress={backButton}>
          <AntDesign name="arrowleft" size={42} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.titleContainer}>
        <Text style={styles.loginTitle}>Sign in</Text>
        <Text style={styles.loginDescription}>Please login to continue.</Text>
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
          onChangeText={(text) => setEmail(text)}
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
          onChangeText={(text) => setPassword(text)}
          returnKeyType="done"
        />
      </View>

      <View style={styles.loginButtonContainer}>
        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
          <AntDesign
            name="arrowright"
            size={42}
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

      <Modal transparent={true} animationType="fade" visible={loading}>
        <View style={styles.loadingModal}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator
              size="large"
              color={ThemeColours.PrimaryColour}
            />
            <Text>Logging in...</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColours.PrimaryColour,
  },
  backButtonContainer: { marginLeft: 14, marginBottom: "22%", marginTop: 10 },
  titleContainer: {
    marginLeft: 16,
    marginBottom: 10,
  },
  loginTitle: {
    fontSize: 52,
    fontWeight: "bold",
    marginBottom: 8,
    color: ThemeColours.SecondaryColour,
  },
  loginDescription: {
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
  loginButtonContainer: {
    marginHorizontal: 40,
    marginTop: 22,
    alignItems: "flex-end",
  },
  loginButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  loginButtonText: {
    fontWeight: "bold",
    color: ThemeColours.SecondaryColour,
    fontSize: 20,
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

export default Login;
