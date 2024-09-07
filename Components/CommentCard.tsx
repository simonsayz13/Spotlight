import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { TouchableOpacity } from "react-native-gesture-handler";
import Octicons from "@expo/vector-icons/Octicons";

const CommentCard = ({ commentData }: any) => {
  return (
    <View style={styles.container}>
      <View style={styles.userContainer}>
        <Ionicons name="person-circle-outline" size={30} color="black" />
        <Text style={styles.userNameFont}>{commentData.userName}</Text>
        <View style={styles.separatorDot} />
        <Text style={styles.userNameFont}>{commentData.timeStamp}</Text>
      </View>
      <View style={styles.commentContainer}>
        <Text>{commentData.comment}</Text>
      </View>
      <View style={styles.commentActions}>
        <TouchableOpacity style={{ flexDirection: "row", gap: 4 }}>
          <Octicons name="reply" size={20} color="black" />
          <Text>Reply</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", gap: 2 }}>
          <TouchableOpacity>
            <AntDesign name="like2" size={20} color="black" />
          </TouchableOpacity>
          <Text>{commentData.likes}</Text>
        </View>

        <View style={{ flexDirection: "row", gap: 2 }}>
          <TouchableOpacity>
            <AntDesign name="dislike2" size={20} color="black" />
          </TouchableOpacity>
          <Text>{commentData.dislikes}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#D3D3D3",
    gap: 2,
    paddingVertical: 8,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  userNameFont: {
    fontSize: 12,
    fontWeight: "bold",
  },
  timeStampFont: {
    fontSize: 12,
  },
  commentContainer: {
    paddingLeft: 2,
    marginVertical: 6,
  },
  separatorDot: {
    height: 3.5,
    width: 3.5,
    backgroundColor: "black",
    borderRadius: 50,
  },
  commentActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    gap: 10,
  },
});

export default CommentCard;
