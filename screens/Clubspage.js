


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
import React, { useState ,useEffect} from 'react';
import { green,darkGreen } from '../components/Constant_color';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import ScrollZoomHeader from 'react-native-header-zoom-scroll';




const ClubsPage = () => {
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const gray = '#CCCCCC';
  const fontSize =15;
  const icon_size= 20;
  const route= useRoute();
  const navigation = useNavigation();
  const [clubs, setClubs] = useState(null);

  const handleBackPress = () => {
    console.log("goBack");
    setTimeout(() => {
      navigation.goBack();
    }, 0);
  };
  
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
        setClubs(route.params.club);
        // Set isLoading to false when clubs data is available
        if (route.params.club) {
          setIsLoading(false);
        }
      }, [route.params.club]);
      
  const renderDay = (day) => {
    if (!clubs) {
      return null;
    }
    const dayColor = clubs.days_open.includes(day) ? "white" : gray;
    const fontWeight = clubs.days_open.includes(day) ? 'bold' : 'normal';
    const shortDay = day.slice(0, 3);
    return (
      <View style={{ padding: 5 }} key={day}>
        <Text style={{ color: dayColor, fontWeight: fontWeight }}>{shortDay}</Text>
      </View>
    );
  };
  const today = new Date();
  const todayDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);

  // Check if the club is open today
  const isOpenToday = clubs && clubs.days_open.includes(todayDay);
  console.log(isOpenToday, todayDay )

  const renderClubVideo = (video,  index) => {
    return (
        <View style={styles.clubContainer} key={'club-' + clubs._id+ '-video-' + index}>
          <Video
            source={{ uri: video.image }}
            muted={true}
            repeat={true}
            resizeMode='cover'
            rate={1.0}
            ignoreSilentSwitch='obey'
            style={styles.eventImage}
          />
          <View style={styles.box}>
            <Text style={styles.eventTitle}> {video.day} - {video.hours} </Text>
          </View>
        </View>
        

    );
  };
    
  const renderClubVideos = () => {
      return clubs.videos.map((video, index) => renderClubVideo(video, index));
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={darkGreen} />
      </View>
    );
  }

  return (
    
    <SafeAreaView  >
    <ScrollZoomHeader
        showsVerticalScrollIndicator={false}
        smallHeaderHeight={
          0
        }
        headerHeight={250}
        backgroundHeaderComponent={
          <Image
            source={{url:clubs.background}}
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
                  <Text style={styles.mainTitle}>{clubs.clubname}</Text>
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
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons
                    style={{ position: 'static' }}
                    name="fire"
                    size={icon_size}
                    color={darkGreen}
                  />
                  <Text style={{ fontSize: fontSize }}>
                    <Text style={{ fontWeight: 'bold', color: darkGreen }}> Status:</Text>{" "}
                    <Text style={{ padding: 0, color: isOpenToday ? "green" : "red" }}>
                      {isOpenToday ? "Open" : "Closed"}
                    </Text>
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                  <MaterialCommunityIcons
                    style={{ position: 'static' }}
                    name="map-marker"
                    size={icon_size}
                    color={darkGreen}
                  />
                  <Text style={{ padding: 0, fontSize: fontSize }}>
                    <Text style={{ fontWeight: 'bold', color: darkGreen }}> Location </Text>{" "}
                    {clubs.location}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                  <MaterialCommunityIcons
                    style={{ position: 'static' }}
                    name="party-popper"
                    size={icon_size}
                    color={darkGreen}
                  />
                  <Text style={{ padding: 0, fontSize: fontSize }}>
                    <Text style={{ fontWeight: 'bold', color: darkGreen }}>
                      {" "}
                      Hours of opening{" "}
                    </Text>
                    {clubs.hours.startTime} - {clubs.hours.endTime}
                  </Text>
                </View>



                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                    <MaterialCommunityIcons
                      style={{ position: 'static' }}
                      name="calendar-range"
                      size={icon_size}
                      color={darkGreen}
                    />
                    <Text style={{ padding: 0, fontSize: fontSize }}>
                      <Text style={{ fontWeight: 'bold', color: darkGreen }}>
                        {" "}
                        Days open{" "}
                      </Text>
                      
                    </Text>
                    
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', marginTop: 10, borderRadius: 10, backgroundColor: darkGreen, padding: 5 }}>
                        {daysOfWeek.map((day) => renderDay(day))}
                  </View>
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
      position: "relative",
      top: -35,
      backgroundColor: '#fff',
      margin: 0 ,
      padding: 20,
      borderTopLeftRadius:30,
      borderTopRightRadius:30,
      paddingBottom:60,
      shadowColor: 'black',
      shadowOpacity: 0.2,
      shadowRadius: 5,
      shadowOffset: { width: 0, height: -3},
      elevation: 2,
      zIndex: 20,
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
      marginBottom: 30,
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default ClubsPage;