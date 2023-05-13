import { Text, View, Image, StyleSheet, Pressable } from 'react-native';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useNavigation } from '@react-navigation/native';
import React, { useState, useLayoutEffect, useEffect } from 'react';
import {url_back}  from "../../components/connection_url";


dayjs.extend(relativeTime, { threshold: 24 * 60 * 60 }); // show relative time in hours

const ChatListItem = ({ chat }) => {
    const navigation = useNavigation();
    const [lastmessage, setlastMessage] = useState([]);
    useEffect(() => {
        function fetchLastMessage() {
            fetch(`${url_back}/chat/messages/${chat.lastMessage}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
                .then((res) => res.json())
                .then((data) => setlastMessage(data))
                .catch((err) => console.error(err));
        }
        fetchLastMessage();
    }, [chat.lastMessage, chat._id]);
    return (
        <Pressable onPress={() => navigation.navigate("Chat", { id: chat._id, name: chat.user.name })} style={styles.container}>
            <Image source={{ uri: chat.user.image }} style={styles.image} />
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text numberOfLines={1} style={styles.name}>
                        {chat.user.name}
                    </Text>
                    <Text style={styles.subTitle}>
                        {dayjs(chat.createdAt).fromNow(true)}
                    </Text>
                </View>
                <Text numberOfLines={2} style={styles.subTitle}>{lastmessage[0]?.message}</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 5,
        height: 70,
    },
    image: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 10,
    },
    content: {
        flex: 1,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'lightgray',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    name: {
        flex: 1,
        fontWeight: 'bold',
    },
    subTitle: { color: 'gray', }
})

export default ChatListItem;