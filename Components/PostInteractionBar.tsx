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
import { ThemeColours, ThemeColoursPrimary } from "../Constants/UI";

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
              color={ThemeColoursPrimary.SecondaryColour}
            />
            <TextInput
              style={styles.input}
              placeholder="Say something..."
              onFocus={handleKeyboardDidShow}
              onBlur={handleKeyboardDidHide}
              placeholderTextColor={ThemeColoursPrimary.SecondaryColour}
            />
          </View>
          {inputActive && (
            <View style={styles.iconContainer}>
              <TouchableOpacity>
                <MaterialIcons
                  name="alternate-email"
                  size={22}
                  color={ThemeColoursPrimary.SecondaryColour}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <Octicons
                  name="smiley"
                  size={20}
                  color={ThemeColoursPrimary.SecondaryColour}
                />
              </TouchableOpacity>
              <TouchableOpacity>
                <FontAwesome
                  name="image"
                  size={20}
                  color={ThemeColoursPrimary.SecondaryColour}
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
                color={ThemeColoursPrimary.SecondaryColour}
              />
            </TouchableOpacity>
            <Text style={{ color: ThemeColoursPrimary.SecondaryColour }}>
              520
            </Text>
          </View>
          <View style={styles.actionWrapper}>
            <TouchableOpacity>
              <AntDesign
                name="staro"
                size={28}
                color={ThemeColoursPrimary.SecondaryColour}
              />
            </TouchableOpacity>
            <Text style={{ color: ThemeColoursPrimary.SecondaryColour }}>
              Fav
            </Text>
          </View>
          <View style={styles.actionWrapper}>
            <TouchableOpacity>
              <Ionicons
                name="chatbubble-ellipses-outline"
                size={28}
                color={ThemeColoursPrimary.SecondaryColour}
              />
            </TouchableOpacity>
            <Text style={{ color: ThemeColoursPrimary.SecondaryColour }}>
              4
            </Text>
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
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -6 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 20,
  },
  searchBar: {
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    borderColor: ThemeColoursPrimary.SecondaryColour,
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
