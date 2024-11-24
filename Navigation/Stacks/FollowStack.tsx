import React, { useState } from "react";
import { FollowStackScreens, ThemeColoursPrimary } from "../../Constants/UI";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import FollowerList from "../../Screens/Profile/FollowerList";
import FollowingList from "../../Screens/Profile/FollowingList";
import { StyleSheet } from "react-native";
import TopNavigationBarFollows from "../../Components/TopNavigationBarFollows";
import { SafeAreaView } from "react-native-safe-area-context";

const FollowStack = createNativeStackNavigator();

const FollowStackScreen = (props) => {
  const { navigation, route } = props;
  const {
    params: { params, screen },
  } = route;
  const { displayName, followings, followers, tabIndex, type, appUserId } =
    params;

  const userId = useSelector((state: RootState) => state.user.userId);
  const [activeTab, setActiveTab] = useState(screen);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === FollowStackScreens.FollowerList) {
      navigation.navigate(FollowStackScreens.FollowerList, {
        followers,
        profileId: userId,
        followings,
        tabIndex,
        type,
        appUserId,
      });
    }
  };

  return (
    <FollowStack.Navigator
      // initialRouteName={FollowStackScreens.FollowerList}
      screenOptions={{
        header: () => (
          <SafeAreaView style={styles.container} edges={["top"]}>
            <TopNavigationBarFollows
              navigation={navigation}
              displayName={displayName}
              activeTab={activeTab}
              handleTabPress={handleTabPress}
            />
          </SafeAreaView>
        ),
      }}
    >
      <FollowStack.Screen
        name={FollowStackScreens.FollowerList}
        component={FollowerList}
      />
      <FollowStack.Screen
        name={FollowStackScreens.FollowingList}
        component={FollowingList}
      />
    </FollowStack.Navigator>
  );
};

export default FollowStackScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
});
