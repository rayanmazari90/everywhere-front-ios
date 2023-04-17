import {url_back}  from "../components/connection_url";
import React, { useState, useLayoutEffect, useEffect } from 'react';
import { green } from '../components/Constants';
import ScrollZoomHeader from 'react-native-header-zoom-scroll';
import { View, StyleSheet, Text, FlatList, SafeAreaView, Image, Dimensions, ImageBackground, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import ChatListItem from '../components/ChatListItem';
import socket from "../utils/socket";
import { useSelector } from "react-redux";

const ChatsScreen = () => {
    const [visible, setVisible] = useState(false);
    //👇🏻 Dummy list of rooms
    const [conversations, setConversations] = useState([]);
    const user = useSelector((state) => state.user)
    const userId = user.user._id
    useLayoutEffect(() => {
        function fetchGroups() {
            fetch(url_back+`/conversations?member=${userId}`)
                .then((res) => res.json())
                .then((data) => setConversations(data))
                .catch((err) => console.error(err));
        }
        fetchGroups();
    }, [userId]);

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