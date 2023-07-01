import React, { useState, useEffect } from "react";
import appApi, {
  useClubsgetMutation,
  useEventsgetMutation
} from "./../services/appApi";
import { green, darkGreen } from "../components/Constant_color";
import EventsPage from "./EventsPage";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
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
  Modal,
  Button
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import ScrollZoomHeader from "react-native-header-zoom-scroll";

const EventCarousel = () => {
  const [clubsget, { isLoading: clubsIsLoading, error: clubsError }] =
    useClubsgetMutation();
  const [eventsget, { isLoading: eventsIsLoading, error: eventsError }] =
    useEventsgetMutation();
  const [ClubsArr, setClubsArr] = useState([]);
  const [EventsArr, setEventsArr] = useState([]);
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const [filterType, setFilterType] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  //creating the filtering component
  const filterEvents = (events, filterType) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);
    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(today.getDate() + 7);
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 7);

    switch (filterType) {
      case "Today":
        return events.filter((event) => {
          const eventDate = new Date(event.dateAndHour);
          const isToday = eventDate >= today && eventDate < tomorrow;
          return isToday;
        });
      case "Tomorrow":
        return events.filter((event) => {
          const eventDate = new Date(event.dateAndHour);
          const isTomorrow = eventDate >= tomorrow && eventDate < nextWeekStart;
          return isTomorrow;
        });
      case "This week":
        return events.filter((event) => {
          const eventDate = new Date(event.dateAndHour);
          const isThisWeek = eventDate >= tomorrow && eventDate < nextWeekStart;
          return isThisWeek;
        });
      case "Next week":
        return events.filter((event) => {
          const eventDate = new Date(event.dateAndHour);
          const isNextWeek =
            eventDate >= nextWeekStart && eventDate < nextWeekEnd;
          return isNextWeek;
        });
      case "Later":
        return events.filter((event) => {
          const eventDate = new Date(event.dateAndHour);
          const isLater = eventDate >= nextWeekEnd;
          return isLater;
        });
      default:
        return events;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await clubsget();
        setClubsArr(response.data);
      } catch (err) {
        console.error(err);
        setMessage("Try again");
      }
    };
    fetchData();
  }, [clubsget]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await eventsget();
        setEventsArr(response.data);
      } catch (err) {
        console.error(err);
        setMessage("Try again");
      }
    };
    fetchData();
  }, [eventsget]);
  const midpoint = Math.floor(EventsArr.length / 2);
  const eventsForYou = EventsArr.slice(0, midpoint);
  const moreEvents = EventsArr.slice(midpoint);
  const Clubs = ClubsArr;

  const [searchText, setSearchText] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const filteredEventsForYou = eventsForYou.filter((event) =>
    event.eventName.toLowerCase().includes(searchText.toLowerCase())
  );

  const filteredMoreEvents = moreEvents.filter((event) =>
    event.eventName.toLowerCase().includes(searchText.toLowerCase())
  );
  const filterClubs = Clubs.filter((event) =>
    event.clubname.toLowerCase().includes(searchText.toLowerCase())
  );

  const renderEvent = (event) => {
    return (
      <View style={styles.eventContainer} key={"event-" + event._id}>
        <TouchableOpacity
          onPress={() => navigation.navigate("EventsPage", { event: event })}
        >
          <ImageBackground
            style={styles.eventImage}
            imageStyle={styles.eventImage}
            source={{ uri: event.image }}
          >
            <View style={styles.box}>
              <Text style={styles.eventTitle}>{event.eventName}</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  const renderClub = (event) => {
    return (
      <View style={styles.ClubContainer} key={event._id}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ClubsPage", { club: event })}
        >
          <ImageBackground
            style={styles.ClubImage}
            imageStyle={styles.ClubImage}
            source={{ uri: event.background }}
          >
            <View style={styles.box}>
              <Text style={styles.eventTitle}>{event.clubname}</Text>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  const renderEventsForYou = () => {
    const events = filterEvents(eventsForYou, filterType);

    if (isSearchFocused) {
      return events
        .filter((event) =>
          event.eventName.toLowerCase().includes(searchText.toLowerCase())
        )
        .map((event, index) => renderEvent(event, index));
    } else {
      return events.map((event, index) => renderEvent(event, index));
    }
  };

  const renderMoreEvents = () => {
    const events = filterEvents(moreEvents, filterType);

    if (isSearchFocused) {
      return events
        .filter((event) =>
          event.eventName.toLowerCase().includes(searchText.toLowerCase())
        )
        .map((event, index) => renderEvent(event, index));
    } else {
      return events.map((event, index) => renderEvent(event, index));
    }
  };

  const renderClubs = () => {
    if (isSearchFocused) {
      return filterClubs.map((event, index) => renderClub(event, index));
    } else {
      return Clubs.map((event, index) => renderClub(event, index));
    }
  };

  return (
    <SafeAreaView>
      <ScrollZoomHeader
        showsVerticalScrollIndicator={true}
        smallHeaderHeight={0}
        headerHeight={200}
        backgroundHeaderComponent={
          <Image
            source={require("../assets/background.png")}
            style={{
              padding: 0,
              margin: 0,
              width: "100%",
              height: "100%",
              resizeMode: "contain"
            }}
          />
        }
      >
        <View style={styles.container}>
          <View style={styles.filters}>
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
            <Modal
              visible={isModalVisible}
              transparent={true}
              animationType="slide"
            >
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center"
                }}
              >
                <View
                  style={{
                    backgroundColor: "white",
                    padding: 20,
                    borderRadius: 20
                  }}
                >
                  <Text
                    style={{
                      color: green,
                      textAlign: "center",
                      fontSize: 17,
                      paddingBottom: 13
                    }}
                  >
                    Select filter
                  </Text>
                  <Button
                    title="Today"
                    style={{ textAlign: "center" }}
                    onPress={() => {
                      setFilterType("Today");
                      toggleModal();
                    }}
                  />
                  <Button
                    title="Tomorrow"
                    onPress={() => {
                      setFilterType("Tomorrow");
                      toggleModal();
                    }}
                  />
                  <Button
                    title="This week"
                    onPress={() => {
                      setFilterType("This week");
                      toggleModal();
                    }}
                  />
                  <Button
                    title="Next week"
                    onPress={() => {
                      setFilterType("Next week");
                      toggleModal();
                    }}
                  />
                  <Button
                    title="Later"
                    onPress={() => {
                      setFilterType("Later");
                      toggleModal();
                    }}
                  />
                  <TouchableOpacity
                    onPress={toggleModal}
                    style={{ padding: 10 }}
                  >
                    <Text
                      style={{
                        color: green,
                        textAlign: "center",
                        paddingTop: 10
                      }}
                    >
                      Close
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

            <TouchableOpacity
              onPress={toggleModal}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#f1f1f1",
                borderRadius: 10,
                padding: 10,
                marginLeft: 10 // to separate it from the searchBar
              }}
            >
              <MaterialCommunityIcons
                style={{ position: "relative" }}
                name="filter-variant"
                size={20}
                color={darkGreen}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Events For You</Text>
            <FlatList
              data={renderEventsForYou()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => item}
              keyExtractor={(item) =>
                item.id ? item.id.toString() : Math.random().toString()
              }
            />
          </View>
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>More Events</Text>
            <FlatList
              data={renderMoreEvents()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => item}
              keyExtractor={(item) =>
                item.id ? item.id.toString() : Math.random().toString()
              }
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
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingBottom: 60,
    shadowColor: "black",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: -3 },
    elevation: 2
  },
  searchBar: {
    flex: 9,
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,

    height: "100%" // fill the parent height
  },
  searchInput: {
    fontSize: 16,
    fontWeight: "bold",
    justifyContent: "center" // Add this
  },
  sectionContainer: {
    marginBottom: 30
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: green
  },
  eventContainer: {
    marginRight: 10
  },
  ClubContainer: {
    marginRight: 10,
    paddingBottom: 20
  },
  eventImage: {
    width: Dimensions.get("window").width / 2.5,
    height: 150,
    justifyContent: "flex-end",
    borderRadius: 10
  },

  ClubImage: {
    width: Dimensions.get("window").width * 0.9,
    height: 150,
    justifyContent: "flex-end",
    borderRadius: 10
  },

  box: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 10,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
    shadowColor: "black",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2
  },
  eventTitle: {
    color: "black",
    fontWeight: "bold",
    fontSize: 16
  },
  filters: {
    flexDirection: "row",
    marginBottom: 20
  }
});

export default EventCarousel;
