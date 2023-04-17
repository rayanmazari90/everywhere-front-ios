import { Text, View, Image, StyleSheet, Pressable } from 'react-native';
import {url_back}  from "../components/connection_url";
import { useNavigation } from '@react-navigation/native';

const AddfriendItem = ({ friend }) => {
    const navigation = useNavigation();

    const handleAddFriend = async () => {
        const userId = "6414482b701c7ee1663e47c3"
        console.log(friend._id)
        const friendIds = [friend._id]; // assuming friend has an "id" property

        try {
            const response = await fetch(url_back+`/users/${userId}/friends`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ friendIds }),
            });
            const data = await response.json();
            console.log(data); // do something with the response data, such as updating the UI
        } catch (error) {
            console.error(error);
        }
    };
    return (
        <Pressable onPress={handleAddFriend} style={styles.container}>
            <View style={styles.content}>
                <View style={styles.row}>
                    <Text numberOfLines={1} style={styles.name}>
                        {friend.name}
                    </Text>
                </View>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 5,
        height: 70,
    },
    content: {
        flex: 1,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: 'lightgray',
    },
    row: {
        flexDirection: 'row',
        marginBottom: 5,
    },
    name: {
        flex: 1,
        fontWeight: 'bold',
    }
})

export default AddfriendItem;