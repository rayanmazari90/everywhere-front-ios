import React, { useState, useLayoutEffect, useEffect } from 'react';
import { View, StyleSheet, Text, FlatList, SafeAreaView } from 'react-native';
import ChatListItem from '../components/ChatListItem';
import socket from "../utils/socket";

const ChatsScreen = () => {
    const [visible, setVisible] = useState(false);
    //👇🏻 Dummy list of rooms
    const [conversations, setConversations] = useState([]);

    //👇🏻 Runs when the component mounts
    useLayoutEffect(() => {
        function fetchGroups() {
            fetch("http://172.20.10.5:5001/conversations")
                .then((res) => res.json())
                .then((data) => setConversations(data))
                .catch((err) => console.error(err));
        }
        fetchGroups();
    }, []);

    //👇🏻 Runs whenever there is new trigger from the backend
    useEffect(() => {
        socket.on("convslist", (conversations) => {
            setConversations(conversations);
        });
    }, [socket]);

    return (
        <SafeAreaView>
            {conversations.length > 0 ? (

                <FlatList data={conversations} renderItem={({ item }) => <ChatListItem chat={item} />} />
            ) : (
                <View style={styles.chatemptyContainer}>
                    <Text style={styles.chatemptyText}>No conversations !</Text>
                    <Text>Text someone! </Text>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({})

export default ChatsScreen;