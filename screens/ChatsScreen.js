import React, { useState, useEffect, useLayoutEffect } from 'react';
import {
    View,
    StyleSheet,
    Text,
    FlatList,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Pressable,
    ImageBackground, Image, Dimensions
} from 'react-native';
import { green } from '../components/Constant_color';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import ChatListItem from '../components/ChatListItem';
import { useGetconvsMutation, useClubsgetMutation, useGetGroupsMutation } from '../services/appApi';
import socket from '../utils/socket';


const ChatsScreen = () => {
    const [conversations, setConversations] = useState([]);
    const [groups, setGroups] = useState([]);
    const user = useSelector((state) => state.user);
    const userId = user.user._id;
    const [getConvs, { isLoading: coonvsisloading, error: convserror }] = useGetconvsMutation();
    const [getGroups, { isLoading: groupsisloading, error: groupserror }] = useGetGroupsMutation();
    const navigation = useNavigation();

    ///// We could use a callback instead of listening to the focus on the screen
    const fetchGroups = () => {
        getGroups({ userId: userId }).then((result) => {
            setGroups(result.data);
        })
            .catch((error) => {
                console.error('Error fetching groups:', error);
            });
    };

    const fetchConversations = () => {
        getConvs({ member: userId }).then((result) => {
            setConversations(result.data);
        }).catch((error) => {
            console.error('Error fetching convs:', error);
        });
    };

    useEffect(() => {
        fetchGroups();
        fetchConversations();
        const unsubscribe = navigation.addListener('focus', () => {
            fetchGroups();
            fetchConversations();
        });

        return unsubscribe;
    }, [getGroups, getConvs, userId, navigation]);

    // Add this useEffect to listen for the 'convslist' event
    useEffect(() => {
        socket.on('convslist', (updatedConversations) => {
            setConversations(updatedConversations);
        });
        return () => {
            socket.off('convslist');
        };
    }, []);

    const renderGroup = (group) => {
        return (
            <View style={styles.groupContainer} key={'group-' + group.user.id}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('Joingroup', { group: group })}
                >
                    <ImageBackground
                        style={styles.groupImage}
                        imageStyle={styles.groupImage}
                        source={{ uri: group.user.image }}
                    >
                    </ImageBackground>
                </TouchableOpacity>
                <Text style={styles.groupTitle}>{group.user.name}</Text>

            </View>
        );
    };
    const renderGroups = () => {
        return groups.map((group, index) => renderGroup(group, index));
    };

    return (
        <SafeAreaView>
            <View style={styles.sectionContainer}>
                <FlatList
                    data={renderGroups()}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    renderItem={({ item }) => item}
                    keyExtractor={(item) => item.id ? item.id.toString() : Math.random().toString()}
                />
            </View>
            {conversations.length > 0 ? (
                <FlatList
                    data={conversations}
                    renderItem={({ item }) => <ChatListItem chat={item} />}
                />
            ) : (
                <View style={styles.chatemptyContainer}>
                    <Text style={styles.chatemptyText}>IE is all about making friends! Add friends to chat with them!</Text>
                    <Text>Text someone!</Text>
                </View>
            )}
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    chatemptyContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
    },
    chatemptyText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    sectionContainer: {
        marginTop: 10,
        marginBottom: 30,

    },
    groupContainer: {
        marginRight: 10,
        alignItems: 'center', // This will center the title below the image
    },
    groupImage: {
        width: 75,
        height: 75,
        borderRadius: 75 / 2, // Make the borderRadius half of width/height to make a circle
    },
    groupTitle: {
        color: 'black',
        fontWeight: 'bold',
        fontSize: 16,
        textAlign: 'center', // This will center the text
    }

});

export default ChatsScreen;