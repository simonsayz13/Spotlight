import React, { memo, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Switch,
  Platform,
} from "react-native";
import {
  MiscStackScreens,
  PostStackScreens,
  ThemeColoursPrimary,
} from "../../Constants/UI";
import Ionicons from "@expo/vector-icons/Ionicons";
import { uploadImage } from "../../Firebase/firebaseStorage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { createPost } from "../../Firebase/firebaseFireStore";
import ActivityLoader from "../../Components/ActivityLoader";
import BottomSheet from "../../Components/BottomSheet";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
const { width, height } = Dimensions.get("window");

const ImagePreviewDOM = memo(({ photoURI }: any) => {
  return (
    <View style={styles.imagePreviewContainer}>
      <Image source={{ uri: photoURI }} style={styles.imageView} />
      <TouchableOpacity style={styles.addImageContainer}>
        <Ionicons name="add" size={42} color="black" />
      </TouchableOpacity>
    </View>
  );
});

const CreatePost = ({ navigation, route }: any) => {
  const photoURI = route.params?.photoURI;
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const { userId } = useSelector((state: RootState) => state.user);
  const [posting, setPosting] = useState<boolean>(false);
  const [isComment, setIsComment] = useState<boolean>(false);
  const [isLocation, setIsLocation] = useState<boolean>(false);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const goBack = () => {
    navigation.setParams({ photoURI: undefined });
    setDescription("");
    setTitle("");
    navigation.goBack();
  };

  const goToCamera = () => {
    navigation.navigate(PostStackScreens.Camera);
  };

  const goToPhotoBrowser = () => {
    navigation.navigate(MiscStackScreens.PhotoBrowser);
  };

  const post = async () => {
    if (!userId) {
      return Alert.alert("Not Signed in", "Please sign in to make a post");
    }
    setPosting(true);
    const imageURL = await uploadImage(photoURI);
    const timeStamp = new Date().toISOString();
    const postData = {
      media: [
        {
          type: "image",
          media_url: imageURL,
          width: 800,
          height: 600,
        },
      ],
      timeStamp,
      title,
      description,
      likes: 0,
      dislikes: 0,
      favourites: 0,
      comments: [],
      location: "Liverpool",
    };
    await createPost(userId!, postData);
    navigation.setParams({ photoURI: undefined });
    setDescription("");
    setTitle("");
    setPosting(false);
    navigation.navigate("Me");
  };

  const menuBar = (
    <View style={styles.menuBarContainer}>
      <TouchableOpacity onPressIn={goToCamera}>
        <MaterialCommunityIcons name="camera" size={34} color="black" />
      </TouchableOpacity>
      <TouchableOpacity onPressIn={goToPhotoBrowser}>
        <MaterialCommunityIcons name="image-plus" size={34} color="black" />
      </TouchableOpacity>
      <TouchableOpacity>
        <FontAwesome6 name="hashtag" size={30} color="black" />
      </TouchableOpacity>
    </View>
  );

  const togglePrivateSwitch = () =>
    setIsPrivate((previousState) => !previousState);
  const toggleCommentSwitch = () =>
    setIsComment((previousState) => !previousState);
  const toggleLocationSwitch = () =>
    setIsLocation((previousState) => !previousState);

  const options = (
    <View>
      <View style={styles.optionsItemContainer}>
        <View>
          <Text style={styles.optionsTitle}>Private</Text>
          <Text style={styles.optionsDescription}>
            Only you can see this post
          </Text>
        </View>
        <Switch
          onValueChange={togglePrivateSwitch}
          value={isPrivate}
          trackColor={{ true: ThemeColoursPrimary.LogoColour }}
          thumbColor={ThemeColoursPrimary.PrimaryColour}
        />
      </View>
      <View style={styles.optionsItemContainer}>
        <View>
          <Text style={styles.optionsTitle}>Comment</Text>
          <Text style={styles.optionsDescription}>
            Allow others to comment on your post
          </Text>
        </View>
        <Switch
          onValueChange={toggleCommentSwitch}
          value={isComment}
          trackColor={{ true: ThemeColoursPrimary.LogoColour }}
          thumbColor={ThemeColoursPrimary.PrimaryColour}
        />
      </View>
      <View style={styles.optionsItemContainer}>
        <View>
          <Text style={styles.optionsTitle}>Location</Text>
          <Text style={styles.optionsDescription}>
            Allow others to see where you posted from
          </Text>
        </View>
        <Switch
          onValueChange={toggleLocationSwitch}
          value={isLocation}
          trackColor={{ true: ThemeColoursPrimary.LogoColour }}
          thumbColor={ThemeColoursPrimary.PrimaryColour}
        />
      </View>
    </View>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.topBarContainer}>
          <TouchableOpacity onPressIn={goBack} style={styles.closeButton}>
            <Ionicons
              name="close"
              size={32}
              color={ThemeColoursPrimary.SecondaryColour}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Create a post</Text>
          <TouchableOpacity style={styles.postButton} onPressIn={post}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
        {photoURI && <ImagePreviewDOM photoURI={photoURI} />}

        <View style={styles.titleInputContainer}>
          <TextInput
            style={styles.titleTextInput}
            placeholder="Add a title..."
            onChangeText={(text) => {
              setTitle(text);
            }}
          >
            {title}
          </TextInput>
        </View>
        <View style={styles.divider}></View>
        <View>
          <View style={styles.descriptionInputContainer}>
            <TextInput
              style={styles.descriptionTextInput}
              placeholder="Add a description..."
              multiline={true}
              onChangeText={(text) => {
                setDescription(text);
              }}
            >
              {description}
            </TextInput>
          </View>
        </View>
        <ActivityLoader indicator={posting} text={"Posting..."} />
        <BottomSheet menuBar={menuBar}>{options}</BottomSheet>
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  topBarContainer: {
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
    borderBottomWidth: 0.4,
    borderBottomColor: ThemeColoursPrimary.SecondaryColour + "40",
  },
  closeButton: {
    width: 32,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: ThemeColoursPrimary.SecondaryColour,
  },
  postButton: {
    width: 60,
    backgroundColor: ThemeColoursPrimary.ThirdColour,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    height: 34,
  },
  postButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: ThemeColoursPrimary.PrimaryColour,
  },
  SectionTitle: {
    fontSize: 20,
    color: ThemeColoursPrimary.GreyColour,
  },
  titleInputContainer: {
    width: width * 0.95,
    gap: 10,
    borderRadius: 8,
    paddingVertical: 10,
  },
  titleTextInput: {
    height: 40,
    fontSize: 20,
  },
  descriptionInputContainer: {
    marginTop: 10,
    width: width * 0.95,
    height: height * 0.6,
    borderRadius: 8,
    paddingVertical: 10,
  },
  descriptionTextInput: {
    fontSize: 20,
  },
  divider: {
    width: width * 0.95,
    borderBottomWidth: 0.6,
    borderColor: ThemeColoursPrimary.SecondaryColour + "50",
  },
  imagePreviewContainer: {
    marginTop: 20,
    marginBottom: 20,
    alignSelf: "flex-start",
    marginHorizontal: 10,
    flexDirection: "row",
  },
  imageView: {
    width: 140,
    height: 140,
    borderRadius: 10,
    marginRight: 6,
  },
  addImageContainer: {
    width: 140,
    height: 140,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: ThemeColoursPrimary.SecondaryColour,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  menuBarContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  optionsItemContainer: {
    paddingVertical: Platform.OS === "ios" ? 16 : 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 0.4,
    borderTopColor: ThemeColoursPrimary.GreyColour,
  },
  optionsTitle: {
    fontWeight: "bold",
    fontSize: 18,
  },
  optionsDescription: {
    fontSize: 12,
    opacity: 0.7,
    color: ThemeColoursPrimary.SecondaryColour,
  },
});

export { CreatePost };
