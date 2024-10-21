import React, { useCallback, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Text,
  Alert,
  FlatList,
  ScrollView,
  Dimensions,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import { ThemeColoursPrimary } from "../../Constants/UI";
import { useFocusEffect } from "@react-navigation/native";
import { getUserDetails } from "../../Firebase/firebaseFireStore";
import FollowerRow from "../../Components/FollowerRow";

const FollowersScreen = (props) => {
  const { followerList, profileId } = props;
  return (
    <View style={styles.container}>
      <ScrollView style={styles.listContainer}>
        {followerList?.map((profile) => (
          <FollowerRow
            key={`followerScreen_followRow_${profileId}_${profile.user_id}`}
            followerObj={profile}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const FollowingScreen = (props) => {
  const { followingList, profileId } = props;
  return (
    <View style={styles.container}>
      <ScrollView style={styles.listContainer}>
        {followingList?.map((profile) => (
          <FollowerRow
            key={`followingScreen_followRow_${profileId}_${profile.user_id}`}
            followerObj={profile}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const initialLayout = { width: Dimensions.get("window").width };

const FollowerList = ({ navigation, route }: any) => {
  const { followers, followings, displayName, profileId } = route.params;

  console.log("route", route);
  const [index, setIndex] = React.useState(0);
  const [ldgFollowers, setLdgFollowers] = useState(false);
  const [ldgFollowings, setLdgFollowings] = useState(false);
  const [followerList, setFollowerList] = useState([]);
  const [followingList, setFollowingList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchFollowProfiles = async (list, cb) => {
        cb(true);
        try {
          const data = await Promise.all(
            list.map(async (follower) => {
              const details = await getUserDetails(follower, false);
              return details;
            })
          );

          cb(false);
          return data;
        } catch (error) {
          cb(false);
          Alert.alert("Error", `${error}`);
        }
      };

      if (index === 0) {
        fetchFollowProfiles(followers, setLdgFollowers).then((data) => {
          setFollowerList(data);
        });
      } else if (index === 1) {
        fetchFollowProfiles(followings, setLdgFollowings).then((data) => {
          setFollowingList(data);
        });
      }
    }, [index]) // Include dependencies like userId if they change
  );

  const [routes] = React.useState([
    { key: "followers", title: "Followers" },
    { key: "following", title: "Following" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "followers":
        return (
          <FollowersScreen followerList={followerList} profileId={profileId} />
        );
      case "following":
        return (
          <FollowingScreen
            followingList={followingList}
            profileId={profileId}
          />
        );
      default:
        return null;
    }
  };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={styles.indicator} // Style the underline indicator
      style={styles.tabBar} // Style the tab bar container
      labelStyle={styles.label} // Style the tab text
      activeColor={ThemeColoursPrimary.SecondaryColour} // Active tab text color
      inactiveColor="#888" // Inactive tab text color
      tabStyle={styles.tab}
    />
  );

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      style={styles.tabView}
      renderTabBar={renderTabBar}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  tabView: { backgroundColor: ThemeColoursPrimary.PrimaryColour },
  listContainer: {
    width: "100%",
  },
  tabBar: {
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  label: {
    fontSize: 12,
    fontWeight: "bold",
  },
  indicator: {
    backgroundColor: ThemeColoursPrimary.LogoColour,
    height: 3,
  },
});
export default FollowerList;
