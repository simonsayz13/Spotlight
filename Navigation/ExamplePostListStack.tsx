import React from "react";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import PostListScreen from "../Screens/Home/ExamplePostList"; // Screen displaying a list of PostCard components
import MainPost from "../Screens/Home/ExampleMainPost";

const Stack = createSharedElementStackNavigator();

const PostStackScreen = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="PostList" component={PostListScreen} />
    <Stack.Screen
      name="MainPost"
      component={MainPost}
      options={{ presentation: "modal" }}
    />
  </Stack.Navigator>
);

export default PostStackScreen;
