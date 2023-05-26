import React from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import Background from '../components/Background';
import Btn from '../components/Btn';
import { darkGreen, green } from '../components/Constant_color';

const Home = (props) => {
    const { width, height } = Dimensions.get('window');
    const isSmallScreen = width < 375; // or any other screen size

    return (
        <Background>
            <View style={[styles.container, isSmallScreen && styles.containerSmall]}>
                <Text style={[styles.title, isSmallScreen && styles.titleSmall]}>Everywhere</Text>
                <Text style={[styles.title, styles.title2, isSmallScreen && styles.titleSmall]}>Beta V0.1</Text>
                <Btn bgColor={green} textColor='white' btnLabel="Login" Press={() => props.navigation.navigate("Login")} />
                <Btn bgColor='white' textColor={darkGreen} btnLabel="Signup" Press={() => props.navigation.navigate("SignUp")} />
            </View>
        </Background>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 40,
        marginVertical: 100,
        alignItems: 'center',
    },
    containerSmall: {
        marginHorizontal: 20,
        marginVertical: 50,
    },
    title: {
        color: 'white',
        fontSize: 50,
    },
    titleSmall: {
        fontSize: 25,
    },
    title2: {
        marginBottom: 40,
    },
});

export default Home;