
import { View, TextInput, Button, StyleSheet, FlatList, ImageBackground, SafeAreaView, Text } from 'react-native';
import React, { useState, useLayoutEffect, useEffect } from 'react';
import AddfriendItem from '../components/AddfriendItem';
import FriendRequestItem from '../components/FriendRequestItem';
import RemovefriendItem from '../components/RemovefriendItem';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useSelector } from 'react-redux';
import { useGetRequestersMutation } from '../services/appApi';
import {url_back}  from "../components/connection_url";

const AddFriends = ({ navigation }) => {

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: '',
        });
    }, [navigation]);

    const [index, setIndex] = useState(0);
    const [routes] = useState([
        { key: 'addFriends', title: 'Add Friends' },
        { key: 'Friends', title: 'Friends' },
    ]);


    const renderTabBar = props => (
        <View style={{ flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
            <TabBar
                {...props}
                indicatorStyle={{ backgroundColor: 'white', height: 2 }}
                style={{
                    backgroundColor: 'gray',
                    borderRadius: 15, // Adjusting radius
                    width: '50%',
                    top: 10, // Adjusting width for smaller TabBar
                }}
                labelStyle={{ fontSize: 10 }} // Adjusting font size for smaller title
                getLabelText={({ route }) => route.title}
                activeColor='red' // Adjusting color to indicate active page
                inactiveColor='white'
            />
        </View>
    );

    const AddFriendsScene = React.memo(() => {
        const [userName, setUserName] = useState('');
        const [allUsers, setAllUsers] = useState([]);
        const [filteredUsers, setFilteredUsers] = useState([]);
        const user = useSelector((state) => state.user);
        const userId = user.user._id
        const [getRequesters, { isLoading: getRequestersIsLoading, error: getRequestersError }] = useGetRequestersMutation();
        const [requesters, setRequesters] = useState([]);

        const fetchData = async () => {
            try {
                const result = await getRequesters({ userId: user.user._id });
                const users = result.data.users;
                setRequesters(users);
            } catch (error) {
                console.error('Error fetching requesters:', error);
            }
        };


        const fetchGroups = async () => {
            try {
                const res = await fetch(`${url_back}/users/getusersandnotfriends?userId=${userId}`);
                const data = await res.json();
                setAllUsers(data);
            } catch (error) {
                console.error(error);
                return [];
            }
        };


        useEffect(() => {
            fetchData();
        }, []);

        useEffect(() => {
            fetchGroups();
        }, [userName]);

        useEffect(() => {
            setFilteredUsers(
                allUsers.filter(
                    (allUser) =>
                        allUser.name.toLowerCase().includes(userName.toLowerCase()) && allUser._id !== user.user._id
                )
            );
        }, [userName, allUsers]);

        const onFriendAction = () => {
            fetchGroups();
            fetchData();
        };
        return (
            <View style={{ flex: 1 }}>
                <Text style={{ top: 20 }}> Friend Requests </Text>
                <View style={styles.container}>
                    <FlatList
                        data={requesters}
                        renderItem={({ item }) => <FriendRequestItem requester={item} onFriendAction={onFriendAction} />}
                    />
                </View>
                <Text> Winek Users </Text>
                <View style={styles.container}>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter a name"
                        value={userName}
                        onChangeText={setUserName}
                    />
                </View>

                {filteredUsers[0] ? (
                    <FlatList
                        data={filteredUsers}
                        renderItem={({ item }) => <AddfriendItem friend={item} onFriendAction={onFriendAction} />}
                        style={styles.listusers}
                    />
                ) : null}
            </View>
        );
    });

    const FriendsScene = React.memo(() => {
        const user = useSelector((state) => state.user);
        const userId = user.user._id
        const [friendName, setFriendName] = useState('');
        const [myfriends, setMyFriends] = useState([]);
        const [myfilteredfriends, setMyFilteredFriends] = useState([]);

        const fetchFriends = async () => {
            try {
                const res = await fetch(`http://192.168.56.1:5001/users/getfriends?userId=${userId}`);
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
            <View style={{ flex: 1 }}>
                <Text style={{ top: 20 }}> My friends</Text>
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
    });


    const renderScene = React.useCallback((route) => {
        switch (route.route.key) {
            case 'addFriends':
                return <AddFriendsScene />;
            case 'Friends':
                return <FriendsScene />;
            default:
                return null;
        }
    }, []);

    return (
        <SafeAreaView style={{ flex: 1, top: 20 }}>
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                renderTabBar={renderTabBar}
                onIndexChange={setIndex}
                initialLayout={{ width: '100%' }}
            />
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



