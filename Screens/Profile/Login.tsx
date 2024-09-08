import React from "react";
import { View, Text, StyleSheet, SafeAreaView, TextInput } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { TouchableOpacity } from "react-native-gesture-handler";
import AntDesign from "@expo/vector-icons/AntDesign";
const Login = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.loginTitle}>Login</Text>
        <Text style={styles.loginDescription}>Please sign in to continue.</Text>
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="email" size={42} color="#ffffff" />
        <TextInput
          style={styles.textInput}
          placeholder="Email"
          placeholderTextColor="#d3d3d3"
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="password" size={42} color="#ffffff" />
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
          <AntDesign name="arrowright" size={30} color="#ffffff" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ef6e6e",
    justifyContent: "center",
    // alignItems: "center",
    // paddingHorizontal: 50,
  },
  titleContainer: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
  loginTitle: {
    fontSize: 60,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#ffffff",
  },
  loginDescription: {
    fontSize: 18,
    fontWeight: "bold",
    opacity: 0.7,
    color: "#ffffff",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 40,
    height: 48,
    borderBottomWidth: 0.4,
    borderBottomColor: "#ffffff",
    // borderWidth: 2,
    marginTop: 12,
  },
  textInput: {
    flex: 1,
    paddingLeft: 6,
    color: "#ffffff",
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
  loginButtonText: { fontWeight: "bold", color: "#ffffff", fontSize: 18 },
});
export default Login;
