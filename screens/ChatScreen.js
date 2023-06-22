
import React, { useLayoutEffect, useState, useEffect } from 'react';
import {
    StyleSheet, ImageBackground, FlatList, KeyboardAvoidingView,
    Platform, TextInput, Text, View, TouchableOpacity
} from 'react-native';
import bg from '../assets/leaves.jpg';
import { SafeAreaView } from 'react-native-safe-area-context';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Message from '../components/Message';
import socket from "../utils/socket";
import { useSelector } from "react-redux";
import { useNavigation } from '@react-navigation/native';
import { useLeaveGroupMutation } from '../services/appApi';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ImagePicker from 'react-native-image-picker';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';
import RNFS from 'react-native-fs';

// ...




const ChatScreen = ({ route, navigation }) => {
    const user = useSelector((state) => state.user);
    const userId = user.user._id;
    const [chatMessages, setChatMessages] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [message, setMessage] = useState("");
    const { id, name, members, event_group_Id } = route.params;
    const [prevSenderId, setPrevSenderId] = useState(null);
    const [prevSenderIdreverse, setPrevSenderIdreverse] = useState(null);
    const [leavegroup, { isLoading: leavegroupIsLoading, error: leavegroupError }] = useLeaveGroupMutation();
    const getReceiverIds = (members, userId) => {
        const receiverIds = members.filter(memberId => memberId !== userId);

        if (receiverIds.length === 1) {
            return receiverIds[0];
        } else {
            return null;
        }
    };

    const leaveagroup = async () => {
        try {
            await leavegroup({ userId: userId, event_group_Id: event_group_Id });
            navigation.goBack();
        } catch (error) {
            console.error(error);
        }
    };


    const receiverID = getReceiverIds(members, userId);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: name,
            headerRight: () => (
                <TouchableOpacity style={styles.exitButton} onPress={leaveagroup}>
                    <Ionicons name="exit" size={24} color="green" />
                </TouchableOpacity>
            )
        });
        socket.emit("findconv", id);
        socket.on("foundconv", (convmessages) => {
            const updatedMessages = [...convmessages].reverse();
            setChatMessages(updatedMessages);
        });
    }, []);

    useEffect(() => {
        socket.on("foundconv", (convmessages) => {
            const updatedMessages = [...convmessages].reverse();
            setChatMessages(updatedMessages);
        });
    }, [socket]);

    const handleNewMessageImage = (image) => {
        const messageData = {
            conversationId: id,
            message,
            sender: userId,
            receiver: receiverID,
            isRead: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        if (image || selectedImage) {
            messageData.message = image || selectedImage;
        }
        socket.emit("newMessage", messageData);
        setMessage("");
        setSelectedImage(null);
    };


    const handleNewMessage = () => {
        const messageData = {
            conversationId: id,
            message,
            sender: userId,
            receiver: receiverID,
            isRead: false,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        socket.emit("newMessage", messageData);
        setMessage("");
    };

    const handlePickImage = () => {
        var options = {
            title: 'Select Image',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        launchImageLibrary(options, async (response) => {
            if (response.assets && response.assets[0].uri) {
                let filePath = response.assets[0].uri;
                if (Platform.OS === 'ios') {
                    filePath = filePath.replace('file://', '');
                }
                try {
                    const image = await RNFS.readFile(filePath, 'base64');
                    handleNewMessageImage(image);
                } catch (error) {
                    console.error(error);
                }
            }
        });
    };

    const handleTakePhoto = () => {
        var options = {
            title: 'Take Photo',
            storageOptions: {
                skipBackup: true,
                path: 'images',
            },
        };

        launchCamera(options, async (response) => {
            if (response.assets && response.assets[0].uri) {
                let filePath = response.assets[0].uri;

                try {
                    const image = await RNFS.readFile(filePath, 'base64');
                    handleNewMessageImage(image);
                } catch (error) {
                    console.error(error);
                }
            } else if (response.didCancel) {
                console.log('User cancelled photo picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
        });
    };


    return (
        <ImageBackground source={bg} style={styles.bg}>
            {chatMessages[0] ? (
                <FlatList
                    data={chatMessages}
                    renderItem={({ item, index }) =>
                        <Message message={item}
                            prevSenderId={chatMessages[index - 1]?.sender}
                            setPrevSenderId={setPrevSenderId}
                            prevSenderIdreverse={chatMessages[index + 1]?.sender}
                            setPrevSenderIdreverse={setPrevSenderIdreverse} />}

                    style={styles.list}
                    inverted
                    contentContainerStyle={{ paddingBottom: 15 }}
                />
            ) : (
                <View style={styles.noMessagesContainer}>
                    <Text style={styles.noMessagesText}>No messages yet.</Text>
                </View>
            )}

            <KeyboardAvoidingView
                behavior={'padding'}
                enabled={Platform.OS === 'ios'}
                keyboardVerticalOffset={Platform.select({ android: 64, ios: 0 })}
            >
                <SafeAreaView edges={["bottom"]} style={styles.inputContainer}>
                    <FontAwesome name="plus" size={20} color="royalblue" onPress={handlePickImage} />
                    <FontAwesome name="camera" size={20} color="royalblue" onPress={handleTakePhoto} />
                    <TextInput
                        value={message}
                        onChangeText={setMessage}
                        style={styles.input}
                        placeholder="Type your message..."
                    />

                    <MaterialCommunityIcons
                        onPress={handleNewMessage}
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
    bg: {
        flex: 1,
    },
    list: {
        flex: 1,
        padding: 10,
    },
    noMessagesContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noMessagesText: {
        fontSize: 18,
        color: 'gray',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5,
        paddingHorizontal: 10,
        backgroundColor: 'whitesmoke',
    },
    input: {
        flex: 1,
        backgroundColor: 'white',
        padding: 5,
        paddingHorizontal: 10,
        marginHorizontal: 10,
        borderRadius: 50,
        borderColor: 'lightgray',
        borderWidth: StyleSheet.hairlineWidth,
    },
    send: {
        backgroundColor: 'royalblue',
        padding: 7,
        borderRadius: 15,
        overflow: 'hidden',
    },
});

export default ChatScreen;