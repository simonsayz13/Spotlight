import React from "react";
import { View, Text, Pressable } from "react-native";
import { ThemeColoursPrimary } from "../Constants/UI";
import Ionicons from "@expo/vector-icons/Ionicons";
const PostAdBar = (props: any) => {
  const { onClickClose } = props;
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: ThemeColoursPrimary.PrimaryColour,
        marginTop: 6,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
        }}
      >
        <View
          style={{
            width: 100,
            height: 100,
            marginVertical: 4,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 4,
            backgroundColor: ThemeColoursPrimary.GoldColour,
          }}
        >
          <Text>广告</Text>
        </View>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>这里广告位</Text>
        </View>
        <Pressable
          style={{ position: "absolute", top: 0, right: 4 }}
          onPress={onClickClose}
        >
          <Ionicons
            name="close"
            size={24}
            color={ThemeColoursPrimary.SecondaryColour}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default PostAdBar;
