import React from "react";
import { PostStackScreens } from "../../Constants/UI";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Camera } from "../../Screens/Post/Camera";
import { ViewPhoto } from "../../Screens/Post/ViewPhoto";
import { CreatePost } from "../../Screens/Post/CreatePost";

const PostStack = createNativeStackNavigator();

const PostStackScreen = () => (
  <PostStack.Navigator screenOptions={{ headerShown: false }}>
    <PostStack.Screen
      name={PostStackScreens.CreatePost}
      component={CreatePost}
    />
    <PostStack.Screen name={PostStackScreens.Camera} component={Camera} />
    <PostStack.Screen name={PostStackScreens.ViewPhoto} component={ViewPhoto} />
  </PostStack.Navigator>
);

export default PostStackScreen;
