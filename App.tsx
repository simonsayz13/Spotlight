import { NavigationContainer } from "@react-navigation/native";

import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import store, { persistor } from "./Redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import MainNavigationStack from "./Navigation/MainNavigationStack";

const Stack = createStackNavigator();

export default function App() {
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
