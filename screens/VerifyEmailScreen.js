import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useVerifyUserMutation } from "../services/appApi";
const VerifyEmailScreen = () => {
    const [code, setCode] = useState('');
    const [message, setMessage] = useState('');
    const navigation = useNavigation();
    const route = useRoute();
    const [verifyUser, { isLoading, error }] = useVerifyUserMutation();

    const handleVerifyEmail = async () => {
        try {
            const { data } = await verifyUser({
                email: route.params.email,
                code,
            });
            setMessage('Email address verified!');
            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            });
        } catch (err) {
            console.error(err);
            setMessage('Invalid verification code!');
        }
    };

    return (
        <View>
            <Text>Enter the verification code sent to your email:</Text>
            <TextInput value={code} onChangeText={setCode} placeholder="Verification code" />
            <Button title="Verify Email" onPress={handleVerifyEmail} />
            <Text>{message}</Text>
        </View>
    );
};

export default VerifyEmailScreen;
