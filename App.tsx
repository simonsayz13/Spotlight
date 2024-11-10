import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";

import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import store, { persistor, RootState } from "./Redux/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import MainNavigationStack from "./Navigation/MainNavigationStack";
import { useFonts } from "expo-font";
import { Shrikhand_400Regular } from "@expo-google-fonts/shrikhand";
import SplashScreen from "./Screens/Home/SplashScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { conversationListener } from "./Firebase/FirebaseChat";
import { LogBox } from "react-native";

// Suppress specific warnings from Firestore or Firebase
LogBox.ignoreLogs(["@firebase/firestore: Firestore"]);

const Stack = createStackNavigator();

const MainApp = () => {
  const [isLoading, setIsLoading] = useState(true);
  const { userId: currentUserId } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);
    return () => clearTimeout(timer); // Cleanup the timer on unmount
  }, []);

  useEffect(() => {
    const subscribe = conversationListener(currentUserId!, dispatch);
    return () => subscribe(); // Cleanup listener on app close or user logout
  }, [currentUserId, dispatch]);

  const [fontsLoaded] = useFonts({
    Shrikhand_400Regular,
  });

  if (!fontsLoaded || isLoading) {
    return <SplashScreen />;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          {/* <StatusBar barStyle="dark-content" hidden={false} /> */}
          <MainNavigationStack />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <MainApp />
      </PersistGate>
    </Provider>
  );
}
