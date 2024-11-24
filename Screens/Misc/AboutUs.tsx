import React from "react";
import { Linking, Pressable, StyleSheet, Text, View } from "react-native";
import { Image } from "expo-image";
import { ThemeColoursPrimary } from "../../Constants/UI";
import Ionicons from "@expo/vector-icons/Ionicons";
import images from "../../Constants/images";
import { useSafeAreaInsets } from "react-native-safe-area-context";
const AboutUs = (props: any) => {
  const { navigation } = props;
  const insets = useSafeAreaInsets();
  const handleBackButtonPress = () => {
    navigation.toggleDrawer();
  };

  const handleEmailPress = () => {
    Linking.openURL("mailto:support@spotlight.com").catch((err) =>
      console.error("Failed to open email app:", err)
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.topContainer}>
        <Pressable onPress={handleBackButtonPress} style={styles.backButton}>
          <Ionicons
            name="chevron-back"
            size={32}
            color={ThemeColoursPrimary.SecondaryColour}
          />
        </Pressable>
        <Image
          source={images.trademark}
          contentFit="contain"
          style={styles.logo}
        />
      </View>

      {/* Main Content */}
      <View style={styles.content}>
        {/* App Description */}
        <Text style={styles.title}>About Our App</Text>
        <Text style={styles.description}>
          Welcome to Spotlight! Our mission is to connect people and bring them
          closer to the events, places, and people around them. With our app,
          you can share updates, discover new experiences, and stay connected
          with your community.
        </Text>

        {/* Features Section */}
        <Text style={styles.sectionTitle}>Key Features</Text>
        <View style={styles.featureList}>
          <Text style={styles.featureItem}>
            • Discover local events and posts.
          </Text>
          <Text style={styles.featureItem}>
            • Connect and chat with friends.
          </Text>
          <Text style={styles.featureItem}>
            • Share updates and images seamlessly.
          </Text>
          <Text style={styles.featureItem}>
            • Real-time notifications to stay updated.
          </Text>
        </View>

        {/* Contact Information */}
        <Text style={styles.sectionTitle}>Contact Us</Text>
        <Text style={styles.description}>
          For feedback, support, or any inquiries, please contact us at:
        </Text>
        <Pressable onPressIn={handleEmailPress}>
          <Text style={styles.contact}>support@spotlight.com</Text>
        </Pressable>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          © 2024 Spotlight. All rights reserved.
        </Text>
        <Pressable>
          <Text style={styles.footerLink}>Privacy Policy</Text>
        </Pressable>
        <Pressable>
          <Text style={styles.footerLink}>Terms of Service</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  topContainer: {
    paddingHorizontal: 8,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    height: 50,
    zIndex: 100,
  },
  backButton: {
    position: "absolute",
    left: 10,
    zIndex: 10, // Ensure it's on top of other elements
  },
  logo: {
    width: 200,
    height: 50,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: ThemeColoursPrimary.LogoColour,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#555",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: ThemeColoursPrimary.LogoColour,
    marginVertical: 8,
  },
  featureList: {
    marginBottom: 16,
  },
  featureItem: {
    fontSize: 16,
    color: "#555",
    marginBottom: 4,
  },
  contact: {
    fontSize: 16,
    color: "#007AFF",
    marginTop: 8,
    marginBottom: 16,
    alignSelf: "center",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: "#aaa",
    marginBottom: 8,
  },
  footerLink: {
    fontSize: 14,
    color: "#007AFF",
    marginVertical: 4,
  },
});

export default AboutUs;
