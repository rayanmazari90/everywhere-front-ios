import { View, TextInput, Button, StyleSheet, FlatList, ImageBackground, SafeAreaView } from 'react-native';
import React, { useState, useLayoutEffect, useEffect } from 'react';
import AddfriendItem from '../components/AddfriendItem';
import socket from "../utils/socket";
import {url_back}  from "../components/connection_url";

const AddFriends = ({ onAddFriend }) => {
    const [friendName, setFriendName] = useState('');
    const [friends, setFriends] = useState([]);
    //👇🏻 Runs when the component mounts
    useLayoutEffect(() => {
        function fetchGroups() {
            fetch(url_back+"/users")
                .then((res) => res.json())
                .then((data) => setFriends(data))
                .catch((err) => console.error(err));
        }
        fetchGroups();
    }, []);
    console.log(friends)
    //👇🏻 Runs whenever there is new trigger from the backend
    useEffect(() => {
        socket.on("friendslist", (friends) => {
            setFriends(friends);
        });
    }, [socket]);

    const handleAddFriend = () => {
        if (friendName) {
            onAddFriend(friendName);
            setFriendName('');
        }
    };

    return (
        <SafeAreaView>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter friend's name"
                    value={friendName}
                    onChangeText={setFriendName}
                />
                <Button title="Add Friend" onPress={handleAddFriend} />
            </View>
            {friends[0] ? (<FlatList data={friends}
                renderItem={({ item }) => <AddfriendItem friend={item} />}
                style={styles.list} inverted />
            ) : (
                ""
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginVertical: 10,
    },
    input: {
        flex: 1,
        marginRight: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#333',
    },
    bg: { flex: 1 },
    list: { padding: 10, },
});

export default AddFriends;