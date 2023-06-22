import { Text, View, Image, StyleSheet, Pressable } from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigation } from "@react-navigation/native";
import React, { useState, useLayoutEffect, useEffect } from "react";
import { useGetLastMessageMutation } from "../../services/appApi";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useSelector } from "react-redux";
import socket from "../../utils/socket";
dayjs.extend(relativeTime, { threshold: 24 * 60 * 60 }); // show relative time in hours

const ChatListItem = ({ chat }) => {
  const navigation = useNavigation();
  const user = useSelector((state) => state.user);
  const userId = user.user._id;

  const isUnread = () => {
    const lastMessageDate = new Date(chat.lastMessageTimestamp);
    const userAccess = chat.lastAccessed.find(
      (access) => access.userId === userId
    );
    if (userAccess) {
      const lastAccessedDate = new Date(userAccess.timestamp);
      return (
        lastMessageDate > lastAccessedDate && chat.lastMessageSender !== userId
      );
    } else {
      // If the user has never accessed the chat, treat it as unread.
      return true;
    }
  };

  const isUrl = chat.user.image && chat.user.image.startsWith("http");

  return (
    <Pressable
      onPress={() =>
        navigation.navigate("Chat", {
          id: chat._id,
          name: chat.user.name,
          image: chat.user.image,
          members: chat.members,
          event_group_Id: chat.user.id
        })
      }
      style={[styles.container]}
    >
      {isUrl ? (
        <Image source={{ uri: chat.user.image }} style={styles.image} />
      ) : (
        <Image
          source={{ uri: `data:image/png;base64,${chat.user.image}` }}
          style={styles.image}
        />
      )}
      <View style={styles.content}>
        <View style={styles.row}>
          <Text numberOfLines={1} style={styles.name}>
            {chat.user.name}
          </Text>
        </View>
        <Text
          numberOfLines={2}
          style={[styles.subTitle, isUnread() ? styles.unreadText : null]}
        >
          {chat.lastMessage &&
          chat.lastMessage.startsWith(
            "https://everywherestorage.blob.core.windows.net/images"
          ) ? (
            <>
              <FontAwesome5 name="image" style={styles.iconStyle} />
              {"image"}
            </>
          ) : chat.lastMessage &&
            chat.lastMessage.startsWith(
              "https://everywherestorage.blob.core.windows.net/videos/"
            ) ? (
            <>
              <FontAwesome5 name="image" style={styles.iconStyle} />
              {"video"}
            </>
          ) : chat.lastMessage && chat.lastMessage.startsWith("https") ? (
            <>
              <FontAwesome5 name="image" style={styles.iconStyle} />
              {"GIF"}
            </>
          ) : (
            chat.lastMessage
          )}
        </Text>
      </View>
    </Pressable>
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
    borderBottomColor: "lightgray"
  },
  row: {
    flexDirection: "row",
    marginBottom: 5
  },
  name: {
    flex: 1,
    fontWeight: "bold"
  },
  subTitle: {
    color: "gray"
  },
  unreadText: {
    color: "black",
    fontWeight: "bold"
  }
});

export default ChatListItem;
