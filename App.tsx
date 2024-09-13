import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./Navigation/TabNavigation";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

const Stack = createStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" hidden={false} />
        <Stack.Navigator
          initialRouteName="Tabs"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Tabs" component={TabNavigation} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
