import { Text, StyleSheet, Platform } from "react-native";
import { ThemeColoursPrimary } from "../Constants/UI";
import { TabBar } from "react-native-tab-view";

const CustomTabBar = (props: any) => {
  return (
    <TabBar
      {...props}
      style={[
        styles.tabBarContainer,
        { height: Platform.OS === "android" ? 50 : 40 },
      ]}
      renderLabel={({ route, focused }: any) => (
        <Text
          style={[
            styles.labelText,
            { color: focused ? ThemeColoursPrimary.SecondaryColour : "#888" },
          ]}
        >
          {route.name}
        </Text>
      )}
      indicatorStyle={styles.indicatorStyle}
    />
  );
};

const styles = StyleSheet.create({
  tabBarContainer: {
    backgroundColor: ThemeColoursPrimary.PrimaryColour,
  },
  labelText: {
    paddingBottom: 20,
    fontSize: 18,
    fontWeight: "600",
  },
  indicatorStyle: {
    backgroundColor: ThemeColoursPrimary.LogoColour,
    height: 3,
    bottom: 2,
  },
});

export default CustomTabBar;
