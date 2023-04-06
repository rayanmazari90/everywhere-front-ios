import React, { useLayoutEffect, useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, FlatList, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import bg from '../assets/leaves.jpg';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Message from '../components/Message';
import socket from "../utils/socket";
const ChatScreen = ({ route, navigation }) => {
    const [chatMessages, setChatMessages] = useState([]);
    const [message, setMessage] = useState("");
    const { id, name } = route.params;
    //👇🏻 Runs when the component mounts
    useLayoutEffect(() => {
        navigation.setOptions({ title: name });

        //👇🏻 Sends the id to the server to fetch all its messages
        socket.emit("findconv", id);
    }, []);

    useLayoutEffect(() => {
        navigation.setOptions({ title: name });
        socket.emit("findconv", id);
        socket.on("foundconv", (convmessages) => setChatMessages(convmessages));
    }, []);

    //👇🏻 This runs when the messages are updated.
    useEffect(() => {
        socket.on("foundconv", (convmessages) => setChatMessages(convmessages));
    }, [socket]);

    const handleNewMessage = () => {
        const hour =
            new Date().getHours() < 10
                ? `0${new Date().getHours()}`
                : `${new Date().getHours()}`;

        const mins =
            new Date().getMinutes() < 10
                ? `0${new Date().getMinutes()}`
                : `${new Date().getMinutes()}`;

        socket.emit("newMessage", {
            conversation_id: id,
            message,
            user: 'u1',
            timestamp: { hour, mins },
        });
    };

    return (
        <ImageBackground source={bg} style={styles.bg}>
            {chatMessages[0] ? (<FlatList data={chatMessages}
                renderItem={({ item }) => <Message message={item} />}
                style={styles.list} inverted />
            ) : (
                ""
            )}
            <KeyboardAvoidingView behavior={'padding'} enabled={Platform.OS === 'ios'}
                keyboardVerticalOffset={Platform.select({ android: 64, ios: 0 })}>
                <SafeAreaView edges={["bottom"]} style={styles.container}>
                    <FontAwesome
                        name="plus"
                        size={20}
                        color="royalblue"
                    />

                    {/* Text Input */}
                    <TextInput value={message} onChangeText={setMessage}
                        style={styles.input}
                        placeholder="Type your message..."
                    />

                    {/* Icon */}
                    <MaterialCommunityIcons onPress={handleNewMessage}
                        style={styles.send}
                        name="send"
                        size={20}
                        color="white"
                    />
                </SafeAreaView>
            </KeyboardAvoidingView>

        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    bg: { flex: 1 },
    list: { padding: 10, },
    container: {
        flexDirection: "row",
        backgroundColor: "whitesmoke",
        padding: 5,
        paddingHorizontal: 10,
        alignItems: "center",
    },
    input: {
        flex: 1,
        backgroundColor: "white",
        padding: 5,
        paddingHorizontal: 10,
        marginHorizontal: 10,

        borderRadius: 50,
        borderColor: "lightgray",
        borderWidth: StyleSheet.hairlineWidth,
    },
    send: {
        backgroundColor: "royalblue",
        padding: 7,
        borderRadius: 15,
        overflow: "hidden",
    }
})

export default ChatScreen;