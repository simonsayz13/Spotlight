import { useState } from "react";
import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { icons } from "../Constants";

const FormField = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  ...props
}: any) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View style={[styles.container, otherStyles]}>
      <Text style={styles.titleText}>{title}</Text>
      <View style={[styles.inputContainer, isFocused && styles.focusBorder]}>
        <TextInput
          style={[styles.textInput]}
          placeholderTextColor={styles.placeholderTextColor}
          value={value}
          placeholder={placeholder}
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          onFocus={() => {
            setIsFocused(true);
          }}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  titleText: {
    fontSize: 16,
    color: "#374151",
    fontFamily: "Poppins-Medium",
  },
  inputContainer: {
    width: "100%",
    height: 64,
    marginTop: 10,
    paddingHorizontal: 16,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#d8dce3",
    flexDirection: "row",
    alignItems: "center",
  },
  textInput: {
    flex: 1,
    color: "#374151",
    fontFamily: "Poppins-SemiBold",
    fontSize: 16,
  },
  placeholderTextColor: { color: "#7B7B8B" },
  icon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  focusBorder: {
    borderColor: "#3B82F6",
  },
});

export default FormField;
