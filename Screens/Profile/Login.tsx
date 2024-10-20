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
  Alert,
} from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import {
  MainStacks,
  ProfileStackScreens,
  ThemeColours,
  ThemeColoursPrimary,
} from "../../Constants/UI";
import { signInWithEmail } from "../../Firebase/firebaseAuth";
import {
  AuthErrorCode,
  FireBaseAuthErrorMessages,
} from "../../Constants/errorMessages";
import ActivityLoader from "../../Components/ActivityLoader";
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
      navigation.replace(MainStacks.MainTab);
    } else {
      const errorCode = response.errorMessage as AuthErrorCode;
      Alert.alert("Error", FireBaseAuthErrorMessages[errorCode]);
    }
  };

  return (
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
        <Text style={styles.loginTitle}>Sign in</Text>
        <Text style={styles.loginDescription}>Please login to continue.</Text>
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
          onChangeText={(text) => setEmail(text)}
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
            color={ThemeColoursPrimary.SecondaryColour}
          />
        </TouchableOpacity>
      </View>
      <ActivityLoader indicator={loading} text={"Logging in"} />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
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
    color: ThemeColoursPrimary.SecondaryColour,
  },
  loginDescription: {
    fontSize: 16,
    fontWeight: "bold",
    opacity: 0.6,
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
    color: ThemeColoursPrimary.SecondaryColour,
    fontSize: 20,
  },
});

export default Login;
