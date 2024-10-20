import React, { useState } from "react";
import { FollowStackScreens, ThemeColoursPrimary } from "../../Constants/UI";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";
import FollowerList from "../../Screens/Profile/FollowerList";
import FollowingList from "../../Screens/Profile/FollowingList";
import FollowTabsHeader from "../../Components/FollowTabsHeader";
import { NavigationContainer } from "@react-navigation/native";
import { StyleSheet, Text, View } from "react-native";
import TopNavigationBarFollows from "../../Components/TopNavigationBarFollows";
import { SafeAreaView } from "react-native-safe-area-context";

const FollowStack = createNativeStackNavigator();

const FollowStackScreen = (props) => {
  const { navigation, route } = props;
  const {
    params: { params, screen },
  } = route;
  console.log("params", params);
  console.log("screen", screen);
  const { displayName, followings, followers } = params;

  const userId = useSelector((state: RootState) => state.user.userId);
  const [activeTab, setActiveTab] = useState(screen);

  const handleTabPress = (tab) => {
    setActiveTab(tab);
    if (tab === FollowStackScreens.FollowerList) {
      navigation.navigate(FollowStackScreens.FollowerList, {
        followers,
        profileId: userId,
      });
    } else {
      navigation.navigate(FollowStackScreens.FollowingList, {
        followings,
        profileId: userId,
      });
    }
  };

  return (
    <FollowStack.Navigator
      // initialRouteName={FollowStackScreens.FollowerList}
      screenOptions={{
        header: () => (
          <SafeAreaView style={styles.container}>
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
