import { useEffect, useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";

import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaProvider } from "react-native-safe-area-context";
import store, { persistor, RootState } from "./Redux/store";
import { Provider, useDispatch, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useFonts } from "expo-font";
import { Shrikhand_400Regular } from "@expo-google-fonts/shrikhand";
import SplashScreen from "./Screens/Home/SplashScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { conversationListener } from "./Firebase/FirebaseChat";
import { Alert, LogBox, StatusBar } from "react-native";
import DrawerNavigation from "./Navigation/DrawerNavigation";
import { AppProvider } from "./Context/AppContext";
import MessageModal from "./Components/MessageModal";
import { getLocationPermission } from "./Util/LocationService";

LogBox.ignoreLogs(["@firebase/firestore: Firestore"]);

const Stack = createStackNavigator();

const MainApp = () => {
  const { userId: currentUserId } = useSelector(
    (state: RootState) => state.user
  );
  const dispatch = useDispatch();

  const getLocation = async () => {
    const permission = await getLocationPermission();
    if (permission !== "OK") {
      return Alert.alert("Error", permission);
    }
  };

  useEffect(() => {
    const subscribe = conversationListener(currentUserId!, dispatch);
    getLocation();

    return () => {
      if (subscribe) {
        subscribe();
      }
    };
  }, [currentUserId, dispatch]);

  const [fontsLoaded] = useFonts({
    Shrikhand_400Regular,
  });

  if (!fontsLoaded) {
    return <SplashScreen />;
  }

  return (
    <AppProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <NavigationContainer theme={DefaultTheme}>
            <MessageModal />
            <StatusBar barStyle="dark-content" />
            <DrawerNavigation />
          </NavigationContainer>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </AppProvider>
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
