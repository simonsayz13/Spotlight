import React, { memo, useState } from "react";
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
  Modal,
  ActivityIndicator,
} from "react-native";
import {
  MiscStackScreens,
  PostStackScreens,
  ThemeColours,
  ThemeColoursPrimary,
} from "../../Constants/UI";
import Ionicons from "@expo/vector-icons/Ionicons";
import { uploadImage } from "../../Firebase/firebaseStorage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import { createPost } from "../../Firebase/firebaseFireStore";

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
    setPosting(true);
    const imageURL = await uploadImage(photoURI);
    const timeStamp = Date.now();
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

  const ImageSelectorDOM = () => {
    return (
      <View style={styles.imageSelectorOptionContainer}>
        <Text style={styles.SectionTitle}>Add image</Text>
        <View style={styles.imageSelectorOptionButtonsView}>
          <TouchableOpacity
            style={styles.imageSelectorButton}
            onPressIn={goToCamera}
          >
            <Ionicons name="camera-sharp" size={42} color="black" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageSelectorButton}
            onPressIn={goToPhotoBrowser}
          >
            <MaterialCommunityIcons name="image-plus" size={42} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        <View style={styles.topBarContainer}>
          <TouchableOpacity onPressIn={goBack} style={styles.backButton}>
            <Ionicons
              name="chevron-back"
              size={32}
              color={ThemeColoursPrimary.SecondaryColour}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Create a post</Text>
          <TouchableOpacity style={styles.postButton} onPressIn={post}>
            <Text style={styles.postButtonText}>Post</Text>
          </TouchableOpacity>
        </View>
        {photoURI ? (
          <ImagePreviewDOM photoURI={photoURI} />
        ) : (
          <ImageSelectorDOM />
        )}

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

        <Modal transparent={true} animationType="fade" visible={posting}>
          <View style={styles.loadingModal}>
            <View style={styles.activityIndicatorWrapper}>
              <ActivityIndicator
                size="large"
                color={ThemeColoursPrimary.SecondaryColour}
              />
              <Text>Posting...</Text>
            </View>
          </View>
        </Modal>
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
    elevation: 4,
    shadowColor: ThemeColoursPrimary.SecondaryColour,
    shadowOffset: {
      width: 0,
      height: 4.5,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    zIndex: 1,
  },
  backButton: {
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
  imageSelectorOptionContainer: {
    height: 160,
    width: width * 0.95,
    gap: 10,
    justifyContent: "center",
  },
  imageSelectorOptionButtonsView: {
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  imageSelectorButton: {
    width: "50%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 2,
    borderColor: ThemeColoursPrimary.SecondaryColour,
  },
  titleInputContainer: {
    width: width * 0.95,
    gap: 10,
    borderRadius: 8,
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
  loadingModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  },
  activityIndicatorWrapper: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});

export { CreatePost };
