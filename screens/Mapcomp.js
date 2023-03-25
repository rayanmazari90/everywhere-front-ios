import React, { useRef, useEffect } from 'react';
import { Platform, StyleSheet, View, Text , Image, ImageBackground , Animated} from 'react-native';
import MapboxGL ,{ ShapeSource, SymbolLayer , Marker, MarkerView, Camera} from '@rnmapbox/maps';
import MapView from 'react-native-maps';
//import { UseClubsget } from './../services/appApi';



//
MapboxGL.setWellKnownTileServer('mapbox');
MapboxGL.setAccessToken('pk.eyJ1IjoicmF5bWF6bWF6IiwiYSI6ImNsOW9ybnVocTBsbmMzcHM1d3gwNmw1NWIifQ.pmYh9FP10oM88ezvx1KsYg');
const mapStyle = 'mapbox://styles/mapbox/dark-v11';

//MarkerComponent


const Mapcomp = () => {
  const IS_IOS= Platform.OS== 'ios';
  const centerCoordinate = [-3.703790, 40.416775]; // Madrid coordinates
  const markerCoordinate = [-3.678837, 40.432703];
  //const clubs = UseClubsget();
  const symbolLayerOptions = {
    iconAllowOverlap: true,
    iconSize: 20,
    iconImage: '/Users/rayanmazari/Desktop/Everywhere_React_native/Everywhere-react/everywhere/Unknown-2.png', // Mapbox's built-in embassy icon
    iconOffset: [0, -25],
  };
//  TEST




  return (
    
    <View style={styles.page}>
    
      <View style={styles.container}>
      
        <MapboxGL.MapView 
        style={styles.map}
        styleURL={mapStyle}
        projection= "globe"
        //center={[-3.703790, 40.416775]} // Set the initial map center
        //zoomLevel={40}
        
       >  
          <MapboxGL.UserLocation visible={true}/>
          
            <MapboxGL.Camera 
              zoomLevel={12}
              centerCoordinate={centerCoordinate}
            />
            <MapboxGL.MarkerView
              key={1}
              id={"1"}
              title='Test'
              coordinate={markerCoordinate}>
              <ImageBackground
                    source={require('/Users/rayanmazari/Desktop/Everywhere_React_native/Everywhere-react/everywhere/Unknown-2.png')}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 50,
                      overflow: 'hidden',
                      borderWidth: 2,
                      borderColor: 'white',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)',
                      backgroundImage: 'linear-gradient(to bottom right, blue, red)',
                      backgroundClip: 'padding-box',
                      padding: 2,

                    }}
                    imageStyle={{
                      resizeMode: 'cover',
                      opacity: 0.8,
                    }}
                  >
                    <ImageBackground
                      style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: 'transparent',
                        borderRadius: 125,
                        overflow: 'hidden',
                      }}

                    >
                      {/* Your image content goes here */}
                    </ImageBackground>
                  </ImageBackground>
             
            </MapboxGL.MarkerView>

          

            
        </MapboxGL.MapView>
      </View>
    </View>
  );
}

export default Mapcomp;


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
  },


});
