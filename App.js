import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import MapboxGL ,{ ShapeSource, SymbolLayer , Marker, MarkerView} from '@rnmapbox/maps';
import MapView from 'react-native-maps';
import { NavigationContainer } from "@react-navigation/native";
import TabNavigator from "./components/Tabnavigator";

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

