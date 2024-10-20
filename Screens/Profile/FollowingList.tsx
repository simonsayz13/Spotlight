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
} from "react-native";

import { ThemeColoursPrimary } from "../../Constants/UI";
import TopNavigationBarFollows from "../../Components/TopNavigationBarFollows";
import { useFocusEffect } from "@react-navigation/native";
import { getUserDetails } from "../../Firebase/firebaseFireStore";
import FollowerRow from "../../Components/FollowerRow";

const FollowerList = ({ navigation, route }: any) => {
  const { followers, followings, displayName } = route.params;
  const [ldgFollowers, setLdgFollowers] = useState(false);
  const [followerList, setFollowerList] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const fetchFollowers = async () => {
        setLdgFollowers(true);
        try {
          const data = await Promise.all(
            followings.map(async (follower) => {
              const details = await getUserDetails(follower, false);
              return details;
            })
          );
          // const data = followers.map(
          //   async (follower) => await getUserDetails(follower, false)
          // );
          setLdgFollowers(false);
          return data;
        } catch (error) {
          setLdgFollowers(false);
          Alert.alert("Error", `${error}`);
        }
      };
      fetchFollowers().then((data) => {
        setFollowerList(data);
      });
    }, [followings]) // Include dependencies like userId if they change
  );
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.listContainer}>
        {followerList?.map((follower) => (
          <FollowerRow followerObj={follower} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  bottomView: {
    height: 60,
  },
  listContainer: {
    paddingTop: 10,
  },
});
export default FollowerList;
