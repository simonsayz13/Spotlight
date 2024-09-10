import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TextInput } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity } from "react-native-gesture-handler";
import AntDesign from "@expo/vector-icons/AntDesign";
import { ThemeColours } from "../../Constants/UI";
const Login = ({ navigation }: any) => {
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
        />
      </View>

      <View style={styles.loginButtonContainer}>
        <TouchableOpacity style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Login</Text>
          <AntDesign
            name="arrowright"
            size={42}
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
});

export default Login;
