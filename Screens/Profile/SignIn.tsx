import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Alert,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { images } from "../../Constants";
import FormField from "../../Components/FormField";
import CustomButton from "../../Components/CustomButton";
import {
  MainStacks,
  ProfileStackScreens,
  ThemeColoursPrimary,
} from "../../Constants/UI";
import ActivityLoader from "../../Components/ActivityLoader";
import { signInWithEmail } from "../../Firebase/firebaseAuth";
import {
  AuthErrorCode,
  FireBaseAuthErrorMessages,
} from "../../Constants/errorMessages";

const SignIn = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({
    email: "simon@gmail.com",
    password: "123456",
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
  const handlePressSignup = async () => {
    setForm({
      email: "",
      password: "",
    });

    requestAnimationFrame(() => {
      navigation.navigate(ProfileStackScreens.SignUp);
    });
  };

  return (
    <View
      style={[
        styles.safeArea,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.safeArea}
      >
        <ScrollView>
          <View style={styles.container}>
            <Image
              source={images.trademark}
              resizeMode="cover"
              style={styles.logo}
            />
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
              autoComplete="off"
            />
            <CustomButton
              title="Sign In"
              handlePress={handleLogin}
              containerStyles={styles.buttonMargin}
              isLoading={isSubmitting}
            />
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account?</Text>
              <Pressable onPress={handlePressSignup}>
                <Text style={styles.signUpLink}>Sign Up</Text>
              </Pressable>
            </View>
          </View>
          <ActivityLoader indicator={isSubmitting} text={"Logging in"} />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
    width: 180,
    height: 70,
    marginLeft: -10,
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
