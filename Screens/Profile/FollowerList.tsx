import React, { useCallback, useState } from "react";
import { View, StyleSheet, Alert, ScrollView, Dimensions } from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

import { ThemeColoursPrimary } from "../../Constants/UI";
import { useFocusEffect } from "@react-navigation/native";
import {
  addFollower,
  getUserDetails,
  removeFollower,
} from "../../Firebase/firebaseFireStore";
import FollowerRow from "../../Components/FollowerRow";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/store";

const handlePressFollowBtn = async (profileId, appUserId) => {
  try {
    await addFollower(profileId, appUserId);
  } catch (error) {
    Alert.alert("Error", `${error}`);
  }
};

const handlePressUnfollowBtn = async (profileId, appUserId) => {
  try {
    await removeFollower(profileId, appUserId);
  } catch (error) {
    Alert.alert("Error", `${error}`);
  }
};
const FollowingScreen = (props) => {
  const { followingList, profileId, type, appUserId } = props;

  const { userFollowings: appUserFollowings } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.listContainer}>
        {followingList?.map((profile) => {
          const isFollowed = Boolean(
            appUserFollowings.find((el) => el === profile.user_id)
          );
          return (
            <FollowerRow
              key={`followingScreen_followRow_${profileId}_${profile.user_id}`}
              followerObj={profile}
              buttonTitle={isFollowed ? "Unfollow" : "Follow"}
              buttonDisabled={profile.user_id === appUserId}
              handlePressButton={
                isFollowed
                  ? () => handlePressUnfollowBtn(profile.user_id, appUserId)
                  : () => handlePressFollowBtn(profile.user_id, appUserId)
              }
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const FollowersScreen = (props) => {
  const { followerList, profileId, type, followings, appUserId } = props;

  const { userFollowings: appUserFollowings } = useSelector(
    (state: RootState) => {
      return state.user;
    }
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.listContainer}>
        {followerList?.map((profile) => {
          const isFollowed = Boolean(
            appUserFollowings.find((el) => el === profile.user_id)
          );

          return (
            <FollowerRow
              key={`followerScreen_followRow_${profileId}_${profile.user_id}`}
              followerObj={profile}
              buttonTitle={isFollowed ? "Unfollow" : "Follow"}
              buttonDisabled={profile.user_id === appUserId}
              handlePressButton={
                isFollowed
                  ? () => handlePressUnfollowBtn(profile.user_id, appUserId)
                  : () => handlePressFollowBtn(profile.user_id, appUserId)
              }
            />
          );
        })}
      </ScrollView>
    </View>
  );
};

const initialLayout = { width: Dimensions.get("window").width };

const FollowerList = ({ navigation, route }: any) => {
  const { followings, followers, profileId, tabIndex, type, appUserId } =
    route.params;

  const [index, setIndex] = React.useState(tabIndex);
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
        fetchFollowProfiles(followings, setLdgFollowings).then((data) => {
          setFollowingList(data);
        });
      } else if (index === 1) {
        fetchFollowProfiles(followers, setLdgFollowers).then((data) => {
          setFollowerList(data);
        });
      }
    }, [index]) // Include dependencies like userId if they change
  );

  const [routes] = React.useState([
    { key: "following", title: "Following" },
    { key: "followers", title: "Followers" },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "followers":
        return (
          <FollowersScreen
            followerList={followerList}
            profileId={profileId}
            type={type}
            followings={followings}
            appUserId={appUserId}
          />
        );
      case "following":
        return (
          <FollowingScreen
            followingList={followingList}
            profileId={profileId}
            type={type}
            appUserId={appUserId}
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
