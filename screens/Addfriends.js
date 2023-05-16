/*

import { View, TextInput, Button, StyleSheet, FlatList, ImageBackground, SafeAreaView, Text } from 'react-native';
import React, { useState, useLayoutEffect, useEffect } from 'react';
import AddfriendItem from '../components/AddfriendItem';
import FriendRequestItem from '../components/FriendRequestItem';
import { useGetRequestersMutation } from '../services/appApi';
import { useSelector } from 'react-redux';
import {url_back}  from "../components/connection_url";

const AddFriends = () => {
    const [userName, setUserName] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [getRequesters, { isLoading: getRequestersIsLoading, error: getRequestersError }] = useGetRequestersMutation();
    const [requesters, setRequesters] = useState([]);
    const user = useSelector((state) => state.user);

    useLayoutEffect(() => {
        function fetchGroups() {
            fetch(`${url_back}/users`)
                .then((res) => res.json())
                .then((data) => setAllUsers(data))
                .catch((err) => console.error(err));
        }
        fetchGroups();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const result = await getRequesters({ friendRequests: user.user.friendRequests });
                setRequesters(result.data.users);
                console.log(requesters);
            } catch (error) {
                console.error('Error fetching convs:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        setFilteredUsers(
            allUsers.filter(
                (allUser) =>
                    allUser.name.toLowerCase().includes(userName.toLowerCase()) &&
                    !requesters.some((requester) => requester._id === allUser._id)
            )
        );
    }, [userName, allUsers, requesters]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text> Friend Requests </Text>
            <View style={styles.container}>
                <FlatList
                    data={requesters}
                    renderItem={({ item }) => <FriendRequestItem requester={item} />}
                />
            </View>
            <Text> Winek Users </Text>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter friend's name"
                    value={userName}
                    onChangeText={setUserName}
                />
            </View>

            {filteredUsers[0] ? (
                <FlatList
                    data={filteredUsers}
                    renderItem={({ item }) => <AddfriendItem friend={item} />}
                    style={styles.listusers}
                />
            ) : null}
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
    listusers: {
        flex: 1,
        padding: 10,
    },
});

export default AddFriends;
*/

import { View, TextInput, Button, StyleSheet, FlatList, ImageBackground, SafeAreaView, Text } from 'react-native';
import React, { useState, useLayoutEffect, useEffect } from 'react';
import AddfriendItem from '../components/AddfriendItem';
import FriendRequestItem from '../components/FriendRequestItem';
import { useGetRequestersMutation } from '../services/appApi';
import { useSelector } from 'react-redux';
import {url_back}  from "../components/connection_url";

const AddFriends = () => {
    const [userName, setUserName] = useState('');
    const [allUsers, setAllUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [getRequesters, { isLoading: getRequestersIsLoading, error: getRequestersError }] = useGetRequestersMutation();
    const [requesters, setRequesters] = useState([]);
    const user = useSelector((state) => state.user);

    console.log(user.user.friendRequests);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (user.user.friendRequests.length === 0) {
                    setRequesters([]);
                } else if (user.user.friendRequests.length === 1) {
                    const result = await getRequesters({ friendRequests: user.user.friendRequests });
                    const users = result.data.users;
                    const filteredRequesters = users.filter(requester => requester._id !== user.user._id);
                    setRequesters(filteredRequesters);
                } else {
                    const result = await getRequesters({ friendRequests: user.user.friendRequests });
                    const users = result.data.users;
                    const filteredRequesters = users.filter(requester => requester._id !== user.user._id);
                    setRequesters(filteredRequesters);
                }
            } catch (error) {
                console.error('Error fetching requesters:', error);
            }
        };

        fetchData();
    }, []);



    useEffect(() => {
        function fetchGroups() {
            fetch(`${url_back}/users`)
                .then((res) => res.json())
                .then((data) => setAllUsers(data))
                .catch((err) => console.error(err));
        }
        fetchGroups();
    }, [allUsers]);

    useEffect(() => {
        setFilteredUsers(
            allUsers.filter(
                (allUser) =>
                    allUser.name.toLowerCase().includes(userName.toLowerCase()) &&
                    !requesters.some((requester) => requester._id === allUser._id)
            )
        );
    }, [userName, allUsers, requesters]);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text> Friend Requests </Text>
            <View style={styles.container}>
                <FlatList
                    data={requesters}
                    renderItem={({ item }) => <FriendRequestItem requester={item} />}
                />
            </View>
            <Text> Winek Users </Text>
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Enter friend's name"
                    value={userName}
                    onChangeText={setUserName}
                />
            </View>

            {filteredUsers[0] ? (
                <FlatList
                    data={filteredUsers}
                    renderItem={({ item }) => <AddfriendItem friend={item} />}
                    style={styles.listusers}
                />
            ) : null}
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
    listusers: {
        flex: 1,
        padding: 10,
    },
});

export default AddFriends;