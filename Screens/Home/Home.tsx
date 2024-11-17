import {
  StyleSheet,
  View,
  NativeSyntheticEvent,
  TextInputChangeEventData,
  Keyboard,
  Alert,
} from "react-native";
import TopNavigationBar from "../../Components/TopNavigationBar";
import Contents from "./Contents";
import { useState, useEffect, useRef } from "react";
import { ThemeColoursPrimary } from "../../Constants/UI";
import { getPostsBySearch } from "../../Firebase/firebaseFireStore";
import { RootState } from "../../Redux/store";
import PostSearchView from "../../Components/PostSearchView";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserDetailOnPosts } from "../../Util/Services";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import DropdownMenu from "../../Components/DropdownMenu";

const HomeScreen = ({ navigation }: any) => {
  const [content, setContent] = useState("Discover");
  const [searchText, setSearchText] = useState("");
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [isDropDownMenuVisible, setIsDropDownMenuVisible] = useState(true);
  const [searchPostResult, setSearchPostResult] = useState<Array<any>>([]);
  const otherUsers = useSelector((state: RootState) => state.otherUsers);
  const lastScrollY = useRef(0);
  const dispatch = useDispatch();
  const insets = useSafeAreaInsets();

  const handleSearchBarChange = (
    evt: NativeSyntheticEvent<TextInputChangeEventData>
  ) => {
    if (evt?.nativeEvent?.text != null) setSearchText(evt.nativeEvent.text);
  };

  const fetchPostsBySearch = async (searchText: string = "") => {
    try {
      const fetchedPost = await getPostsBySearch(searchText);
      const postsWithUserDetails = await fetchUserDetailOnPosts(
        fetchedPost,
        otherUsers,
        dispatch
      );
      postsWithUserDetails.length === 0
        ? setSearchPostResult(["notFound"])
        : setSearchPostResult(postsWithUserDetails);
    } catch (error) {
      Alert.alert("Oops", "Could not fetch any posts");
    }
  };

  const fetchNewItem = () => {
    if (searchText.trim() === "") return;
    fetchPostsBySearch(searchText);
    Keyboard.dismiss();
  };

  const handlePressSearchBtn = () => {
    showSearchBar ? fetchNewItem() : setShowSearchBar(true);
    setIsDropDownMenuVisible(false);
  };

  const handlePressMenuBtn = () => {
    showSearchBar
      ? setShowSearchBar((prev: boolean) => !prev)
      : navigation.toggleDrawer();
    setSearchPostResult([]);
    setIsDropDownMenuVisible(true);
  };

  const handlePressInClearBtn = () => {
    setSearchText(""); // Reset the searchText state
    setSearchPostResult([]);
  };

  useEffect(() => {
    if (!showSearchBar) {
      setSearchText("");
    }
  }, [showSearchBar]);

  const handleScroll = (event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    if (offsetY < 0) {
      return;
    }
    if (lastScrollY.current - offsetY > 20) {
      setIsDropDownMenuVisible(true);
    } else if (offsetY - lastScrollY.current > 20) {
      setIsDropDownMenuVisible(false);
    }
    lastScrollY.current = offsetY;
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.mainContent}>
        <TopNavigationBar
          searchText={searchText}
          showSearchBar={showSearchBar}
          handleSearchBarChange={handleSearchBarChange}
          handlePressSearchBtn={handlePressSearchBtn}
          handlePressMenuBtn={handlePressMenuBtn}
          handlePressInClearBtn={handlePressInClearBtn}
          isDropDownMenuVisible={isDropDownMenuVisible}
          navigation={navigation}
        />

        <View style={styles.contentWrapper}>
          <DropdownMenu
            isDropDownMenuVisible={isDropDownMenuVisible}
            setContent={setContent}
          />
          <View style={{ flex: 1, paddingTop: isDropDownMenuVisible ? 36 : 0 }}>
            <PostSearchView
              visible={showSearchBar}
              postData={searchPostResult}
              searchText={searchText}
              navigation={navigation}
            />
            <Contents
              content={content}
              navigation={navigation}
              searchText={searchText}
              showSearchBar={showSearchBar}
              onScroll={handleScroll}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  contentWrapper: {
    flex: 1,
    position: "relative",
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
