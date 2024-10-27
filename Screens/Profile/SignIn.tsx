import { View, Text, ScrollView, Image, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
// import { images } from "../../constants";
import FormField from "../../Components/FormField";
import CustomButton from "../../Components/CustomButton";
import { MainStacks, ThemeColoursPrimary } from "../../Constants/UI";
import ActivityLoader from "../../Components/ActivityLoader";
import { signInWithEmail } from "../../Firebase/firebaseAuth";
import {
  AuthErrorCode,
  FireBaseAuthErrorMessages,
} from "../../Constants/errorMessages";
// import { Link } from "expo-router";

const SignIn = ({ navigation }: any) => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    setIsSubmitting(true);
    const response = await signInWithEmail(form.email, form.password);
    setIsSubmitting(false);
    if (response.success) {
      navigation.replace(MainStacks.MainTab);
    } else {
      const errorCode = response.errorMessage as AuthErrorCode;
      Alert.alert("Error", FireBaseAuthErrorMessages[errorCode]);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <View style={styles.container}>
          {/* <Image
            source={images.logo}
            resizeMode="contain"
            style={styles.logo}
          /> */}
          <Text style={styles.titleText}>Log in to Spotlight</Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles={styles.formFieldMargin}
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles={styles.formFieldMargin}
          />
          <CustomButton
            title="Sign In"
            handlePress={handleLogin}
            containerStyles={styles.buttonMargin}
            isLoading={isSubmitting}
          />
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account?</Text>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </View>
        </View>
        <ActivityLoader indicator={isSubmitting} text={"Logging in"} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: ThemeColoursPrimary.BackgroundColour,
    height: "100%", // 'h-full'
  },
  container: {
    width: "100%",
    justifyContent: "center",
    minHeight: "80%",
    paddingHorizontal: 16,
    marginVertical: 24,
  },
  logo: {
    width: 115,
    height: 35,
  },
  titleText: {
    fontSize: 24, // 'text-2xl'
    fontFamily: "Poppins-SemiBold",
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 40,
  },
  formFieldMargin: {
    marginTop: 28,
  },
  buttonMargin: {
    marginTop: 28,
  },
  footer: {
    justifyContent: "center",
    paddingTop: 20,
    flexDirection: "row",
    gap: 8,
  },
  footerText: {
    fontSize: 18,
    color: "#9CA3AF",
    fontFamily: "Poppins-Regular",
  },
  signUpLink: {
    fontSize: 18, // 'text-lg'
    color: ThemeColoursPrimary.LogoColour,
    fontFamily: "Poppins-SemiBold",
    fontWeight: 900,
  },
});

export default SignIn;
