import { Button, SafeAreaView, StyleSheet, Text, View } from "react-native";
import HexagonIcon from "../../Components/Logo";
import Logo from "../../Components/Logo";
import { TouchableOpacity } from "react-native-gesture-handler";
import { ProfileStackScreens } from "../../Constants/UI";

const ProfileScreen = ({ navigation }: any) => {
  const onClickLogin = () => {
    navigation.navigate(ProfileStackScreens.Login);
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
        <TouchableOpacity style={styles.signInButton}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ef6e6e",
  },
  logoContainer: {
    height: "65%",
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    backgroundColor: "#fff", // Background color for the text container
    paddingHorizontal: 16, // Padding around the text
    paddingVertical: 8, // Padding around the text
    borderRadius: 20, // Rounded corners
  },
  logoText: {
    fontWeight: "bold",
    fontSize: 66,
    color: "#ef6e6e", // Same color as background
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
    backgroundColor: "#ffffff",
    borderRadius: 30,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ef6e6e",
  },
});

export { ProfileScreen };
