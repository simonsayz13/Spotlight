import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Animated,
  Dimensions,
  Platform,
  TouchableOpacity,
} from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Octicons from "@expo/vector-icons/Octicons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemeColours } from "../Constants/UI";

const screenWidth = Dimensions.get("window").width;
const PostInteractionBar = () => {
  const [inputWidth] = useState(new Animated.Value(185));
  const [inputActive, setInputActive] = useState(false);

  const handleKeyboardDidShow = () => {
    setInputActive(true);
    Animated.timing(inputWidth, {
      toValue: screenWidth - 16, // Full width when the keyboard is open (adjust based on screen size)
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleKeyboardDidHide = () => {
    Animated.timing(inputWidth, {
      toValue: 185, // Initial width when the keyboard is closed
      duration: 300,
      useNativeDriver: false,
    }).start();
    setInputActive(false);
  };

  return (
    <View style={styles.container}>
      <View>
        <Animated.View style={[styles.searchBar, { width: inputWidth }]}>
          <View style={styles.commentStyle}>
            <FontAwesome
              name="pencil-square-o"
              size={20}
              color={ThemeColours.PrimaryColour}
            />
            <TextInput
              style={styles.input}
              placeholder="Say something..."
              onFocus={handleKeyboardDidShow}
              onBlur={handleKeyboardDidHide}
              placeholderTextColor={ThemeColours.PrimaryColour}
            />
          </View>
          {inputActive && (
            <View style={styles.iconContainer}>
              <TouchableOpacity>
                <MaterialIcons
                  name="alternate-email"
                  size={22}
                  color={ThemeColours.PrimaryColour}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Octicons
                  name="smiley"
                  size={20}
                  color={ThemeColours.PrimaryColour}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesome
                  name="image"
                  size={20}
                  color={ThemeColours.PrimaryColour}
                />
              </TouchableOpacity>
            </View>
          )}
        </Animated.View>
      </View>
      {!inputActive && (
        <View style={styles.actionsContainer}>
          <View style={styles.actionWrapper}>
            <TouchableOpacity>
              <AntDesign
                name="hearto"
                size={28}
                color={ThemeColours.ThirdColour}
              />
            </TouchableOpacity>
            <Text style={{ color: ThemeColours.ThirdColour }}>520</Text>
          </View>
          <View style={styles.actionWrapper}>
            <TouchableOpacity>
              <AntDesign
                name="staro"
                size={28}
                color={ThemeColours.ThirdColour}
              />
            </TouchableOpacity>
            <Text style={{ color: ThemeColours.ThirdColour }}>Col</Text>
          </View>
          <View style={styles.actionWrapper}>
            <TouchableOpacity>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={28}
                color={ThemeColours.ThirdColour}
              />
            </TouchableOpacity>
            <Text style={{ color: ThemeColours.ThirdColour }}>4</Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: Platform.OS === "ios" ? 14 : 8,
    backgroundColor: ThemeColours.PrimaryColour,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    // Elevation for Android
    elevation: 4,
  },
  searchBar: {
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    borderColor: ThemeColours.PrimaryColour,
    borderWidth: 1.2,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    height: 40,
    marginVertical: 6,
    justifyContent: "space-between",
  },
  input: {
    height: 20,
    marginLeft: 4,
    fontSize: 16,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: Platform.OS === "ios" ? 10 : 4,
  },
  actionWrapper: {
    alignItems: "center",
    flexDirection: "row",
    gap: 1,
  },
  commentStyle: { flexDirection: "row" },
  iconContainer: {
    flexDirection: "row",
    paddingRight: 10,
    gap: 10,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default PostInteractionBar;
