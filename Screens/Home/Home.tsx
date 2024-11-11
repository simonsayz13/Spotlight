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
import { useCallback, useState, useEffect, useRef } from "react";
import DrawerNavigationBar from "../../Components/DrawerNavigationBar";
import { ThemeColoursPrimary } from "../../Constants/UI";
import { getPostsBySearch } from "../../Firebase/firebaseFireStore";
import { setPosts } from "../../Redux/Slices/postsSlices";
import store from "../../Redux/store";
import { delay } from "../../Util/utility";
import PostSearchView from "../../Components/PostSearchView";

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
  const [isDropDownMenuVisible, setIsDropDownMenuVisible] = useState(true);
  const lastScrollY = useRef(0);
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
      await delay(200); // Delay to ensure pst dsiplay can only happen after searchText is reset
      store.dispatch(setPosts(data));
    } catch (error) {
      Alert.alert("Error", "Error fetching posts");
    }
  };

  const fetchNewItem = () => {
    if (searchText.trim() === "") return;
    fetchPostsBySearch(searchText);
    Keyboard.dismiss();
  };

  const handlePressSearchBtn = () => {
    if (!showSearchBar) setShowSearchBar((prev: boolean) => !prev);
    // showSearchBar ? fetchNewItem() :
    setIsDropDownMenuVisible(false);
  };

  const handlePressMenuBtn = (cb: any) => {
    showSearchBar ? setShowSearchBar((prev: boolean) => !prev) : cb();
    setIsDropDownMenuVisible(true);
  };

  const handlePressInClearBtn = () => {
    setSearchText(""); // Reset the searchText state
  };

  useEffect(() => {
    if (!showSearchBar) {
      setSearchText("");
    }
  }, [showSearchBar]);

  const handleScroll = (event: any) => {
    // if (showSearchBar) return;
    const offsetY = event.nativeEvent.contentOffset.y;

    if (lastScrollY.current - offsetY > 20) {
      setIsDropDownMenuVisible(true);
    } else if (offsetY - lastScrollY.current > 20) {
      setIsDropDownMenuVisible(false);
    }
    lastScrollY.current = offsetY;
  };

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
              handlePressInClearBtn={handlePressInClearBtn}
              isDropDownMenuVisible={isDropDownMenuVisible}
            />

            <View style={styles.contentWrapper}>
              <PostSearchView visible={showSearchBar} />

              <Contents
                content={content}
                navigation={navigation}
                searchText={searchText}
                showSearchBar={showSearchBar}
                onScroll={handleScroll}
              />
            </View>
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
  contentWrapper: {
    flex: 1,
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
    backgroundColor: ThemeColoursPrimary.LightGreyBackground,
  },
});

export { HomeScreen };
