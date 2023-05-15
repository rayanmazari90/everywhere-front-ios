import Video from 'react-native-video';
import React, { useState ,useEffect} from 'react';
import { green,darkGreen } from '../components/Constant_color';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEventsByClubGetQuery } from "../services/appApi";
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
  ImageBackground,
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
  const [events, setEvents] = useState(null);

  const handleBackPress = () => {
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
  const { data: eventsData, isLoading: isLoadings, isError, refetch } = useEventsByClubGetQuery(clubs ? clubs._id : null, {
    enabled: !!clubs, // execute the query only when 'clubs' is available
  });

  useEffect(() => {
    if (clubs) {
      
      loadEvents(clubs._id);
    }
  }, [clubs]);
  
  // Inside loadEvents function
  const loadEvents = async (clubId) => {
    try {
      const { data: eventsData } = await refetch(clubId); // manually fetch the events
      setEvents(eventsData); // update the state with fetched events
    } catch (error) {
      console.error(error);
    }
  };

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
  const renderEvents = (event) => {
    // Parse date string
    const eventDate = new Date(event.dateAndHour);

    // Format the date and month
    const date = eventDate.getDate(); // Day of the month
    const month = eventDate.toLocaleString('default', { month: 'long' }); // Month in text

    return (
        <View style={styles.ClubContainer} key={event._id}>
          <TouchableOpacity
              onPress={() => navigation.navigate('EventsPage', { event: event })}
            >
            <ImageBackground
                style={styles.ClubImage}
                imageStyle={styles.ClubImage}
                source={{ uri: event.image }}
            >
                <View style={styles.overlay}>
                    <Text style={styles.dateTitle}>{date}</Text>
                    <Text style={styles.monthTitle}>{month}</Text>
                </View>
                <View style={styles.box}>
                    <Text style={styles.eventname}>{event.eventName}</Text>
                </View>
                
            </ImageBackground>
          </TouchableOpacity>
        </View>
    );};


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
            position: 'relative',
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
          <MaterialCommunityIcons style={{position: 'relative'}} name="chevron-left" size={30} color={darkGreen}/>
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
              <View style={{ flexDirection: 'column', justifyContent: 'flex-start'}}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons
                    style={{ position: 'relative' }}
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
                    style={{ position: 'relative' }}
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
                    style={{ position: 'relative' }}
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
                      style={{ position: 'relative' }}
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
              {events && events.map(renderEvents)}
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
    top: 0,
    backgroundColor: '#fff',
    margin: 0 ,
    padding: 20,
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    paddingBottom: Dimensions.get('window').height > 800 ? 100 : 60,
    shadowColor: 'black',
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -3},
    elevation: 0,
    zIndex: 0,
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
  ClubImage:{
    width: Dimensions.get('window').width *0.9,
    height: 150,
    justifyContent: 'flex-end',
    borderRadius: 10,
},
ClubContainer:{
  marginRight: 10,
  paddingBottom: 20,
},
dateTitle: {
  fontSize: 16,
  fontWeight: 'bold',
  color: 'white',
  margin: 10,
},
overlay: {
  flex: 1,
  backgroundColor: 'rgba(0, 0, 0, 0.3)',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: 10,
},
dateTitle: {
  color: 'white',
  fontSize: 40,
  textTransform: 'uppercase',
},
monthTitle: {
  color: 'white',
  fontSize: 20,
  textTransform: 'uppercase',
},
eventTitle: {
  color: green,
  fontWeight: 'bold',
  fontSize: 12,
  textAlign: 'center',
  },
  eventname: {
    color: darkGreen,
    fontWeight: 'bold',
    fontSize: 16,
    textTransform: 'uppercase',
    textAlign: 'center',
    },
});

export default ClubsPage;