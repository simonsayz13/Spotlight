import React, { useCallback, useState } from "react";
import { View, StyleSheet, Alert, ScrollView } from "react-native";

import { ThemeColoursPrimary } from "../../Constants/UI";
import { useFocusEffect } from "@react-navigation/native";
import { getUserDetails } from "../../Firebase/firebaseFireStore";
import FollowerRow from "../../Components/FollowerRow";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FollowerList = ({ navigation, route }: any) => {
  const { followings } = route.params;
  const [ldgFollowers, setLdgFollowers] = useState(false);
  const [followerList, setFollowerList] = useState([]);
  const insets = useSafeAreaInsets();
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
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <ScrollView style={styles.listContainer}>
        {followerList?.map((follower) => (
          <FollowerRow followerObj={follower} />
        ))}
      </ScrollView>
    </View>
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
