import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  FlatList,
  Alert,
  Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { PostStackScreens, ThemeColoursPrimary } from "../../Constants/UI";
import * as MediaLibrary from "expo-media-library";
import { Image } from "expo-image";
const { width } = Dimensions.get("window");
const PhotoBrowser = ({ navigation, route }: any) => {
  const [photos, setPhotos] = useState<string[]>([]);
  const imageSize = width / 3;

  const goBack = () => {
    navigation.goBack();
  };

  const loadPhotos = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();

    if (status !== "granted") {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const { assets } = await MediaLibrary.getAssetsAsync({
      first: 1000,
      mediaType: "photo",
      sortBy: "creationTime",
    });

    setPhotos(assets.map((asset) => asset.uri)); // Extract URIs
  };

  useEffect(() => {
    loadPhotos();
  }, []);

  const handlePhotoPress = (uri: string) => {
    if (route.params?.postData) {
      navigation.popTo(PostStackScreens.EditPost, {
        postData: route.params.postData,
        photoURI: uri,
      });
    } else {
      navigation.popTo(PostStackScreens.CreatePost, { photoURI: uri });
    }
  };

  const renderPhoto = ({ item }: any) => (
    <TouchableOpacity onPress={() => handlePhotoPress(item)}>
      <Image
        source={{ uri: item }}
        style={{ width: imageSize, height: imageSize }}
      />
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container]}>
      <View style={styles.topBarContainer}>
        <TouchableOpacity onPressIn={goBack} style={styles.backButton}>
          <Ionicons
            name="close"
            size={32}
            color={ThemeColoursPrimary.SecondaryColour}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Select Photo</Text>
        <View style={styles.placeHolder}></View>
      </View>
      <FlatList
        data={photos}
        keyExtractor={(item) => item}
        renderItem={renderPhoto}
        numColumns={3}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  placeHolder: {
    width: 32,
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
    color: ThemeColoursPrimary.SecondaryColour,
  },
});

export default PhotoBrowser;
