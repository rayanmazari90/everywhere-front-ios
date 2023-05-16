import Video from 'react-native-video';
import React, { useState ,useEffect} from 'react';
import { green,darkGreen } from '../components/Constant_color';
import { useNavigation, useRoute } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTicketsByEventGetQuery } from "../services/appApi";
import { View, Text,StyleSheet, ImageBackground, TouchableOpacity, ActivityIndicator, Dimensions, Image, SafeAreaView } from 'react-native';
import ScrollZoomHeader from 'react-native-header-zoom-scroll';
import { format } from 'date-fns';


const CountdownEvent = ({ eventDate }) => {
  const calculateCountdown = () => {
    const now = new Date();
    const eventTime = new Date(eventDate);

    const totalSeconds = Math.floor((eventTime - now) / 1000);

    const days = Math.floor(totalSeconds / (60 * 60 * 24));
    const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    return { days, hours, minutes, seconds };
  };

  const [countdown, setCountdown] = useState(calculateCountdown());

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={{}}>
     <Text style={styles.sectionTitle}>
      Time left Before Party!
    </Text>
  <View style={{alignItems: 'center' , backgroundColor: darkGreen, borderRadius: 10, padding: 10 }}>
    <Text style={{ color: 'white', fontSize: 18 , fontWeight:'bold'}}>
      {countdown.days} D  {countdown.hours} H  {countdown.minutes} Min  {countdown.seconds} Sec
    </Text>
  </View>
</View>
  );
};







const EventsPage = () => {
  const fontSize =15;
  const icon_size= 20;
  const route= useRoute();
  const navigation = useNavigation();
  const [event, setEvents] = useState(null);
  const [tickets, setTickets] = useState(null);
  const [expiredTickets, setExpiredTickets] = useState({});

  const handleBackPress = () => {
    setTimeout(() => {
      navigation.goBack();
    }, 0);
  };

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
        setEvents(route.params.event);
        // Set isLoading to false when clubs data is available
        if (route.params.event) {
          setIsLoading(false);
        }
  }, [route.params.event]);

  

  // Add a state variable to trigger refetch
  const { data: TicketsData, isLoading: isLoadings, isError, refetch} = useTicketsByEventGetQuery(event ? event._id : null, {
    enabled: !!event, // execute the query only when 'event' is available
  }); // Pass the trigger as a dependency to the hook

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      refetch();
    });
  
    return unsubscribe;
  }, [navigation, refetch]);

  


  useEffect(() => {
    if (TicketsData) {
      setTickets(TicketsData);
    }
  }, [TicketsData]);


  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={darkGreen} />
      </View>
    );
  }
      


  
  const renderTickets = (ticket, event) => {
    const { description, numberOfTicketsLeft, ticketType, timeofexpir } = ticket;

    const isExpired = expiredTickets[ticket._id];

    return (
      <View style={styles.ticketContainer} key={ticket._id}>
        <TouchableOpacity
          onPress={() => isExpired ? {} : navigation.navigate('TicketsPage', { event: event , ticket: ticket})}
          activeOpacity={isExpired ? 1 : 0.2}
          style={isExpired ? {opacity: 0.5} : {}}
        >
          <Text style={styles.ticketType}>{ticketType}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Text style={styles.ticketExpiration}>Time Left </Text>
            <CountdownTickets 
              eventDate={event.dateAndHour} 
              expirationHours={ticket.timeofexpir} 
              onExpire={() => setExpiredTickets(prevState => ({...prevState, [ticket._id]: true}))}
            />
          </View>
          <Text style={styles.ticketDescription}>{description}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
            <Text style={styles.ticketLeft}>Tickets Left: </Text><Text>{numberOfTicketsLeft}</Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const CountdownTickets = ({ eventDate, expirationHours, onExpire }) => {
    const calculateCountdown = () => {
      const now = new Date();
      const eventTime = new Date(eventDate);
      const expirationTime = new Date(eventTime.getTime() - (expirationHours * 60 * 60 * 1000)); // Subtract the hours
  
      const totalSeconds = Math.floor((expirationTime - now) / 1000);
  
      const days = Math.floor(totalSeconds / (60 * 60 * 24));
      const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
      const seconds = Math.floor(totalSeconds % 60);
  
      const isExpired = totalSeconds <= 0;
  
      return { days, hours, minutes, seconds, isExpired };
    };
  
    const [countdown, setCountdown] = useState(calculateCountdown());
  
    useEffect(() => {
      const timer = setInterval(() => {
        const newCountdown = calculateCountdown();
        setCountdown(newCountdown);
        if (newCountdown.isExpired) {
          // Call the onExpire callback if it exists
          if (onExpire) onExpire();
        }
      }, 1000);
  
      return () => clearInterval(timer);
    }, [onExpire]);
  
    // If the countdown is expired, show a different message
    if (countdown.isExpired) {
      return (
        <Text>Ticket expired</Text>
      );
    }
  
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center', maxWidth: '100%' }}>
      <View style={{ backgroundColor: 'white', borderRadius: 10, padding: 5 ,shadowColor: '#000000', shadowOffset: {width: 0,height: 2,},shadowOpacity: 0.25,shadowRadius: 3.84, elevation: 5}}>
        <Text style={{ color: 'black', fontSize: 14, textAlign: 'center' }}>
          {countdown.days} D  {countdown.hours} H  {countdown.minutes} Min 
        </Text>
      </View>
    </View>
    );
  };


  return (
    
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollZoomHeader
        showsVerticalScrollIndicator={false}
        smallHeaderHeight={0}
        headerHeight={250}
        backgroundHeaderComponent={
          <Image
            source={{ uri: event.image }}
            style={{
                padding: 0,
                margin: 0,
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
                  <Text style={styles.mainTitle}>{event.eventName}</Text>
            <View style={styles.underline}></View>
           <Text style={styles.sectionTitle}>Description</Text>
              <View style={{ flexDirection: 'column', justifyContent: 'flex-start'}}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons
                    style={{ position: 'relative' }}
                    name="fire"
                    size={icon_size}
                    color={darkGreen}
                  />
                  <Text style={{ fontWeight: 'bold', color: darkGreen, fontSize: fontSize }}> Event Name: <Text style={{ padding: 0, color: 'black'}}>{event.eventName}</Text></Text>
                  
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                  <MaterialCommunityIcons
                    style={{ position: 'relative' }}
                    name="map-marker"
                    size={icon_size}
                    color={darkGreen}
                  />
                  <Text style={{ padding: 0, fontSize: fontSize }}>
                    <Text style={{ fontSize: fontSize }}>
                    <Text style={{ fontWeight: 'bold', color: darkGreen }}> Club: <Text style={{ padding: 0, color: 'black'}}>{event.club.name}</Text></Text>
                  </Text>
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
                  <Text style={{ fontWeight: 'bold', color: darkGreen }}> Date: <Text style={{ padding: 0, color: 'black'}}>{new Date(event.dateAndHour).getDate() + ' ' + new Date(event.dateAndHour).toLocaleString('default', { month: 'long' })}</Text></Text>
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                  <MaterialCommunityIcons
                    style={{ position: 'relative' }}
                    name="account-group"
                    size={icon_size}
                    color={darkGreen}
                  />
                  <Text style={{ padding: 0, fontSize: fontSize }}>
                  <Text style={{ fontWeight: 'bold', color: darkGreen }}> Number of Particpants: <Text style={{ padding: 0, color: 'black'}}>{event.numberOfParticipants}</Text></Text>
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                  <MaterialCommunityIcons
                    style={{ position: 'relative' }}
                    name="ticket-confirmation"
                    size={icon_size}
                    color={darkGreen}
                  />
                  <Text style={{ padding: 0, fontSize: fontSize }}>
                  <Text style={{ fontWeight: 'bold', color: darkGreen }}> Number of Tickets Left: <Text style={{ padding: 0, color: 'black'}}>{event.numberOfTicketsLeft}</Text></Text>
                  </Text>
                </View>

                <View style={{marginTop: 30 }}>
                <CountdownEvent eventDate={event.dateAndHour} />
                </View>
              <View style={{marginTop: 10 }}>
              <Text style={styles.sectionTitle}>Tickets</Text>
              
              {tickets && tickets.map((ticket) => renderTickets(ticket, event))}
              </View>

              
            </View>
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

  ticketContainer:{
    padding:10,
    margin: 10,
    borderRadius: 20,
    backgroundColor: '#ffffff', // color of the box, change it to your preference
    shadowColor: '#000000', // shadow color
    shadowOffset: {
      width: 0,
      height: 2, // shadow will be on bottom of the box
    },
    shadowOpacity: 0.25, // shadow density
    shadowRadius: 3.84, // blur radius of the shadow
    elevation: 5, // for Android
  },
  ticketType:{
    padding:10,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    color: green,
  },
  ticketDescription:{
    padding:10,
    //fontWeight: 'bold',
  },
  ticketExpiration:{
    color: darkGreen,
    fontWeight: 'bold',
    padding:10,
  },
  ticketLeft:{
    color: darkGreen,
    fontWeight: 'bold',
    padding:10,

  },
});

export default EventsPage;