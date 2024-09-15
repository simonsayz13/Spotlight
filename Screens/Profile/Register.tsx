import React, { useState } from "react";
import { View, Text, StyleSheet, SafeAreaView, TextInput } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity } from "react-native-gesture-handler";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ProfileStackScreens, ThemeColours } from "../../Constants/UI";
import { signUpWithEmail } from "../../Firebase/firebaseAuth";
const Register = ({ navigation }: any) => {
  const [email, setEmail] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const backButton = () => {
    navigation.goBack();
  };
  return (
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
        <AntDesign name="user" size={42} color={ThemeColours.SecondaryColour} />
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
          onPress={() => {
            signUpWithEmail(email, username, password);
            navigation.replace(ProfileStackScreens.Profile);
          }}
        >
          <Text style={styles.registrationButtonText}>Register</Text>
          <AntDesign
            name="arrowright"
            size={30}
            color={ThemeColours.SecondaryColour}
          />
        </TouchableOpacity>
      </View>
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
});

export default Register;
