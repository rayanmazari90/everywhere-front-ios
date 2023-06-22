import React, { useState, useLayoutEffect, useEffect } from 'react';
import { Text, View, Image, StyleSheet, Pressable, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAcceptInvitationMutation, useDeclineInvitationMutation } from '../../services/appApi';
import { useSelector, useDispatch } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

const FriendRequestItem = ({ requester, onFriendAction }) => {
    const navigation = useNavigation();
    const user = useSelector((state) => state.user);
    const userId = user.user._id;
    const [acceptInvitation, { isLoading: acceptinvitationisloading, error: acceptinvitationerror }] = useAcceptInvitationMutation();
    const [declineInvitation, { isLoading: declineinvitationisloading, error: declineinvitationerror }] = useDeclineInvitationMutation();
    console.log("rendering");
    const handleAcceptFriendRequest = async () => {
        try {
            const response = await acceptInvitation({ userId: userId, receiverId: requester._id });
            onFriendAction();
        } catch (error) {
            console.error(error);
        }
    };


    const handleDeclineFriendRequest = async () => {
        try {
            await declineInvitation({ userId: userId, receiverId: requester._id });
            onFriendAction();
        } catch (error) {
            console.error(error);
        }
    };

    const isUrl = requester.image && requester.image.startsWith('http');

    return (
        <View style={styles.container}>
            {
                isUrl ?
                    <Image source={{ uri: requester.image }} style={styles.image} />
                    :
                    <Image source={{ uri: `data:image/png;base64,${requester.image}` }} style={styles.image} />

            }

            <View style={styles.content}>
                <View style={styles.row}>
                    <Text numberOfLines={1} style={styles.name}>
                        {requester.name}
                    </Text>
                    <View style={styles.iconContainer}>
                        <Pressable onPress={handleAcceptFriendRequest}>
                            <Icon name="check" size={30} color="green" />
                        </Pressable>
                        <View style={styles.iconSpace} />
                        <Pressable onPress={handleDeclineFriendRequest}>
                            <Icon name="times" size={30} color="red" />
                        </Pressable>
                    </View>
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
    iconContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 0,
    }, iconSpace: {
        width: 10,
    }
});

export default FriendRequestItem;