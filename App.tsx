import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import store, { persistor } from "./Redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import MainNavigationStack from "./Navigation/MainNavigationStack";
import { useFonts } from "expo-font";
import { Shrikhand_400Regular } from "@expo-google-fonts/shrikhand";
import SplashScreen from "./Screens/Home/SplashScreen";

const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  const [fontsLoaded] = useFonts({
    Shrikhand_400Regular,
  });

  // return <SplashScreen />;
  if (!fontsLoaded || isLoading) {
    return <SplashScreen />;
  }

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <NavigationContainer>
            <StatusBar barStyle="dark-content" hidden={false} />
            <Stack.Navigator
              initialRouteName="MainNavigation"
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen
                name="MainNavigation"
                component={MainNavigationStack}
              />
            </Stack.Navigator>
          </NavigationContainer>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
