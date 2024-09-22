import { StyleSheet, View, Text, SafeAreaView } from "react-native";
import TopNavigationBar from "../../Components/TopNavigationBar";
import Contents from "./Contents";
import { useCallback, useState } from "react";
import DrawerNavigationBar from "../../Components/DrawerNavigationBar";
import {
  HomeStackScreens,
  ThemeColours,
  ThemeColoursPrimary,
} from "../../Constants/UI";

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

  const changeContent = useCallback((content: string) => {
    setContent(content);
  }, []);

  const openPost = () => {
    navigation.navigate(HomeStackScreens.Post);
  };

  return (
    <SafeAreaView style={styles.container}>
      <DrawerNavigationBar drawerContent={DrawerMenu}>
        {({ openDrawer }: any) => (
          <View style={styles.mainContent}>
            <TopNavigationBar
              setContent={changeContent}
              drawerHandler={openDrawer}
            />
            <Contents content={content} openPost={openPost} />
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
