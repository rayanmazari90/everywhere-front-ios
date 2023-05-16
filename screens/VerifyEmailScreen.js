import React, { useState, useRef } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Dimensions } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useVerifyUserMutation } from "../services/appApi";

const VerifyEmailScreen = () => {
    const [verificationCode, setCode] = useState('');
    const [message, setMessage] = useState('');
    const inputRef1 = useRef(null);
    const inputRef2 = useRef(null);
    const inputRef3 = useRef(null);
    const inputRef4 = useRef(null);
    const navigation = useNavigation();
    const route = useRoute();
    const [verifyUser, { isLoading, error }] = useVerifyUserMutation();

    const handleVerifyEmail = async () => {
        try {
            const response = await verifyUser({
                email: route.params.email,
                verificationCode,
            });
            if (response.data.status === 200) {
                setMessage('Email address verified!');
                navigation.navigate('SignUpInfo');
            } else {
                setMessage('Invalid verification code!');
            }
        } catch (err) {
            console.error(err);
            setMessage('Try again');
        }
    };

    const handleTextChange = (text, index) => {
        // Automatically move focus to next input box after 1 character is entered
        if (text.length === 1 && index < 3) {
            switch (index) {
                case 0:
                    inputRef2.current.focus();
                    break;
                case 1:
                    inputRef3.current.focus();
                    break;
                case 2:
                    inputRef4.current.focus();
                    break;
                default:
                    break;
            }
        }
        // Update code state with the entered value
        let newCode = verificationCode.split('');
        newCode[index] = text;
        setCode(newCode.join(''));
        setMessage('');

    };

    return (

        <View style={styles.container}>
            <View style={styles.form}>
                <Text style={styles.title}>Enter the verification code sent to your email:</Text>
                <View style={styles.codeInputContainer}>
                    <TextInput
                        ref={inputRef1}
                        style={styles.codeInput}
                        maxLength={1}
                        keyboardType="number-pad"
                        onChangeText={(text) => handleTextChange(text, 0)}
                    />
                    <TextInput
                        ref={inputRef2}
                        style={styles.codeInput}
                        maxLength={1}
                        keyboardType="number-pad"
                        onChangeText={(text) => handleTextChange(text, 1)}
                    />
                    <TextInput
                        ref={inputRef3}
                        style={styles.codeInput}
                        maxLength={1}
                        keyboardType="number-pad"
                        onChangeText={(text) => handleTextChange(text, 2)}
                    />
                    <TextInput
                        ref={inputRef4}
                        style={styles.codeInput}
                        maxLength={1}
                        keyboardType="number-pad"
                        onChangeText={(text) => handleTextChange(text, 3)}
                    />
                </View>
                <View style={styles.verify}>
                    <Button style={styles.verifybutton} title="Verify Email" color="#ffff" onPress={handleVerifyEmail} />
                </View>
                <Text style={styles.message}>{message}</Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',

    },
    form: {

        marginVertical: 20,
        backgroundColor: 'white',
        height: Dimensions.get('window').height * 0.30,
        width: '90%',
        borderRadius: Dimensions.get('window').width * 0.12,
        paddingTop: Dimensions.get('window').height * 0.05,
        alignItems: 'center',
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,


    },
    codeInputContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,

    },

    codeInput: {
        width: 50,
        height: 50,
        borderWidth: 2,
        borderRadius: 5,
        marginHorizontal: 10,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: 'bold',
        borderColor: '#dedcdc',
        backgroundColor: '#dedcdc',
    },

    verify: {
        backgroundColor: '#022b73',
        borderRadius: 50,
        marginTop: 20,
    },


});

export default VerifyEmailScreen;