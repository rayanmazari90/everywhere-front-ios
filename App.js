


import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from "./components/Tabnavigator";
import {StyleSheet, Pressable, View, Text,  Dimensions} from 'react-native';
import SecureStorage from 'react-native-secure-storage';
import { Provider } from "react-redux";
import store from "./store";

//Import pages 
import Home from './screens/Home';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import ChatScreen from './screens/ChatScreen';
import ChatsScreen from './screens/ChatScreen';
import VerifyEmailScreen from './screens/VerifyEmailScreen';
import Mape from './screens/Mapcomp';



const Stack = createStackNavigator();

function AuthStack() {
    return (
        
      
        <Stack.Navigator >
          
            <Stack.Screen name="Home" component={Home} options={{ headerShown: false }}/>
            <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }}/>
            <Stack.Screen name="VerifyEmailScreen" component={VerifyEmailScreen} options={{ headerShown: false }}/>
            <Stack.Screen name="Login" component={Login} options={{ headerShown: false }}/>
            
        </Stack.Navigator>
    );
}

function MainTabs() {
    return (
        <TabNavigator />
    );
}


const App = () => {
  useEffect(() => {
    // check if user is already authenticated and redirect to MainTabs screen if so
    try {
      SecureStorage.getItem("accessToken")
      .then((accessToken) => {
        if (accessToken) {
          navigation.navigate('Main');
        }
      })
      .catch((error) => {
        console.log(error);
      });
      
    } catch (error) {
     console.log("noaccestoken")
    }
    
  }, []);

    return (
        <Provider store={store}>
          
            <NavigationContainer>
                <Stack.Navigator >
                    <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }}/>
                    <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }}/>
                    <Stack.Screen name="Chats" component={ChatsScreen} />
                    <Stack.Screen name="Chat" component={ChatScreen} />
                </Stack.Navigator>
            </NavigationContainer>
            
        </Provider>
    );
};


const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    top: Dimensions.get('window').width *0.1,
    right: Dimensions.get('window').height *0.03,
    zIndex: 999,
  },
  button: {
    backgroundColor: 'gray',
    borderColor: 'white',
    padding: 10,
    borderRadius: 100,
  },
});



export default App;






/*import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import MapboxGL ,{ ShapeSource, SymbolLayer , Marker, MarkerView} from '@rnmapbox/maps';
import MapView from 'react-native-maps';
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./components/Tabnavigator";
import { Provider } from "redux";
import store from "./store";

//


//MarkerComponent




const App = () => {

  return (
    
    <View style={styles.page}>
    
      <View style={styles.container}>
        <NavigationContainer >
          <TabNavigator/>
        </NavigationContainer>


      </View>
    </View>
  );
}


export default App;


const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    height: '100%',
    width: '100%',
  },
  map: {
    flex: 1
  }
});

*/
