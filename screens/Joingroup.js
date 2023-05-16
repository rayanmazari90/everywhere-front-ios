import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ImageBackground, StyleSheet } from 'react-native';
import { useJoinGroupMutation } from '../services/appApi';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const Joingroup = ({ route }) => {
    const { group } = route.params;
    const [isJoined, setIsJoined] = useState(false);
    const user = useSelector((state) => state.user);
    const userId = user.user._id;
    const [join, { isLoading: joinIsLoading, error: joinError }] = useJoinGroupMutation();
    const navigation = useNavigation();


    const joinagroup = async () => {
        try {
            await join({ userId: userId, event_group_Id: group.user.id });
            navigation.goBack();
        } catch (error) {
            console.error(error);
        }
    };

    const goBack = () => {
        navigation.navigate('Chats');
    };

    return (
        <View style={styles.container}>
            <ImageBackground style={styles.backgroundImage} source={{ uri: group.user.image }}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>{group.user.name}</Text>
                </View>
                <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={goBack} style={styles.exitButton}>
                        <Text style={styles.exitButtonText}>Exit</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={joinagroup} disabled={isJoined} style={styles.joinButton}>
                        <Text style={styles.joinButtonText}>{isJoined ? 'Joined' : 'Join Group'}</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
};

export default Joingroup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    titleContainer: {
        position: 'absolute',
        top: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: 10,
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        textAlign: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        height: "20%",
        alignItems: 'center',
    },
    exitButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: '50%',
        alignItems: 'center',
    },
    joinButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        width: '50%',
        alignItems: 'center',
    },
    joinButtonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 22,
    },
    exitButtonText: {
        color: 'lightgrey',
        fontWeight: 'bold',
        fontSize: 22,
    }
});