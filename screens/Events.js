import React, { useState } from 'react';
import { green } from '../components/Constants';

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


const eventsForYou = [
  { id: 1, title: 'Los Pandas', image: 'https://panda-events.com/wp-content/uploads/2018/06/agence.jpg' },
  { id: 2, title: 'Amadeux', image: 'https://cdn.wegow.com/media/events/thanksgiving-at-amadeux/thanksgiving-at-amadeux-1667810699.313348.jpg' },
  { id: 3, title: 'Kapitales', image: 'https://madridlux.com/uploads/images/events/8/x528.webp?v=63798588494' },
  // Add more events as needed
];

const moreEvents = [
  {id: 4,title: 'Meet and Dance',image:'https://cdn.premiumguest.com/flyers/w_banners-icon-agosto-2022-meet-and-dance.jpg',},
  { id: 5, title: 'Bardot Events', image: 'https://scontent.fmad19-1.fna.fbcdn.net/v/t39.30808-1/295463409_452221323581757_7169847205177968670_n.jpg?stp=cp0_dst-jpg_e15_p120x120_q65&_nc_cat=111&ccb=1-7&_nc_sid=dbb9e7&_nc_ohc=aJy0hR-dvQAAX8i3ZJO&_nc_ht=scontent.fmad19-1.fna&oh=00_AfCKwgidLC7pGur4xuuD0lWBOq3IVQ5s1XJ1QsMXrJqaKg&oe=643386D4' },
  { id: 6, title: 'Event 6', image: 'https://picsum.photos/200/300' },
  // Add more events as needed
];

const Clubs = [
    {id: 7,title: 'Liberty',image:'https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2018/03/21/15216321914946.jpg',},
    { id: 8, title: 'Icon', image: 'https://discotecasgratis.com/img/uploads/Property/26/PropertyPicture/large/1568024804_icon.jpg' },
    { id: 9, title: 'Toyroom', image: 'https://phantom-elmundo.unidadeditorial.es/30419efcd028a74219e4308588fba1ba/crop/89x37/2879x1606/resize/746/f/webp/assets/multimedia/imagenes/2022/09/21/16637140980224.jpg' },
    // Add more events as needed
];



const EventCarousel = () => {
  const [searchText, setSearchText] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredEventsForYou = eventsForYou.filter((event) =>
    event.title.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredMoreEvents = moreEvents.filter((event) =>
    event.title.toLowerCase().includes(searchText.toLowerCase())
  );
  const filterClubs = Clubs.filter((event) =>
    event.title.toLowerCase().includes(searchText.toLowerCase())
  );


  const renderEvent = (event) => {
    return (
        <View style={styles.eventContainer} key={'event-' + event.id}>
        <ImageBackground
          style={styles.eventImage}
          imageStyle={styles.eventImage}
          source={{ uri: event.image }}
        >
          <View style={styles.box}>
            <Text style={styles.eventTitle}>{event.title}</Text>
          </View>
        </ImageBackground>
      </View>
    );
  };

  const renderClub = (event) => {
    return (
        <View style={styles.ClubContainer} key={event.id}>
        <ImageBackground
          style={styles.ClubImage}
          imageStyle={styles.ClubImage}
          source={{ uri: event.image }}
        >
          <View style={styles.box}>
            <Text style={styles.eventTitle}>{event.title}</Text>
          </View>
        </ImageBackground>
      </View>
    );
  };

  const renderEventsForYou = () => {
    if (isSearchFocused) {
      return filteredEventsForYou.map((event, index) => renderEvent(event, index));
    } else {
      console.log('eventsForYou:', eventsForYou);
      return eventsForYou.map((event, index) => renderEvent(event, index));
    }
  };
  
  const renderMoreEvents = () => {
    if (isSearchFocused) {
      return filteredMoreEvents.map((event, index) => renderEvent(event, index));
    } else {
      console.log('moreEvents:', moreEvents);
      return moreEvents.map((event, index) => renderEvent(event, index));
    }
  };

  const renderClubs = () => {
    if (isSearchFocused) {
      return filterClubs.map((event, index) => renderClub(event, index));
    } else {
      console.log('Clubs:', Clubs);
      return Clubs.map((event, index) => renderClub(event, index));
    }
  };

  return (
    
    

    <SafeAreaView >
    
    <ScrollZoomHeader
        showsVerticalScrollIndicator={true}
        smallHeaderHeight={
          0
        }
        
        headerHeight={200}
        backgroundHeaderComponent={
          <Image
            source={require("../assets/background.png")}
            style={{
                padding:0,
                margin:0,
              width: '100%',
              height: '100%',
              resizeMode: 'contain'
            }}
          />
        }
      >
    <View style={styles.container}> 
        <View style={styles.searchBar}>
        <TextInput
            style={styles.searchInput}
            placeholder="Search events"
            onChangeText={setSearchText}
            value={searchText}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(true)}
        />
        </View>
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Events For You</Text>
            <FlatList
            data={renderEventsForYou()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => item}
            keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
            />
        </View>
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>More Events</Text>
            <FlatList
            data={renderMoreEvents()}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => item}
            keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
            />
        </View>
        <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Clubs</Text>
            {renderClubs()}
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

},
searchBar: {
backgroundColor: '#f1f1f1',
borderRadius: 10,
paddingHorizontal: 10,
paddingVertical: 5,
marginTop: 0,
marginBottom:30,
},
searchInput: {
fontSize: 16,
fontWeight: 'bold',

},
sectionContainer: {
marginBottom: 30,

},
sectionTitle: {
fontSize: 24,
fontWeight: 'bold',
marginBottom: 10,
color: green ,
},
eventContainer: {
marginRight: 10,
},
ClubContainer:{
    marginRight: 10,
    paddingBottom: 20,
},
eventImage: {
width: Dimensions.get('window').width / 2.5,
height: 150,
justifyContent: 'flex-end',
borderRadius: 10,
},

ClubImage:{
    width: Dimensions.get('window').width *0.9,
    height: 150,
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
},
eventTitle: {
color: 'black',
fontWeight: 'bold',
fontSize: 16,
},
});

export default EventCarousel;


/*import React from 'react';
import { View, Text, ScrollView, FlatList, StyleSheet, Image, Dimensions, ImageBackground } from 'react-native';

const eventsForYou = [
  { id: 1, title: 'Event 1', image: 'https://picsum.photos/200/300' },
  { id: 2, title: 'Event 2', image: 'https://picsum.photos/200/300' },
  { id: 3, title: 'Event 3', image: 'https://picsum.photos/200/300' },
  // Add more events as needed
];

const moreEvents = [
  { id: 4, title: 'Event 4', image: 'https://e00-elmundo.uecdn.es/assets/multimedia/imagenes/2018/03/21/15216321914946.jpg' },
  { id: 5, title: 'Event 5', image: 'https://picsum.photos/200/300' },
  { id: 6, title: 'Event 6', image: 'https://picsum.photos/200/300' },
  // Add more events as needed
];

const EventCarousel = () => {
    const renderItem = ({ item }) => {
      return (
        <View style={styles.eventContainer}>
          <Text style={styles.eventTitle}>{item.title}</Text>
          <Image style={styles.eventImage} source={{ uri: item.image }} />
        </View>
      );
    };
  
    return (
    <ScrollView vertical={true}>

      <View style={styles.container}>
        <Text style={styles.title}>For You</Text>
        <ScrollView horizontal={true}>
          {eventsForYou.map((event) => (
            <View style={styles.eventContainer} key={event.id}>
              <ImageBackground  style={styles.eventImage} imageStyle={styles.eventImage} source={{ uri: event.image }} >
                <View style={styles.box}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                </View>
              </ImageBackground >
            </View>
          ))}
        </ScrollView>

        <View style={styles.moreEventsContainer}>
          <Text style={styles.title}>More</Text>
          <ScrollView horizontal={true}>
          {moreEvents.map((event) => (
            <View style={styles.eventContainer} key={event.id}>
              <ImageBackground  style={styles.eventImage} imageStyle={styles.eventImage} source={{ uri: event.image }} >
                <View style={styles.box}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                </View>
              </ImageBackground >
            </View>
          ))}
        </ScrollView>
        </View>
        
      </View>
      </ScrollView>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: Dimensions.get('window').height*0.1,
      marginLeft: Dimensions.get('window').width*0.03,
      
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    eventContainer: {
      marginRight: 10,
    },
    eventTitle: {
      fontSize: 16,
      marginBottom: 10,
    },
    eventImage: {
      width: 150,
      height: 150,
      resizeMode: 'cover',
      borderRadius: 10,
    },
    box: {
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'white',
        width: '100%',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
      },

  });
  
  export default EventCarousel;
  */
