import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import {useSelector} from "react-redux";
dayjs.extend(relativeTime);

const Message = ({ message }) => {
    const user = useSelector((state) => state.user)
    const isMyMessage = () => {
        return message.sender === user.user._id;
    };
    return (
        <View style={[
            styles.container,
            {
                alignSelf: isMyMessage() ? "flex-end" : "flex-start",
                backgroundColor: isMyMessage() ? 'lightgreen' : "white",
            }
        ]}>
            <Text>{message.message}</Text>
            <Text style={styles.time}>{dayjs(message.createdAt).fromNow(true)}</Text>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        margin: 5,
        padding: 10,
        borderRadius: 10,
        maxWidth: "80%",

    },
    time: {
        color: "gray",
        alignSelf: "flex-end",
    },

    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
});


export default Message;