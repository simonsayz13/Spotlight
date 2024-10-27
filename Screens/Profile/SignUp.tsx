import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
// import { images } from "../../constants";
import FormField from "../../Components/FormField";
import CustomButton from "../../Components/CustomButton";
import { ProfileStackScreens, ThemeColoursPrimary } from "../../Constants/UI";
import ActivityLoader from "../../Components/ActivityLoader";
import { signUpWithEmail } from "../../Firebase/firebaseAuth";
import {
  AuthErrorCode,
  FireBaseAuthErrorMessages,
} from "../../Constants/errorMessages";
import { createUserProfile } from "../../Firebase/firebaseFireStore";

const SignUp = ({ navigation }: any) => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async () => {
    setIsSubmitting(true);
    const response = await signUpWithEmail(
      form.email,
      form.username,
      form.password
    );
    setIsSubmitting(false);

    if (response.success) {
      navigation.replace(ProfileStackScreens.Profile);
      //@ts-ignore
      await createUserProfile(response.userId, form.username);
    } else {
      const errorCode = response.errorMessage as AuthErrorCode;
      Alert.alert("Error", FireBaseAuthErrorMessages[errorCode]);
    }
  };

  const handlePressSignin = async () => {
    // navigation.replace(ProfileStackScreens.SignIn);

    setForm({
      email: "",
      password: "",
      username: "",
    });

    requestAnimationFrame(() => {
      navigation.navigate(ProfileStackScreens.SignIn);
    });
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
          <Text style={styles.titleText}>Sign up to Spotlight</Text>
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={(e) => setForm({ ...form, username: e })}
            otherStyles={styles.formFieldMargin}
          />
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
            autoComplete="off"
          />
          <CustomButton
            title="Sign Up"
            handlePress={handleSignUp}
            containerStyles={styles.buttonMargin}
            isLoading={isSubmitting}
          />
          <View style={styles.footer}>
            <Text style={styles.footerText}>Have an account already??</Text>
            <Pressable onPress={handlePressSignin}>
              <Text style={styles.signUpLink}>Sign In</Text>
            </Pressable>
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

export default SignUp;
