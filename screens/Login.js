
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, Dimensions, StyleSheet } from 'react-native';
import Background from '../components/Background';
import Btn from '../components/Btn';
import { darkGreen } from '../components/Constants';
import Field from '../components/Field';
import { useLoginUserMutation } from "../services/appApi";
import { useNavigation } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginUser, { isLoading, error }] = useLoginUserMutation();
    const navigation = useNavigation();
    const [showPassword, setShowPassword] = useState(false);
    const { width, height } = Dimensions.get('window');

    async function handleLogin() {
        try {
            /*const { data } = await loginUser({ email, password });*/
            /*console.log(data);*/

            navigation.reset({
                index: 0,
                routes: [{ name: 'Main' }],
            });
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <Background>
            <View style={styles.container}>
                <Text
                    style={styles.title}>
                    Login
                </Text>
                <View style={styles.form}>
                    <Text style={styles.subTitle}>
                        Welcome Back
                    </Text>
                    <Text style={styles.label}>
                        Login to your account
                    </Text>
                    <Field
                        placeholder="Email / Username"
                        keyboardType={'email-address'}
                        onChangeText={(text) => setEmail(text)}
                        value={email}
                        containerStyle={styles.inputContainer}
                    />
                    <Field
                        placeholder="Password"
                        secureTextEntry={!showPassword}
                        onChangeText={(text) => setPassword(text)}
                        value={password}
                        containerStyle={styles.inputContainer}
                        rightElement={<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Text style={styles.showHideButton}>{showPassword ? <MaterialCommunityIcons style={styles.send} name="eye-remove" size={20} color={darkGreen}/> : <MaterialCommunityIcons style={styles.send} name="eye" size={20} color={darkGreen}/>}</Text>
                            </TouchableOpacity>}
                    />
                    <View style={styles.forgotContainer}>
                        <TouchableOpacity /*onPress={() => navigation.navigate('ForgotPassword')}*/>
                            <Text style={styles.forgotText}>
                                Forgot Password ?
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <Btn
                        Press={handleLogin}
                        textColor="white"
                        bgColor={darkGreen}
                        btnLabel="Sign in"
                        btnStyle={styles.button}
                    />
                    <View style={styles.signupContainer}>
                        <Text style={styles.signupLabel}>
                            Don't have an account?{' '}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                            <Text style={styles.signupText}>
                                Signup
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
    form: {
        backgroundColor: 'white',
        height: Dimensions.get('window').height * 0.7,
        width: '90%',
        borderRadius: Dimensions.get('window').width * 0.12,
        paddingTop: Dimensions.get('window').height * 0.15,
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
    label: {
        color: '#6C6C6C',
        fontSize: Dimensions.get('window').height * 0.02,
        marginBottom: Dimensions.get('window').height * 0.02,
    },
    inputContainer: {
        width: '85%',
        height: Dimensions.get('window').height * 0.07,
        marginBottom: Dimensions.get('window').height * 0.02,
        borderWidth: 1,
        borderColor: '#6C6C6C',
        borderRadius: Dimensions.get('window').width * 0.08,
        paddingLeft: Dimensions.get('window').width * 0.04,
    },
    forgotContainer: {
        alignSelf: 'flex-end',
        marginRight: Dimensions.get('window').width * 0.05,
        marginBottom: Dimensions.get('window').height * 0.02,
    },
    forgotText: {
        color: darkGreen,
        fontSize: Dimensions.get('window').height * 0.02,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
    button: {
        width: '35%',
        height: Dimensions.get('window').height * 0.01,
        marginTop: Dimensions.get('window').height * 0.03,
        borderRadius: Dimensions.get('window').width * 0.08,
        alignItems: 'center',
        justifyContent: 'center',
    },
    signupContainer: {
        flexDirection: 'row',
        marginTop: Dimensions.get('window').height * 0.02,
    },
    signupLabel: {
        color: '#6C6C6C',
        fontSize: Dimensions.get('window').height * 0.02,
    },
    signupText: {
        color: darkGreen,
        fontSize: Dimensions.get('window').height * 0.02,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
    },
});
    
    export default Login;
