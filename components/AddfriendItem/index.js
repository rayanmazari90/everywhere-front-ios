import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Text, View, Image, StyleSheet, Pressable, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAddFriendMutation, useCancelInvitationMutation } from '../../services/appApi';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome'; // Import the Icon component

const AddfriendItem = ({ friend }) => {
    const navigation = useNavigation();
    const user = useSelector((state) => state.user);
    const userId = user.user._id;
    const [addFriend, { isLoading: addFriendisloading, error: addFrienderror }] = useAddFriendMutation();
    const [cancelInvitation, { isLoading: cancelInvitationisloading, error: cancelInvitationerror }] = useCancelInvitationMutation();

    const handleAddFriend = async () => {
        try {
            await addFriend({ userId: userId, receiverId: friend._id });
        } catch (error) {
            console.error(error);
        }
    };


    const handleCancelInvitation = async () => {
        try {
            await cancelInvitation({ userId: userId, receiverId: friend._id });
        } catch (error) {
            console.error(error);
        }
    };


    const isMyFriend = () => {
        return user.user.friends.includes(friend._id);
    };

    const RequestSent = () => {
        return friend.friendRequests.includes(userId);
    };

    return (
        <View style={styles.container}>
            <Image source={{ uri: friend.image }} style={styles.image} />
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text numberOfLines={1} style={styles.name}>
                        {friend.name}
                    </Text>
                    {!isMyFriend() && !RequestSent() && (
                        <Button title="Add Friend" onPress={handleAddFriend} />
                    )}
                    {
                        RequestSent() && (
                            <View style={styles.invitationSentContainer}>
                                <Text style={styles.invitationSentText}>Request Sent</Text>
                                <View style={styles.iconContainer}>
                                    <Pressable onPress={handleCancelInvitation}>
                                        <Icon name="times" size={30} color="red" />
                                    </Pressable>
                                </View>
                            </View>
                        )
                    }

                </View>
            </View>
        </View>
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
        justifyContent: 'center', // Align items vertically in the center
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between', // Distribute items horizontally
        alignItems: 'center', // Align items vertically in the center
    },
    name: {
        flex: 1,
        fontWeight: 'bold',
    },
    invitationSentContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    invitationSentText: {
        marginRight: 10,
    },
    iconContainer: {
        marginLeft: 10,
    },
});

export default AddfriendItem;