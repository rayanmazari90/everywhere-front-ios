import React, { useState, useLayoutEffect, useEffect } from "react";
import { Text, View, Image, StyleSheet, Pressable, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRemoveFriendMutation } from "../../services/appApi";
import { useSelector } from "react-redux";

const RemovefriendItem = ({ friend, onFriendAction }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const userId = user.user._id;
  const [
    removeFriend,
    { isLoading: removeFriendisloading, error: removeFrienderror }
  ] = useRemoveFriendMutation();

  const handleRemoveFriend = async () => {
    try {
      await removeFriend({ userId: userId, receiverId: friend._id });
      onFriendAction(); // Notify parent component
    } catch (error) {
      console.error(error);
    }
  };

  const isUrl = friend.image && friend.image.startsWith("http");

  return (
    <View style={styles.container}>
      {isUrl ? (
        <Image source={{ uri: friend.image }} style={styles.image} />
      ) : (
        <Image
          source={{ uri: `data:image/png;base64,${friend.image}` }}
          style={styles.image}
        />
      )}

      <View style={styles.content}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={styles.name}>
            {friend.name}
          </Text>
          <Button title="Remove Friend" onPress={handleRemoveFriend} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginHorizontal: 10,
    marginVertical: 5,
    height: 70
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10
  },
  content: {
    flex: 1,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "lightgray",
    justifyContent: "center"
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  name: {
    flex: 1,
    fontWeight: "bold"
  },
  invitationSentContainer: {
    flexDirection: "row",
    alignItems: "center"
  },
  invitationSentText: {
    marginRight: 10
  },
  iconContainer: {
    marginLeft: 10
  }
});

export default RemovefriendItem;
