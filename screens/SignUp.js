import React, { useState } from 'react';
import { Alert, View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import Background from '../components/Background';
import Btn from '../components/Btn';
import { darkGreen } from '../components/Constant_color';
import Field from '../components/Field';
import { useNavigation } from '@react-navigation/native';
import { useSignupUserMutation } from "../services/appApi";

const SignUp = (props) => {
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(null);
    const navigation = useNavigation();
    const [signupUser, { isLoading, error }] = useSignupUserMutation();
    function handleEmailChange(text) {
        setEmail(text);
        if (text.endsWith("@student.ie.edu")) {
            setIsEmailValid(true);
        } else {
            setIsEmailValid(false);
        }
    }

    function EmailValidityIndicator({ isValid }) {
        if (isValid === null) {
            return null;
        }
        const color = isValid ? "green" : "red";
        return (
            <View style={{ width: 10, height: 10, backgroundColor: color, borderRadius: 5, marginLeft: 5 }} />
        );
    }
    function isPasswordValid(password) {
        // Password should be at least 8 characters long
        if (password.length < 8) {
            return false;
        }

        // Password should contain at least one lowercase letter, one uppercase letter, one digit and one special character
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
        console.log(regex.test(password))
        return regex.test(password);
    }


    async function passtosignup() {
        try {
            if (email.endsWith("@student.ie.edu")) {
                if (isPasswordValid(password)) {
                    const { data } = await signupUser({ name, email, password });
                    navigation.navigate("SignUpInfo", { email });
                } else {
                    setMessage("Password is not secure")
                }
            } else {
                setMessage('Please enter valid IE email');

            }

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Background>
            <View style={styles.container}>
                <Text
                    style={styles.title}>
                    Register
                </Text>

                <View
                    style={styles.form}>
                    <Text style={styles.subTitle}>
                        Welcome to everywhere
                    </Text>
                    <Text
                        style={styles.label}>
                        Create a new account
                    </Text>
                    <Field placeholder="Name" onChangeText={(text) => setName(text)} value={name} />
                    <Field
                        placeholder="Email / Username"
                        keyboardType={'email-address'}
                        onChangeText={handleEmailChange}
                        value={email}
                        rightElement={<EmailValidityIndicator isValid={isEmailValid} />}
                    />


                    <Field
                        placeholder="Password"
                        secureTextEntry={true}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                    />
                    <Field
                        placeholder="Confirm Password"
                        secureTextEntry={true}
                        onChangeText={(text) => setConfirmPassword(text)}
                        value={confirmPassword}
                    />
                    <View style={{ width: '100%', alignItems: 'center' }}>
                        <View style={{ display: 'flex', flexDirection: 'row', width: '78%', paddingRight: 16, paddingTop: 10, paddingBottom: 10 }}>
                            <Text numberOfLines={3} ellipsizeMode="tail" style={{ color: 'grey', fontSize: 16, textAlign: "center" }}>
                                By signing up, you agree to our{' '}
                                <Text style={{ color: darkGreen, fontWeight: 'bold', fontSize: 16 }}>
                                    Terms & Conditions
                                </Text>
                                {' '}
                                <Text style={{ color: 'grey', fontSize: 16 }}>and </Text>
                                <Text style={{ color: darkGreen, fontWeight: 'bold', fontSize: 16 }}>
                                    Privacy Policy
                                </Text>
                            </Text>
                        </View>
                    </View>
                    <Btn
                        textColor="white"
                        bgColor={darkGreen}
                        btnLabel="Signup"
                        Press={passtosignup}
                    />
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'center',
                        }}>
                        <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
                            Already have an account?{' '}
                        </Text>
                        <TouchableOpacity
                            onPress={() => navigation.navigate('Login')}>
                            <Text
                                style={{
                                    color: darkGreen,
                                    fontWeight: 'bold',
                                    fontSize: 16,
                                }}>
                                Login
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Background>
    );
};


const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        width: Dimensions.get('window').width,
        height: '100%',
    },
    title: {
        color: 'white',
        fontSize: Dimensions.get('window').height * 0.06,
        fontWeight: 'bold',
        marginTop: Dimensions.get('window').height * 0.03,
        marginBottom: Dimensions.get('window').height * 0.05,
    },
    label: {
        color: '#6C6C6C',
        fontSize: Dimensions.get('window').height * 0.02,
        marginBottom: Dimensions.get('window').height * 0.02,
    },
    form: {
        flex: 1,
        backgroundColor: 'white',
        height: Dimensions.get('window').height * 0.7,
        width: '90%',
        borderRadius: Dimensions.get('window').width * 0.12,
        paddingTop: Dimensions.get('window').height * 0.1,
        alignItems: 'center',
        shadowColor: 'black',
        shadowOpacity: 1,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 5 },
        elevation: 5,
    },
    subTitle: {
        color: darkGreen,
        fontSize: Dimensions.get('window').height * 0.035,
        fontWeight: 'bold',
    },
});

export default SignUp;