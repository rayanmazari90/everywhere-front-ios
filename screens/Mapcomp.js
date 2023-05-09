import React, { useEffect, useState } from 'react';
import {StyleSheet, View,  ImageBackground, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import MapboxGL ,{ ShapeSource, SymbolLayer , Marker, MarkerView, Camera} from '@rnmapbox/maps';
import ClubsPage from './Clubspage';
import appApi, { useClubsgetMutation } from './../services/appApi';

//import { UseClubsget } from './../services/appApi';



//
MapboxGL.setWellKnownTileServer('mapbox');
MapboxGL.setAccessToken('pk.eyJ1IjoicmF5bWF6bWF6IiwiYSI6ImNsOW9ybnVocTBsbmMzcHM1d3gwNmw1NWIifQ.pmYh9FP10oM88ezvx1KsYg');
const mapStyle = 'mapbox://styles/mapbox/dark-v11';

//MarkerComponent


const Mapcomp = () => {
  const centerCoordinate = [-3.703790, 40.416775]; // Madrid coordinates
  const [clubsget, { isLoading, error }] = useClubsgetMutation();
  const [dataArr, setDataArr] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await clubsget();
        setDataArr(response.data);
      } catch (err) {
        console.error(err);
        setMessage('Try again');
      }
    };
    fetchData();
  }, [clubsget]);

  const renderMarkers = () => {
    return dataArr.map((club) => (
      <MapboxGL.MarkerView
        key={club.clubname}
        id={club.clubname}
        title={club.clubname}
        coordinate={[club.lng, club.lat]}
      >
        <TouchableOpacity
        onPress={() => navigation.navigate('ClubsPage', { club: club })}
      >
        <ImageBackground
          source={{ uri: 'https://drive.google.com/uc?export=view&id='+club.image }}
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

          </ImageBackground>
        </ImageBackground>
        </TouchableOpacity>
      </MapboxGL.MarkerView>
    ));
  };

  const data = async() => {
    const data = await handleEvents();
    setDataArr(data.data);
    return data.data;
  };

  

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
              {renderMarkers()}
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


