


/*
const Field = props => {
    const { rightElement, ...otherProps } = props;

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between'  }}>
            <TextInput
                {...otherProps}
                style={{ borderRadius: 100, color: darkGreen, paddingHorizontal: 10, width: '70%', backgroundColor: 'rgb(220,220, 220)', marginVertical: 10 }}
                placeholderTextColor={darkGreen}
            />
            {rightElement && <View style={{ position: 'absolute', justifyContent:"center", right: 10, top: 10  }}>{rightElement}</View>}
        </View>
    );
};

export default Field;
*/

import Video from 'react-native-video';
import React, { useState } from 'react';
import { green,darkGreen } from '../components/Constant_color';
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  View,
  Text,
  ScrollView,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  ImageBackground,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import ScrollZoomHeader from 'react-native-header-zoom-scroll';


const ClubsPage = () => {
  const navigation = useNavigation();
  const handleBackPress = () => {
    console.log("goBack");
    setTimeout(() => {
      navigation.goBack();
    }, 0);
  };
    const club = [
        {id: 7,
            title: 'Liberty',
            image:'https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2018/03/21/15216321914946.jpg',
            open: false,
            hours: {
              startTime: '00:00 am',
              endTime: '06:00 am'
            },
            rating:4,
            location: "Calle de Juan Bravo, 31",
             videos:[
                {image: 'https://i.gifer.com/R2CI.mp4' , hour: '00:00 am', day:'14 mars'},
                {image: 'https://i.gifer.com/AITL.mp4', hour: '08:30 am', day:'7 april'},
                {image: 'https://i.gifer.com/FR6T.mp4', hour: '05:35 am', day:'12 febrary'},
             ]
        }
        // Add more events as needed
    ];
 
    const renderClubVideo = (club,  index) => {
      return (
          <View style={styles.clubContainer} key={'club-' + club.id}>
            <Video
              source={{ uri: club.image }}
              muted={true}
              repeat={true}
              resizeMode='cover'
              rate={1.0}
              ignoreSilentSwitch='obey'
              style={styles.eventImage}
            />
            <View style={styles.box}>
              <Text style={styles.eventTitle}> {club.day} - {club.hour} </Text>
            </View>
          </View>
          

      );
    };
    
    const renderClubVideos = () => {
        return club[0].videos.map((club, index) => renderClubVideo(club, index));
    };

  
  return (
    
    <SafeAreaView  >
      
      
    
    <ScrollZoomHeader
        showsVerticalScrollIndicator={true}
        smallHeaderHeight={
          0
        }
        
        headerHeight={200}
        backgroundHeaderComponent={
          
          <Image
            source={{url:club[0].image}}
            style={{
                padding:0,
                margin:0,
                width: '100%',
                height: '100%',
              
            }}
          />
        }
      >
        
    <View style={styles.container}> 
      <View>
          <TouchableOpacity
          onPress={handleBackPress}
          style={{
            position: 'static',
            top: 0,
            left: 0,
            flex:1,
            alignItems: 'center',
            justifyContent: 'center',
            width: Dimensions.get('window').width *0.13,
            backgroundColor: '#f1f1f1',
            zIndex: 10,
            borderRadius:10,
          }}>
          <MaterialCommunityIcons style={{position: 'static'}} name="chevron-left" size={30} color={darkGreen}/>
        </TouchableOpacity>
      </View>
        <View style={styles.sectionContainer}>
                  <Text style={styles.mainTitle}>{club[0].title}</Text>
            <View style={styles.underline}></View>
            <Text style={styles.sectionTitle}>What's now ?</Text>
            <FlatList
              data={renderClubVideos()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => item}
              keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
            />
            <Text style={styles.sectionTitle}>Description</Text>
            <View style={{ flexDirection: 'column', justifyContent: 'flex-start' }}>
              <Text>
                Status:{" "}
                <Text style={{ padding: 0, color: club[0].open ? "blue" : "red" }}>
                  {club[0].open ? "Open" : "Closed"}
                </Text>
              </Text>
              <Text style={{ padding: 0, marginTop: 10 }}>Adress: {club[0].location}</Text>
              <Text style={{ padding: 0, marginTop: 10 }}>Hours of opening: {club[0].hours.startTime} - {club[0].hours.endTime}</Text>
            </View>
            <Text style={styles.sectionTitle}>Events</Text>
        </View>
      </View>
    
     
      

    </ScrollZoomHeader>
    </SafeAreaView>
    
  
  
);
};
const styles = StyleSheet.create({
  container: {
      flex: 1,
      backgroundColor: '#fff',
      padding: 20,
      borderTopLeftRadius:30,
      borderTopRightRadius:30,
      paddingBottom:60,
      shadowColor: 'black',
      shadowOpacity: 0.2,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: -3},
      elevation: 2,
      paddingBottom:1000,

  },
  mainTitle:{
    fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: green ,
      textAlign: 'center',
      textTransform: 'uppercase',


  },


  sectionTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 10,
      color: green ,
      paddingTop: 30,
      
  },
  
  clubContainer: {
      marginRight:10,
      flex: 1,
      width: Dimensions.get('window').width / 2.5,
      height: Dimensions.get('window').height / 2.5,
      justifyContent: 'flex-end',
      borderRadius: 10,
      marginBottom:0,
      
  },



  eventImage: {
    position: 'absolute',
    borderRadius:10,
    top: 0,
    left: 0,
    bottom:0,
    right: 0,
  },

  ClubImage:{
      width: Dimensions.get('window').width *0.9,
      height: 100,
      justifyContent: 'flex-end',
      borderRadius: 10,
      
  },

  box: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
    borderTopLeftRadius:0,
    borderTopRightRadius:0,
    shadowColor: 'black',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2},
    elevation: 2,
    zIndex: 0
  },

  eventTitle: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 12,
  },
});

export default ClubsPage;