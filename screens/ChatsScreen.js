import React, { useState, useEffect } from 'react';
import { green } from '../components/Constants';
import ScrollZoomHeader from 'react-native-header-zoom-scroll';
import { View, StyleSheet, Text, FlatList, SafeAreaView, Image, Dimensions, ImageBackground, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import ChatListItem from '../components/ChatListItem';
import socket from "../utils/socket";
import { useSelector } from "react-redux";
import { useGetconvsMutation } from "../services/appApi";

const ChatsScreen = () => {
    const [visible, setVisible] = useState(false);
    const [conversations, setConversations] = useState([]);
    const user = useSelector((state) => state.user);
    const userId = user.user._id;
    const [getConvs, { data }] = useGetconvsMutation();

    useEffect(() => {
        getConvs({ member: userId }).then((result) => {
            console.log("///////////////////////////////////")
            console.log(result)
            setConversations(result.data);
        });
    }, [getConvs, userId]);

    // Add this useEffect to listen for the 'convslist' event
    useEffect(() => {
        socket.on("convslist", (updatedConversations) => {
            setConversations(updatedConversations);
        });
        return () => {
            socket.off("convslist");
        };
    }, []);

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