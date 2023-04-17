


import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from "./components/Tabnavigator";
import {StyleSheet, Pressable, View, Text,  Dimensions} from 'react-native';
import { Provider, useSelector } from "react-redux";
import { PersistGate } from 'redux-persist/integration/react';
import persistStore from 'redux-persist/es/persistStore';
import store from "./store";
import data from './components/keystorage.json';

//Import pages 
import Home from './screens/Home';
import Login from './screens/Login';
import SignUp from './screens/SignUp';
import ChatScreen from './screens/ChatScreen';
import ChatsScreen from './screens/ChatScreen';
import VerifyEmailScreen from './screens/VerifyEmailScreen';
import ClubsPage from './screens/Clubspage';
import Addfriends from './screens/Addfriends';




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

/*
const App = () => {
    try {
        if (data.logged_in){
          navigation.reset({
            index: 0,
            routes: [{ name: 'Main' }],
        });
        }
        
    } catch (error) {
        console.error(error);
    }
 
    

    return (
        <Provider store={store}>
          
            <NavigationContainer>
                <Stack.Navigator >
                    <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }}/>
                    <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }}/>
                    <Stack.Screen name="Chats" component={ChatsScreen} />
                    <Stack.Screen name="Chat" component={ChatScreen} />
                    <Stack.Screen name="ClubsPage" component={ClubsPage} options={{ headerShown: false }}/>
                </Stack.Navigator>
            </NavigationContainer>
            
        </Provider>
    );
};

*/

const App = () => {
  const user = useSelector((state) => state.user)
  console.log(user);
  return (

      < NavigationContainer >
          <Stack.Navigator>
             {!user ? (
                  <>
                      <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
                  </>
              ) : (
                  <>
                      <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
                      <Stack.Screen name="Chat" component={ChatScreen} />
                      <Stack.Screen name="Addfriends" component={Addfriends} />
                      <Stack.Screen name="ClubsPage" component={ClubsPage} options={{ headerShown: false }}/>
                  </>
              )}
              {/*
              <Stack.Screen name="Auth" component={AuthStack} options={{ headerShown: false }} />
              <Stack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
              <Stack.Screen name="Chat" component={ChatScreen} />
              <Stack.Screen name="Addfriends" component={Addfriends} />
              */}
          </Stack.Navigator>
      </NavigationContainer >
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
  )
}
export default AppWrapper;


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



//export default App;






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
