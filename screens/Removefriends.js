import { View, TextInput, Button, StyleSheet, FlatList, ImageBackground, SafeAreaView, Text } from 'react-native';
import React, { useState, useLayoutEffect, useEffect } from 'react';
import RemovefriendItem from '../components/RemovefriendItem';
import { useSelector } from 'react-redux';
import {url_back}  from "../components/connection_url";

const Removefriends = ({ navigation }) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: '',
        });
    }, [navigation]);

    const user = useSelector((state) => state.user);
    const userId = user.user._id
    const [friendName, setFriendName] = useState('');
    const [myfriends, setMyFriends] = useState([]);
    const [myfilteredfriends, setMyFilteredFriends] = useState([]);

    const fetchFriends = async () => {
        try {
            const res = await fetch(`${url_back}/users/getfriends?userId=${userId}`);
            const data = await res.json();
            setMyFriends(data);
        } catch (error) {
            console.error(error);
            return [];
        }
    };

    useEffect(() => {
        fetchFriends();
    }, [friendName]);

    useEffect(() => {
        setMyFilteredFriends(
            myfriends.filter(
                (myfriend) =>
                    myfriend.name.toLowerCase().includes(friendName.toLowerCase()) && myfriend._id !== user.user._id
            )
        );
    }, [friendName, myfriends]);

    const onFriendAction = () => {
        fetchFriends();
    };
    return (
        <View style={{ flex: 1, top: 20 }}>
            <Text style={{ top: 30 }}> My friends</Text>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter friend's name"
                    value={friendName}
                    onChangeText={setFriendName}
                />
            </View>

            {myfilteredfriends[0] ? (
                <FlatList
                    data={myfilteredfriends}
                    renderItem={({ item }) => <RemovefriendItem friend={item} onFriendAction={onFriendAction} />}
                    style={styles.listusers}
                />
            ) : null}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginVertical: 20,
    },
    input: {
        flex: 1,
        marginRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    listusers: {
        flex: 1,
        padding: 10,
    },
});


export default Removefriends;