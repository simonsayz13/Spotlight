import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Dimensions,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard,
  Alert,
  Switch,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  MiscStackScreens,
  Tags,
  ThemeColoursPrimary,
} from "../../Constants/UI";
import Ionicons from "@expo/vector-icons/Ionicons";
import { uploadImages } from "../../Firebase/firebaseStorage";

import { updatePost } from "../../Firebase/firebaseFireStore";
import BottomSheet from "../../Components/BottomSheet";
import { getLocation, getLocationPermission } from "../../Util/LocationService";
import ImagePreviewCarousel from "../../Components/ImagePreviewCarousel";
import { createMediaData } from "../../Util/utility";
import BottomDrawer from "../../Components/BottomDrawer";
import TagSelection from "../../Components/TagSelection";
import PostOptionsMenuBar from "../../Components/PostOptionsMenuBar";
import { ScrollView } from "react-native-gesture-handler";
import { useAppContext } from "../../Context/AppContext";

const { width } = Dimensions.get("window");

const EditPost = ({ navigation, route }: any) => {
  const {
    id: postId,
    title: postTitle,
    description: postDescription,
    isLocation: postIsLocation,
    isComment: postIsComment,
    isPrivate: postIsPrivate,
    media: postMedia,
    tags: postTags,
  } = route.params.postData;
  const photoURI = route.params?.photoURI;
  const mediaUrls = postMedia.map((item: any) => item.media_url);
  const processedTags = Tags.filter((item) => postTags.includes(item.label));
  const [title, setTitle] = useState<string>(postTitle);
  const [description, setDescription] = useState<string>(postDescription);
  const [isComment, setIsComment] = useState<boolean>(postIsComment);
  const [isLocation, setIsLocation] = useState<boolean>(postIsLocation);
  const [isPrivate, setIsPrivate] = useState<boolean>(postIsPrivate);
  const [photoArray, setPhotoArray] = useState<Array<string>>(mediaUrls);
  const [newPhotoArray, setNewPhotoArray] = useState<Array<string>>([]);
  const [tags, setTags] = useState<Array<any>>(processedTags);
  const { setModalMessage } = useAppContext();
  const bottomDrawerRef = useRef<any>(null);
  const goBack = () => {
    resetStates();
    navigation.goBack();
  };

  const goToPhotoBrowser = () => {
    navigation.navigate(MiscStackScreens.PhotoBrowser, {
      postData: route.params.postData,
    });
  };

  useEffect(() => {
    if (photoURI) {
      setPhotoArray((prevArray) => [...prevArray, photoURI]);
      setNewPhotoArray((prevArray) => [...prevArray, photoURI]);
      navigation.setParams({ photoURI: undefined });
    }
  }, [photoURI]);

  const resetStates = () => {
    navigation.setParams({ photoURI: undefined });
    setPhotoArray([]);
    setDescription("");
    setTitle("");
    setIsComment(false);
    setIsLocation(false);
    setIsPrivate(false);
  };

  const post = async () => {
    let coordinates = {};
    if (isLocation) {
      coordinates = await getLocation();
    }
    const uploadedImageURLs = await uploadImages(newPhotoArray);
    const newMediaData = await createMediaData(uploadedImageURLs);
    const originalMediaData = postMedia.filter((item: any) =>
      photoArray.includes(item.media_url)
    );
    const media = [...originalMediaData, ...newMediaData];
    const updatedData = {
      media,
      title,
      description,
      coordinates,
      isComment,
      isLocation,
      isPrivate,
      updatedTimeStamp: new Date().toISOString(),
      tags: tags.map((tag) => tag.label),
    };
    await updatePost(postId, updatedData);
    navigation.goBack();
    setModalMessage("Post updated.");
  };

  const togglePrivateSwitch = () =>
    setIsPrivate((previousState) => !previousState);
  const toggleCommentSwitch = () =>
    setIsComment((previousState) => !previousState);

  const toggleLocationSwitch = async () => {
    const locationServicePermission = await getLocationPermission();
    if (locationServicePermission !== "OK") {
      return Alert.alert("Error", locationServicePermission);
    }
    setIsLocation((previousState) => !previousState);
  };

  const handleHideDrawer = () => {
    if (bottomDrawerRef.current) {
      bottomDrawerRef.current.hideDrawer();
    }
  };

  const handleShowDrawer = () => {
    if (bottomDrawerRef.current) {
      bottomDrawerRef.current.showDrawer();
    }
  };

  const handleSetTags = (tags: Array<string>) => {
    setTags(tags);
    handleHideDrawer();
  };

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
    <View style={[styles.container]}>
      <View style={styles.topBarContainer}>
        <TouchableOpacity onPressIn={goBack} style={styles.closeButton}>
          <Ionicons
            name="close"
            size={32}
            color={ThemeColoursPrimary.SecondaryColour}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.postButton,
            {
              backgroundColor: title ? ThemeColoursPrimary.LogoColour : "#ccc",
            },
          ]}
          onPressIn={post}
          disabled={!title}
        >
          <Text style={styles.buttonText}>Save</Text>
        </TouchableOpacity>
      </View>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <ScrollView onScrollEndDrag={Keyboard.dismiss}>
            {photoArray.length > 0 && (
              <ImagePreviewCarousel
                photoArray={photoArray}
                setPhotoArray={setPhotoArray}
              />
            )}

            <View style={styles.titleInputContainer}>
              <TextInput
                style={styles.titleTextInput}
                placeholder="Title"
                onChangeText={(text) => {
                  setTitle(text);
                }}
                // placeholderTextColor="rgba(0, 0, 0, 1)"
              >
                {title}
              </TextInput>
            </View>
            <View style={styles.descriptionInputContainer}>
              <TextInput
                style={styles.descriptionTextInput}
                placeholder="body text (optional)"
                multiline={true}
                onChangeText={(text) => {
                  setDescription(text);
                }}
                scrollEnabled={false}
              >
                {description}
              </TextInput>
            </View>

            {tags.length > 0 && (
              <View style={styles.tagsContainer}>
                <View style={styles.selectedTags}>
                  {tags.map((tag, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[styles.tagChip, { backgroundColor: tag.colour }]}
                      activeOpacity={1}
                      onPressIn={handleShowDrawer}
                    >
                      <Text style={styles.tagText}>
                        {tag.icon} {tag.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
          </ScrollView>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
      <BottomSheet
        menuBar={
          <PostOptionsMenuBar
            goToPhotoBrowser={goToPhotoBrowser}
            handleShowDrawer={handleShowDrawer}
          />
        }
        heightPercentage={0.34}
      >
        {options}
      </BottomSheet>
      <BottomDrawer
        heightPercentage={0.5}
        ref={bottomDrawerRef}
        isPannable={true}
      >
        <TagSelection handleSetTags={handleSetTags} />
      </BottomDrawer>
    </View>
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
    width: width,
    justifyContent: "space-between",
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
    backgroundColor: ThemeColoursPrimary.LogoColour,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    height: 34,
    marginLeft: "auto",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: ThemeColoursPrimary.PrimaryColour,
  },
  SectionTitle: {
    fontSize: 20,
    color: ThemeColoursPrimary.GreyColour,
  },
  titleInputContainer: {
    width: width,
    paddingHorizontal: 10,
    marginTop: 12,
    marginBottom: 16,
  },
  titleTextInput: {
    fontSize: 26,
    fontWeight: "700",
  },
  descriptionInputContainer: {
    width: width,
    paddingHorizontal: 10,
  },
  descriptionTextInput: {
    fontSize: 18,
  },
  divider: {
    width: width * 0.95,
    borderBottomWidth: 0.6,
    borderColor: ThemeColoursPrimary.SecondaryColour + "50",
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
  tagsContainer: {
    width: width,
    paddingHorizontal: 10,
    marginTop: 20,
  },
  tagChip: {
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  tagText: {
    color: ThemeColoursPrimary.PrimaryColour,
    fontSize: 14,
    fontWeight: "bold",
  },
  selectedTags: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
});

export default EditPost;
