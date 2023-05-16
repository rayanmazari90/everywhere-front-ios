import React , {useEffect, useState}from "react";
import { useSelector } from 'react-redux';
import { darkGreen } from '../components/Constant_color';

import { StyleSheet, Text, View, SafeAreaView, Image,Dimensions, ScrollView, TouchableOpacity,ImageBackground,Button } from "react-native";
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useLogoutUserMutation } from "../services/appApi";
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useUserInfoProfilePageGetQuery } from "../services/appApi";
import {ImagePicker, showImagePicker, launchImageLibrary} from 'react-native-image-picker'
import { useUpdateUserImageMutation } from "../services/appApi";
import RNFS from 'react-native-fs';
//import Permissions from 'react-native-permissions';


const Profile = () => {
    const navigation = useNavigation();
    const { user = {} } = useSelector(state => state.user);
    const [logoutUser, { logoutisLoading, logouterror }] = useLogoutUserMutation();
    const email = user?.user?.email || null;
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState(null);
    const [resourcePath, setResourcePath] = useState(null);
    const [updateUserImage, { isLoading: isUploading, error: uploadError }] = useUpdateUserImageMutation();
    

    const { data: UserData, isLoading: isLoadings, isError, refetch } = useUserInfoProfilePageGetQuery(user._id || null, {
        enabled: !!user._id,
    });

    useEffect(() => {
        if(user){
            setIsLoading(!user);
            loadUserInfo(user._id);
        }
        
    }, [user]);

    useEffect(() => {
        if (user._id) {
            loadUserInfo(user._id);
        }
    }, [user]);

    const loadUserInfo = async (userId) => {
        try {
            const { data } = await refetch(userId);
            setUserInfo(data);
        } catch (error) {
            console.error(error);
        }
    };


    async function handleLogout() {
        if (user && user.email) {
            const email = user.email;
            try {
                await logoutUser({ email: email }).unwrap().then((data) => {
                    if (data) {
                        AsyncStorage.removeItem('AccessToken');
                    }
                    else {
                        console.log("something went wrong");
                    }
                });
            } catch (error) {
                console.error(error);
            }
        } else {
            console.error("User data is not available");
        }
    };
    const selectImage = () => {
        const options = {
            noData: false,
        };
    
        launchImageLibrary(options, async (response) => {
            if (response.error) {
            } else if (response.assets && response.assets[0].uri) {
                // The user selected an image. You can set it to state and display it or send it to the server.
                
                // Convert image to base64
                let filePath = response.assets[0].uri;
                if (Platform.OS === 'ios') {
                    filePath = filePath.replace('file://', '');
                }
                
                try {
                    const image = await RNFS.readFile(filePath, 'base64');
                
                    // Call the mutation
                    const updateResponse = await updateUserImage({ id: user._id, image });
                    if (updateResponse.error.data === "User image updated successfully") {
                        // Update was successful
                        setUserInfo(user);
                    } else {
                        console.error("Error updating image", updateResponse.error);
                    }
                    
                    // If the upload was successful, reload the user info
                    loadUserInfo(user._id);
                } catch (error) {
                    console.error(error);
                }
            }
        });
    };
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.scrollContainer}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
                <View style={styles.titleBar}>
                    <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16 }}>
                        <Ionicons name="ios-log-out" size={34} color={darkGreen}></Ionicons>
                    </TouchableOpacity>

                    { /*<Ionicons name="ios-arrow-back" size={24} color="#52575D"></Ionicons>*/}
                    { /*<Ionicons name="md-more" size={24} color="#52575D"></Ionicons>*/}
                </View>

                <View style={{ alignSelf: "center" }}>
                    <View style={styles.profileImage}>
                    {userInfo && userInfo.image ? (
                            <Image source={{ uri: `data:image/png;base64,${userInfo.image}` }} style={styles.image} resizeMode="center"></Image>
                        ) : (
                            <Text>Loading...</Text>
                        )}
                    </View>
                    <View style={styles.dm}>
                        { /*<MaterialIcons name="chat" size={18} color="#DFD8C8"></MaterialIcons>*/}
                    </View>
                    <View style={styles.active}></View>
                    <View style={styles.add}>
                        <TouchableOpacity onPress={selectImage}>
                            <Ionicons name="ios-add" size={48} color="#DFD8C8" style={{ justifyContent:'center', alignItems:'center' }}></Ionicons>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.infoContainer}>
                 {userInfo && (
                        <>
                            <Text style={[styles.text, { fontWeight: "200", fontSize: 36 }]}>
                            {userInfo.name}
                            </Text>
                            <Text style={[styles.text, { color: "#AEB5BC", fontSize: 14 }]}>
                            {userInfo.gender}
                            </Text>
                            <Text style={[styles.text, { color: "#AEB5BC", fontSize: 14 }]}>
                           {userInfo.email}
                            </Text>
                        </>
                        )}
                </View>

                <View style={styles.statsContainer}>
                    <View style={styles.statsBox}>
                    <Text style={[styles.text, { fontSize: 24 }]}>
                    {(userInfo?.userPastTickets?.length || 0) + (userInfo?.userTickets?.length || 0)}
                    </Text>
                        <Text style={[styles.text, styles.subText]}>Events</Text>
                    </View>
                    <View style={[styles.statsBox, { borderColor: "#DFD8C8", borderLeftWidth: 1, borderRightWidth: 1 }]}>
                    <Text style={[styles.text, { fontSize: 24 }]}>
                        {(userInfo?.friends?.length || 0)}
                        </Text>
                        <Text style={[styles.text, styles.subText]}>Friends</Text>
                    </View>
                    <View style={styles.statsBox}>
                        <Text style={[styles.text, { fontSize: 24 }]}>0</Text>
                        <Text style={[styles.text, styles.subText]}>Tokens</Text>
                    </View>
                </View>

                <View style={{ marginTop: 32 }}>
                    <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        {userInfo && userInfo.historyoftickets && userInfo.historyoftickets.length > 0 ? (
                        userInfo.historyoftickets.map((event, index) => {
                            const eventDate = new Date(event.dateAndHour);
                            const date = eventDate.getDate(); // Day of the month
                            const month = eventDate.toLocaleString('default', { month: 'long' });

                            return (
                            <View style={styles.mediaImageContainer} key={index}>
                                <ImageBackground
                                style={styles.ClubImage}
                                imageStyle={styles.ClubImage}
                                source={{ uri: event.image }}
                                >
                                <View style={styles.overlay}>
                                    <Text style={styles.dateTitle}>{date}</Text>
                                    <Text style={styles.monthTitle}>{month}</Text>
                                </View>
                                </ImageBackground>
                            </View>
                            );
                        })
                        ) : (
                        <Text>No past events found.</Text>
                        )}
                    </ScrollView>
                    <View style={styles.mediaCount}>
                    <Text style={[styles.text, { fontSize: 24, color: "#DFD8C8", fontWeight: "300" }]}>
                        {(userInfo?.userPastTickets?.length || 0)}
                        </Text>
                        <Text style={[styles.text, { fontSize: 12, color: "#DFD8C8", textTransform: "uppercase" }]}>Past Events</Text>
                    </View>
                </View>
                
            </ScrollView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    scrollContainer: {
        flex: 1,
        marginBottom: 0, // Add padding to the bottom
      },
      scrollViewContent: {
        paddingBottom: Dimensions.get('window').height*0.2, // Add padding to the bottom
      },

    text: {
        fontFamily: "HelveticaNeue",
        color: "#52575D"
    },
    image: {
        flex: 1,
        height: undefined,
        width: undefined
    },
    titleBar: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 24,
        marginHorizontal: 16
    },
    subText: {
        fontSize: 12,
        color: "#AEB5BC",
        textTransform: "uppercase",
        fontWeight: "500"
    },
    profileImage: {
        width: 200,
        height: 200,
        borderRadius: 100,
        overflow: "hidden"
    },
    dm: {
        backgroundColor: "#41444B",
        position: "absolute",
        top: 20,
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center"
    },
    active: {
        backgroundColor: "#34FFB9",
        position: "absolute",
        bottom: 28,
        left: 10,
        padding: 4,
        height: 20,
        width: 20,
        borderRadius: 10
    },
    add: {
        backgroundColor: "#41444B",
        position: "absolute",
        bottom: 0,
        right: 0,
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: "center",
        justifyContent: "center"
    },
    infoContainer: {
        alignSelf: "center",
        alignItems: "center",
        marginTop: 16
    },
    statsContainer: {
        flexDirection: "row",
        alignSelf: "center",
        marginTop: 32
    },
    statsBox: {
        alignItems: "center",
        flex: 1
    },
    mediaImageContainer: {
        width: 180,
        height: 200,
        borderRadius: 12,
        overflow: "hidden",
        marginHorizontal: 10
    },
    mediaCount: {
        backgroundColor: "#41444B",
        position: "absolute",
        top: "50%",
        marginTop: -50,
        marginLeft: 30,
        width: 100,
        height: 100,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 12,
        shadowColor: "rgba(0, 0, 0, 0.38)",
        shadowOffset: { width: 0, height: 10 },
        shadowRadius: 20,
        shadowOpacity: 1
    },
    recent: {
        marginLeft: 78,
        marginTop: 32,
        marginBottom: 6,
        fontSize: 10
    },
    recentItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 16
    },
    activityIndicator: {
        backgroundColor: "#CABFAB",
        padding: 4,
        height: 12,
        width: 12,
        borderRadius: 6,
        marginTop: 3,
        marginRight: 20
    },
    ClubImage: {
        flex: 1,
        width: '100%',
        height: 200,
        justifyContent: 'flex-end',
        borderRadius: 10,
      },
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
      },
      dateTitle: {
        color: 'white',
        fontSize: 40,
        textTransform: 'uppercase',
      },
      monthTitle: {
        color: 'white',
        fontSize: 20,
        textTransform: 'uppercase',
      },
});

export default Profile;