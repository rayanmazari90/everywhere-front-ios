import React, { cloneElement } from "react";
import { View, FlatList, Image, Text, StyleSheet } from "react-native";
import { useGetFriendsWithSameTicketQuery } from "../services/appApi";

const FriendListItemTickets = ({ userId, ticketId }) => {
  const { data: friendsData, isLoading } = useGetFriendsWithSameTicketQuery({
    userId,
    ticketId,
  });

  if (isLoading) return <Text>Loading...</Text>;

  return (
    <FlatList
      data={friendsData}
      horizontal
      scrollEnabled={true}
      showsHorizontalScrollIndicator={true}
      keyExtractor={(item) => item._id}
      contentContainerStyle={styles.friendListContainer}
      renderItem={({ item }) => (
        <View style={styles.friendItem}>
          <Image
            style={styles.friendImage}
            source={{ uri: `data:image/jpeg;base64,${item.image}` }}
          />
          <Text style={styles.friendName}>{item.name}</Text>
        </View>
      )}
    />
  );
};
const styles = StyleSheet.create({
  friendItem: {
    alignItems: "center",
    marginRight: 10, // Add some separation between friend items
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 10,
  },
  friendImage: {
    width: 50, // Adjust as necessary
    height: 50, // Adjust as necessary
    borderRadius: 25, // half the width and height to make it round
  },
  friendName: {
    marginTop: 6, // Add some space between the image and the name
  },
});
export default FriendListItemTickets;
