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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { images } from "../../Constants";
import FormField from "../../Components/FormField";
import CustomButton from "../../Components/CustomButton";
import {
  MainStacks,
  NavigationTabs,
  ProfileStackScreens,
  ThemeColoursPrimary,
} from "../../Constants/UI";
import ActivityLoader from "../../Components/ActivityLoader";
import { signUpWithEmail } from "../../Firebase/firebaseAuth";
import {
  AuthErrorCode,
  FireBaseAuthErrorMessages,
} from "../../Constants/errorMessages";
import { createUserProfile } from "../../Firebase/firebaseFireStore";
import { CommonActions } from "@react-navigation/native";

const SignUp = ({ navigation }: any) => {
  const insets = useSafeAreaInsets();
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignUp = async () => {
    setIsSubmitting(true);
    console.log(form);
    const response = await signUpWithEmail(
      form.email,
      form.username,
      form.password
    );
    setIsSubmitting(false);

    if (response.success) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [
            {
              name: MainStacks.MainTab, // Parent navigator
              state: {
                routes: [
                  {
                    name: NavigationTabs.Home, // Nested screen
                  },
                ],
              },
            },
          ],
        })
      );

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
    <View
      style={[
        styles.safeArea,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}
    >
      <ScrollView>
        <View style={styles.container}>
          <Image
            source={images.trademark}
            resizeMode="cover"
            style={styles.logo}
          />
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

export default SignUp;
