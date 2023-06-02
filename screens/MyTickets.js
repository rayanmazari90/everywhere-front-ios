import React, { useState, useEffect } from "react";
import { green, darkGreen } from "../components/Constant_color";

import {
  StyleSheet,
  Text,
  View,
  Animated,
  SafeAreaView,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Image,
  Easing,
} from "react-native";
import { useSelector } from "react-redux";
import { useUserCurrentTicketsByuseridGetQuery } from "../services/appApi";
import qr from "../assets/qrcode.png";
import FriendListItemTickets from "../components/FriendListItemTickets";

const cardHeight = 250;
const cardTitle = 45;
const cardPadding = 10;
const separationHeight = 20; // Adjust this value to set the separation height

const { height } = Dimensions.get("window");

const MyTickets = () => {
  const user = useSelector((state) => state.user);
  const [y] = useState(new Animated.Value(0));
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [UserTickets, setUserTickets] = useState(null);
  const [user_, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [animation] = useState(new Animated.Value(0));

  useEffect(() => {
    setUser(user);
    // Set isLoading to false when clubs data is available
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  const {
    data: TicketsUserData,
    isLoading: isLoadings,
    isError,
    refetch,
  } = useUserCurrentTicketsByuseridGetQuery(user_ ? user_.user._id : null, {
    enabled: !!user_, // execute the query only when 'clubs' is available
  });

  useEffect(() => {
    if (user_) {
      loadUserTickets(user_.user._id);
    }
  }, [user_]);

  // Inside loadEvents function
  const loadUserTickets = async (userId) => {
    try {
      const { data: TicketsUserData } = await refetch(userId); // manually fetch the events
      setUserTickets(TicketsUserData); // update the state with fetched events
    } catch (error) {
      console.error(error);
    }
  };

  const handleCardPress = (index) => {
    Animated.timing(animation, {
      toValue: (cardHeight - cardTitle) * -index, // animate translateY
      duration: 500, // duration of the animation
      useNativeDriver: false,
      easing: Easing.out(Easing.cubic), // add easing function
    }).start();
    setSelectedIndex(index);
  };

  const renderCard = ({ item, index }) => {
    const inputRange = [0, cardHeight];
    const outputRange = [(cardHeight - cardTitle) * -index, 0];
    const translateY = animation.interpolate({
      inputRange,
      outputRange,
      extrapolate: "clamp",
    });
    const cardStyle = [
      styles.card,
      { backgroundColor: "white" },
      selectedIndex === index && {
        marginBottom: cardHeight - separationHeight,
      },
    ];

    return (
      <TouchableOpacity
        onPress={() => handleCardPress(index)}
        activeOpacity={0.9}
      >
        <Animated.View style={[cardStyle, { transform: [{ translateY }] }]}>
          <View style={styles.cardContent}>
            <View key={item._id}>
              <Text style={styles.ticketType}>{item.ticketType}</Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Text style={styles.ticketExpiration}>Event Name </Text>
                <Text style={styles.ticketName}>{item.event.name}</Text>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Text style={styles.ticketExpiration}>Client Name </Text>
                <Text style={styles.ticketName}>{user_.user.name}</Text>
              </View>
              <Text style={styles.ticketDescription}>{item.description}</Text>
              <View style={styles.qrContainer}>
                <Image style={styles.qrImage} source={qr} />
              </View>
              <View style={styles.FriendsFormat}>
                <Text style={styles.ticketExpiration}>Friends Attending</Text>
                <FriendListItemTickets
                  userId={user_.user._id}
                  ticketId={item._id}
                />
              </View>
            </View>
          </View>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <FlatList
          data={UserTickets}
          renderItem={renderCard}
          keyExtractor={(item, index) => index.toString()}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    margin: 16,
  },
  container: {
    flex: 1,
  },
  card: {
    height: "auto",
    borderRadius: 10,
    backgroundColor: "#ffffff", // color of the box, change it to your preference
    shadowColor: "#000000", // shadow color
    shadowOffset: {
      width: 0,
      height: 2, // shadow will be on bottom of the box
    },
    shadowOpacity: 0.25, // shadow density
    shadowRadius: 3.84, // blur radius of the shadow
    elevation: 5, // for Android
  },
  cardContent: {
    flex: 1,
    flexDirection: "column", // add this line
    justifyContent: "space-between", // Add this line to evenly distribute the space
  },
  ticketContainer: {
    flex: 3,
    padding: 10,
    margin: 10,
    borderRadius: 20,
    backgroundColor: "#ffffff", // color of the box, change it to your preference
    shadowColor: "#000000", // shadow color
    shadowOffset: {
      width: 0,
      height: 2, // shadow will be on bottom of the box
    },
    shadowOpacity: 0.25, // shadow density
    shadowRadius: 3.84, // blur radius of the shadow
    elevation: 5, // for Android
  },
  ticketType: {
    padding: 5,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: green,
  },
  ticketExpiration: {
    color: darkGreen,
    fontWeight: "bold",
    padding: 5,
    flex: 1,
  },
  ticketName: {
    color: "black",
    fontWeight: "bold",
    padding: 5,
    flex: 1,
  },
  ticketDescription: {
    padding: 5,
    //fontWeight: 'bold',
  },
  qrContainer: {
    height: 100,
    width: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  qrImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
    left: "110%",
  },
});

export default MyTickets;
