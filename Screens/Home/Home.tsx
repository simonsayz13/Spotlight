import {
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Keyboard,
  Alert,
} from "react-native";
import TopNavigationBar from "../../Components/TopNavigationBar";
import Contents from "./Contents";
import { useCallback, useState, useEffect } from "react";
import DrawerNavigationBar from "../../Components/DrawerNavigationBar";
import { ThemeColoursPrimary } from "../../Constants/UI";
import { getPostsBySearch } from "../../Firebase/firebaseFireStore";
import { setPosts } from "../../Redux/Slices/postsSlices";
import store from "../../Redux/store";

const DrawerMenu = () => {
  return (
    <View style={styles.drawerContent}>
      <Text style={styles.drawerText}>Discover Friends</Text>
      <Text style={styles.drawerText}>Creator Center</Text>
    </View>
  );
};

const HomeScreen = ({ navigation }: any) => {
  const [content, setContent] = useState("Explore");
  const [searchText, setSearchText] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);

  const changeContent = useCallback((content: string) => {
    setContent(content);
  }, []);

  const handleSearchBarChange = (
    evt: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    if (evt?.nativeEvent?.text != null) setSearchText(evt.nativeEvent.text);
  };

  const fetchPostsBySearch = async (searchText: string = "") => {
    try {
      const data = await getPostsBySearch(searchText);
      setShowSearchBar(false);
      store.dispatch(setPosts(data));
    } catch (error) {
      Alert.alert("Error", "Error fetching posts");
    }
  };

  const fetchNewItem = () => {
    console.log("fetch new item");
    if (searchText.trim() === "") return;
    fetchPostsBySearch(searchText);
    Keyboard.dismiss();
  };

  const handlePressSearchBtn = () => {
    showSearchBar ? fetchNewItem() : setShowSearchBar((prev: boolean) => !prev);
  };

  const handlePressMenuBtn = (cb) => {
    showSearchBar ? setShowSearchBar((prev: boolean) => !prev) : cb();
  };

  useEffect(() => {
    if (!showSearchBar) setSearchText("");
  }, [showSearchBar]);

  return (
    <SafeAreaView style={styles.container}>
      <DrawerNavigationBar drawerContent={DrawerMenu}>
        {({ openDrawer }: any) => (
          <View style={styles.mainContent}>
            <TopNavigationBar
              searchText={searchText}
              showSearchBar={showSearchBar}
              setContent={changeContent}
              handleSearchBarChange={handleSearchBarChange}
              handlePressSearchBtn={handlePressSearchBtn}
              handlePressMenuBtn={() => handlePressMenuBtn(openDrawer)}
            />
            <Contents
              content={content}
              navigation={navigation}
              searchText={searchText}
              showSearchBar={showSearchBar}
            />
          </View>
        )}
      </DrawerNavigationBar>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  textFont: {
    fontSize: 40,
  },
  drawerContent: {
    flex: 1,
    paddingTop: 10,
    paddingLeft: 20,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  drawerText: {
    color: ThemeColoursPrimary.SecondaryColour,
    marginBottom: 20,
    fontSize: 18,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
  },
});

export { HomeScreen };
