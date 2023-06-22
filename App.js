import React, { useReducer, useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabNavigator from "./components/Tabnavigator";
import { Provider } from "react-redux";
import store from "./store";
import Home from "./screens/Home";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import SignUpInfo from "./screens/SignUpInfo";

import ClubsPage from "./screens/Clubspage";
import VerifyEmailScreen from "./screens/VerifyEmailScreen";
import ChatsScreen from "./screens/ChatsScreen";
import ChatScreen from "./screens/ChatScreen";
import Addfriends from "./screens/Addfriends";
import Removefriends from "./screens/Removefriends";
import Joingroup from "./screens/Joingroup";
import EventsPage from "./screens/EventsPage";
import TicketsPage from "./screens/TicketsPage";
import Forgetpassword from "./screens/Forgetpassword";
import verifyForgetPassword from "./screens/VerifyForgetPassword";
import ChangePassword from "./screens/ChangePassword";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";
import { useSelector } from "react-redux";
import useBackgroundLocationUpdate from "./components/useBackgroundLocationUpdate";
//import { PermissionsAndroid } from "react-native";

import { check, PERMISSIONS, RESULTS, request } from "react-native-permissions";
import messaging from "@react-native-firebase/messaging";
import { url_back } from "./components/connection_url";

const Stack = createNativeStackNavigator();
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen} />
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="SignUpInfo" component={SignUpInfo} />
      <Stack.Screen
        name="Forgetpassword"
        component={Forgetpassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyForgetPassword"
        component={verifyForgetPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ChangePassword"
        component={ChangePassword}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return <TabNavigator />;
}

const App = () => {
  const [permissions, setPermissions] = useState({
    camera: false,
    location: false,
    storage: false,
    notification: false
  });

  const user = useSelector((state) => state.user);

  useEffect(() => {
    requestPermissions();
  }, []);

  const requestPermissions = async () => {
    try {
      const cameraStatus = await request(PERMISSIONS.IOS.CAMERA);
      const locationStatus = await request(
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      );

      const photoLibraryStatus = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
      const mediaLibraryStatus = await request(PERMISSIONS.IOS.MEDIA_LIBRARY);

      const authStatus = await messaging().requestPermission();
      console.log("CAM CHECK ");
      const notificationStatus =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (notificationStatus) {
        await getFcmToken();
        console.log("Authorization status:", authStatus);
      }

      setPermissions({
        camera: cameraStatus === RESULTS.GRANTED,
        location: locationStatus === RESULTS.GRANTED,
        storage:
          photoLibraryStatus === RESULTS.GRANTED &&
          mediaLibraryStatus === RESULTS.GRANTED,
        notification: notificationStatus
      });
    } catch (err) {
      console.error("Error requesting permissions:", err);
    }
  };

  async function getFcmToken() {
    const token = await messaging().getToken();
    if (token) {
      console.log("Your Firebase Token is:", token);
      // Real code to send this token to your server
      try {
        const userId = user.user._id; // Replace this with how you get user id in your app
        const response = await fetch(`${url_back}/users/${userId}/fcmToken`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ fcmToken: token })
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        console.log("FCM token updated for user:", userId);
      } catch (error) {
        console.error("Failed to update FCM token", error);
      }
    } else {
      console.log("Failed", "No token received");
    }
  }

  useBackgroundLocationUpdate(user?.user?._id);
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          <>
            <Stack.Screen
              name="Auth"
              component={AuthStack}
              options={{ headerShown: false }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Main"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Chat" component={ChatScreen} />
            <Stack.Screen
              name="Joingroup"
              component={Joingroup}
              options={{ headerShown: false }}
            />
            <Stack.Screen name="Addfriends" component={Addfriends} />
            <Stack.Screen name="Removefriends" component={Removefriends} />
            <Stack.Screen
              name="ClubsPage"
              component={ClubsPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="EventsPage"
              component={EventsPage}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="TicketsPage"
              component={TicketsPage}
              options={{ headerShown: true }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AppWrapper = () => {
  const persistedStore = persistStore(store);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <App />
      </PersistGate>
    </Provider>
  );
};
export default AppWrapper;

/*

import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import TabNavigator from "./components/Tabnavigator";
import {
  StyleSheet,
  Pressable,
  View,
  Text,
  Dimensions,
  Modal
} from "react-native";
import { Provider, useSelector } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import persistStore from "redux-persist/es/persistStore";
import store from "./store";
import data from "./components/keystorage.json";
import { darkGreen, green } from "./components/Constant_color";
import NetInfo from "@react-native-community/netinfo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

//Import pages
import Home from "./screens/Home";
import Login from "./screens/Login";
import SignUp from "./screens/SignUp";
import SignUpInfo from "./screens/SignUpInfo";
import ChatScreen from "./screens/ChatScreen";
import ChatsScreen from "./screens/ChatScreen";
import VerifyEmailScreen from "./screens/VerifyEmailScreen";
import ClubsPage from "./screens/Clubspage";
import EventsPage from "./screens/EventsPage";
import TicketsPage from "./screens/TicketsPage";
import Addfriends from "./screens/Addfriends";
import Joingroup from "./screens/Joingroup";
import Removefriends from "./screens/Removefriends";
import useBackgroundLocationUpdate from "./components/useBackgroundLocationUpdate";

const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SignUp"
        component={SignUp}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VerifyEmailScreen"
        component={VerifyEmailScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="SignUpInfo" component={SignUpInfo} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return <TabNavigator />;
}

const App = () => {
  const user = useSelector((state) => state.user);
  const [isConnected, setIsConnected] = useState(true);
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected);
    });

    // Cleanup function
    return () => {
      unsubscribe();
    };
  }, []);
  const checkConnection = () => {
    NetInfo.fetch().then((state) => {
      if (state && typeof state.isConnected !== "undefined") {
        setIsConnected(state.isConnected);
      }
    });
  };

  useBackgroundLocationUpdate(user?.user?._id);
  return (
    <NavigationContainer>
      {!isConnected ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              color: darkGreen,
              paddingBottom: 10
            }}
          >
            Everywhere
          </Text>
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 20,
              borderColor: darkGreen
            }}
          >
            <MaterialCommunityIcons
              style={{
                justifyContent: "center",
                alignItems: "center"
              }}
              name="wifi-alert"
              size={20}
              color="gray"
            />
          </View>
          <Text style={{ fontSize: 15, color: "gray" }}>
            connection required
          </Text>
        </View>
      ) : (
        <Stack.Navigator>
          {!user ? (
            <>
              <Stack.Screen
                name="Auth"
                component={AuthStack}
                options={{ headerShown: false }}
              />
            </>
          ) : (
            <>
              <Stack.Screen
                name="Main"
                component={MainTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen
                name="Joingroup"
                component={Joingroup}
                options={{ headerShown: false }}
              />
              <Stack.Screen name="Addfriends" component={Addfriends} />
              <Stack.Screen
                name="ClubsPage"
                component={ClubsPage}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="EventsPage"
                component={EventsPage}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="TicketsPage"
                component={TicketsPage}
                options={{ headerShown: true }}
              />
              <Stack.Screen
                name="Removefriends"
                component={Removefriends}
                options={{ headerShown: true }}
              />
            </>
          )}
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

const AppWrapper = () => {
  const persistedStore = persistStore(store);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistedStore}>
        <App />
      </PersistGate>
    </Provider>
  );
};
export default AppWrapper;

const styles = StyleSheet.create({
  buttonContainer: {
    position: "absolute",
    top: Dimensions.get("window").width * 0.1,
    right: Dimensions.get("window").height * 0.03,
    zIndex: 999
  },
  button: {
    backgroundColor: "gray",
    borderColor: "white",
    padding: 10,
    borderRadius: 100
  }
});


*/
