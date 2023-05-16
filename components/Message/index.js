import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";
import { useFindSenderMutation } from '../../services/appApi';
dayjs.extend(relativeTime);

const Message = ({ message, prevSenderId, prevSenderIdreverse }) => {
    const user = useSelector((state) => state.user)
    const [findSender, { isLoading: findSenderIsLoading, error: findSenderError }] = useFindSenderMutation();
    const [senderUser, setSenderUser] = useState(null);
    const isMyMessage = () => {
        return message.sender === user.user._id;
    };

    const samesender = () => {
        return message.sender === prevSenderId;
    };

    const samesenderreverse = () => {
        return message.sender === prevSenderIdreverse;
    };

    const findthesender = async () => {
        findSender({ senderId: message.sender }).then((result) => {
            setSenderUser(result.data);

        }).catch((error) => {
            console.error('Error fetching sender:', error);
        });
    };

    useEffect(() => {
        if (!isMyMessage()) {
            findthesender();
        }
    }, [message]);

    const getSenderImage = () => {
        if (isMyMessage()) {
            return user.user.image;
        } else {
            if (message.sender !== prevSenderId) {
                return senderUser ? senderUser.image : null;
            }
            return null;
        }
    };

    const getSenderName = () => {
        if (isMyMessage()) {
            return user.user.name;
        } else {
            if (message.sender !== prevSenderIdreverse) {
                return senderUser ? senderUser.name : null;
            }
            return null;
        }
    };

    return (
        <View>
            {message.sender !== prevSenderIdreverse && !isMyMessage() && (
                <Text style={styles.senderName}>{getSenderName()}</Text>
            )}
            <View style={[
                styles.container,
                { flexDirection: isMyMessage() ? 'row-reverse' : 'row' }
            ]}>
                {message.sender !== prevSenderId && !isMyMessage() && <Image source={{ uri: getSenderImage() }} style={styles.image} />}
                <View style={[
                    styles.messageContainer,
                    {
                        backgroundColor: isMyMessage() ? 'lightgreen' : "white",
                        marginLeft: samesender() ? 60 : 0,
                    }
                ]}>
                    {message.message.startsWith('http') ? (
                        <Image source={{ uri: message.message }} style={{ width: 100, height: 100 }} />
                    ) : (
                        <Text>{message.message}</Text>
                    )}
                    <Text style={styles.time}>{dayjs(message.createdAt).fromNow(true)}</Text>
                </View>
            </View>
        </View>
    );

};


const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginVertical: 5,
    },
    messageContainer: {
        borderRadius: 10,
        padding: 10,
        maxWidth: "60%",
    },
    time: {
        color: "gray",
        alignSelf: "flex-end",
    },
    image: {
        width: 40,
        height: 40,
        borderRadius: 40,
        marginHorizontal: 10,
    },
    shadowColor: '#000',
    shadowOffset: {
        width: 0,
        height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    senderName: {
        fontWeight: 'bold',
        marginBottom: 5,
        marginLeft: 60,
    },
});

export default Message;