import React, { useState, useEffect, useCallback } from "react";
import { green, darkGreen } from "../components/Constant_color";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Image,
  TouchableWithoutFeedback,
  Modal, // Import the Modal component
  RefreshControl
} from "react-native";
import { useSelector } from "react-redux";
import { useUserCurrentTicketsByuseridGetQuery } from "../services/appApi";
import qr from "../assets/qrcode.png";
import FriendListItemTickets from "../components/FriendListItemTickets";

const MyTickets = () => {
  const user = useSelector((state) => state.user);
  const [UserTickets, setUserTickets] = useState(null);
  const [user_, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  // Step 3: Implement function to handle refreshing
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    if (user_) {
      loadUserTickets(user_.user._id).then(() => setRefreshing(false)); // End refreshing when the data is updated
    }
  }, [user_]);

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
    refetch
  } = useUserCurrentTicketsByuseridGetQuery(user_ ? user_.user._id : null, {
    enabled: !!user_ // execute the query only when 'clubs' is available
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

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // New function to handle bar press
  const handleBarPress = (item) => {
    setSelectedTicket(item);
    setModalVisible(true);
  };

  const renderBar = ({ item }) => {
    console.log(item);

    return (
      <>
        <TouchableOpacity
          style={styles.barContainer}
          onPress={() => handleBarPress(item)}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              height: 100
            }}
          >
            <Image
              source={{ uri: item.image }}
              style={{ width: "20%", height: "60%" }} // replace with your desired dimensions
              resizeMode="cover"
              onError={(e) => {
                console.log("Image loading error: ", e);
              }}
            />
            <Text style={styles.ticketName}>{item.event.name}</Text>
          </View>
        </TouchableOpacity>
      </>
    );
  };

  const renderCard = ({ item }) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <View key={item._id}>
            <Text style={styles.ticketType}>{item.ticketType}</Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%"
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
                width: "100%"
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
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.container}>
        <FlatList
          data={UserTickets}
          renderItem={renderBar} // Replace renderCard with renderBar
          keyExtractor={(item, index) => index.toString()}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <TouchableOpacity
            style={styles.centeredView}
            activeOpacity={1}
            onPressOut={() => setModalVisible(false)}
          >
            <TouchableWithoutFeedback>
              {selectedTicket && renderCard({ item: selectedTicket })}
            </TouchableWithoutFeedback>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    margin: 16
  },
  container: {
    flex: 1
  },
  card: {
    height: "60%",
    width: "90%",
    borderRadius: 10,
    backgroundColor: "#ffffff", // color of the box, change it to your preference
    shadowColor: "#000000", // shadow color
    shadowOffset: {
      width: 0,
      height: 2 // shadow will be on bottom of the box
    },
    shadowOpacity: 0.25, // shadow density
    shadowRadius: 3.84, // blur radius of the shadow
    elevation: 5 // for Android
  },
  cardContent: {
    flex: 1,
    flexDirection: "column", // add this line
    justifyContent: "space-between", // Add this line to evenly distribute the space
    pading: 10
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
      height: 2 // shadow will be on bottom of the box
    },
    shadowOpacity: 0.25, // shadow density
    shadowRadius: 3.84, // blur radius of the shadow
    elevation: 5 // for Android
  },
  ticketType: {
    padding: 5,
    textTransform: "uppercase",
    fontWeight: "bold",
    color: green
  },
  ticketExpiration: {
    color: darkGreen,
    fontWeight: "bold",
    padding: 5,
    flex: 1
  },
  ticketName: {
    color: green,
    fontWeight: "bold",
    padding: 5,
    flex: 1
  },
  ticketDescription: {
    padding: 5
    //fontWeight: 'bold',
  },
  qrContainer: {
    height: 100,
    width: 100,
    justifyContent: "center",
    alignItems: "center"
  },
  qrImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
    justifyContent: "center",
    alignItems: "center",
    left: "110%"
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)" // you can adjust the opacity as you need
  },

  modalView: {
    width: "90%", // adjust as needed
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },

  // New style for the bar
  barContainer: {
    height: "60%", // Adjust the height of the bar as you like
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
    backgroundColor: "white", // Change the color as per your preference
    justifyContent: "center",
    paddingLeft: 10, // Space from left, adjust as needed
    marginVertical: 5, // Space between bars, adjust as needed
    width: "98%",
    shadowColor: "#000000", // shadow color
    shadowOffset: {
      width: 0,
      height: 2 // shadow will be on bottom of the box
    },
    shadowOpacity: 0.25, // shadow density
    shadowRadius: 3.84, // blur radius of the shadow
    elevation: 5 // for Android
  }
});

export default MyTickets;
