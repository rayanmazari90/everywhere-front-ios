import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Animated,
  Easing,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
//const TicketScreen = ({ ticketStatus })
import { green, darkGreen } from "../components/Constant_color";
import { useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTicketsByUserPostMutation } from "../services/appApi";

const TicketsPage = () => {
  const fontSize = 15;
  const icon_size = 20;
  const route = useRoute();
  const navigation = useNavigation();
  const user_ = useSelector((state) => state.user);
  const [event, setEvent] = useState(null);
  const [ticket, setTicket] = useState(null);
  const [ticketStatus, setTicketStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fadeAnim] = useState(new Animated.Value(0)); // Initial value for opacity
  const handleBackPress = () => {
    setTimeout(() => {
      navigation.goBack();
    }, 0);
  };

  // Create an instance of your mutation
  const [executeMutation, { data, isMutating, isError }] =
    useTicketsByUserPostMutation();
  useEffect(() => {
    if (ticket && user_ && event) {
      console.log("wait a minute ", ticket._id);
      executeMutation({
        eventId: event._id,
        userId: user_.user._id,
        ticketId: ticket._id
      })
        .then((result) => {
          console.log("here is the result", result); // log the result
          setTicketStatus(result.data.ticketstate);
        })
        .catch((error) => {
          console.error(error); // log any error
        });
    }
  }, [ticket, user_, event, executeMutation]);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1300,
      easing: Easing.ease,
      useNativeDriver: true
    }).start();
  }, [fadeAnim]);

  useEffect(() => {
    setTicket(route.params.ticket);
    setEvent(route.params.event);
    // Set isLoading to false when clubs data is available
    if (route.params.event && route.params.ticket) {
      setIsLoading(false);
    }
  }, [route.params.event, route.params.ticket]);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={darkGreen} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      {ticketStatus ? (
        <>
          <Animated.View style={{ opacity: fadeAnim }}>
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={50}
              color="green"
            />
          </Animated.View>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={{ textAlign: "center", fontSize: 16, marginTop: 20 }}>
              Good job! You got your ticket! Now get ready to party!
            </Text>
          </Animated.View>
        </>
      ) : (
        <>
          <Animated.View style={{ opacity: fadeAnim }}>
            <MaterialCommunityIcons
              name="close-circle-outline"
              size={50}
              color="red"
            />
          </Animated.View>
          <Animated.View style={{ opacity: fadeAnim }}>
            <Text style={{ textAlign: "center", fontSize: 16, marginTop: 20 }}>
              Sorry, there is no more ticket left for you!{" "}
            </Text>
            <Text style={{ textAlign: "center", fontSize: 16, marginTop: 10 }}>
              Try next time!
            </Text>
          </Animated.View>
        </>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff"
  }
});

export default TicketsPage;
