import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import {
  ProfileStackScreens,
  ThemeColours,
  ThemeColoursPrimary,
} from "../../Constants/UI";

const LoginSignUpScreen = ({ navigation }: any) => {
  const onClickLogin = () => {
    navigation.navigate(ProfileStackScreens.Login);
  };
  const onClickRegister = () => {
    navigation.navigate(ProfileStackScreens.Register);
  };
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.logoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.logoText}>Linkify</Text>
        </View>
      </View>
      <View style={styles.bottomView}>
        <TouchableOpacity style={styles.signInButton} onPress={onClickLogin}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.signInButton} onPress={onClickRegister}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  logoContainer: {
    height: "65%",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    backgroundColor: ThemeColoursPrimary.LogoColour, // Background color for the text container
    paddingHorizontal: 16, // Padding around the text
    paddingVertical: 8, // Padding around the text
    borderRadius: 18, // Rounded corners
  },
  logoText: {
    fontWeight: "bold",
    fontSize: 66,
    color: ThemeColoursPrimary.PrimaryColour, // Same color as background
    padding: 20,
  },
  bottomView: {
    flex: 1,
    alignItems: "center",
    gap: 20,
  },
  signInButton: {
    width: 240,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ThemeColoursPrimary.LogoColour,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: ThemeColoursPrimary.PrimaryColour,
  },
});

export { LoginSignUpScreen };
