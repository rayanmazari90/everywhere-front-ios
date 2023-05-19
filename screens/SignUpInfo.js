import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import Background from '../components/Background';
import { darkGreen } from '../components/Constant_color';
import Btn from '../components/Btn';
import { useSelector } from 'react-redux';
import { useSignUpInfoMutation } from '../services/appApi';


const SignUpInfo = () => {

    
    const [gender, setGender] = useState('');
    const [selectedBachelor, setSelectedBachelor] = useState('');
    const [selectedYear, setSelectedYear] = useState('');
    const navigation = useNavigation();
    const [signupinfo, { isLoading: signupinfoisloading, error: signupinfoerror }] = useSignUpInfoMutation();
    const user = useSelector((state) => state.user);

    const signupinfos = async () => {
        console.log('user', user_);
        const userId = user && user.user ? user.user._id : null;
        if (!userId || !selectedBachelor || !gender || !selectedYear) {
            console.log('user', user, 'gender ', gender, 'selectedBachelor ', selectedBachelor,'selectedYear ', selectedYear );
            console.error("Required data is missing");
            return;
        }
        const numselectedYear = parseInt(selectedYear);
        console.log("year_selected" , numselectedYear);
        console.log("gender_selected" ,gender);
        console.log("bachelor_selected" ,selectedBachelor)
        try {
            await signupinfo({ userId: userId, selectedBachelor: selectedBachelor, gender: gender, selectedYear: selectedYear });
            navigation.navigate("Home");
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <Background>
            <View style={styles.container}>
                <Text style={styles.title}>Additional Info</Text>
                <View style={styles.form}>
                    <Text style={styles.label}>Gender</Text>
                    <View style={styles.select}>
                        <Picker selectedValue={gender} onValueChange={(itemValue) => setGender(itemValue)}>
                            <Picker.Item label="Male" value="Male" />
                            <Picker.Item label="Female" value="Female" />
                            <Picker.Item label="Other" value="Other" />
                        </Picker>
                    </View>
                    <Text style={styles.label}>Year Of Study</Text>
                    <View style={styles.select}>
                        <Picker selectedValue={selectedYear} onValueChange={(itemValue) => setSelectedYear(itemValue)}>
                            <Picker.Item label="1" value="1" />
                            <Picker.Item label="2" value="2" />
                            <Picker.Item label="3" value="3" />
                            <Picker.Item label="4" value="4" />
                            <Picker.Item label="5" value="5" />
                        </Picker>
                    </View>
                    <Text style={styles.label}>Bachelor</Text>
                    <View style={styles.select}>
                        <Picker
                            selectedValue={selectedBachelor}
                            onValueChange={(itemValue) => setSelectedBachelor(itemValue)}
                        >
                            <Picker.Item label="BACHELORS" value="" />
                            <Picker.Item label="BACHELOR IN COMPUTER SCIENCE AND ARTIFICIAL INTELLIGENCE" value="BCSAI" />
                            <Picker.Item label="BACHELOR IN BUSINESS ADMINISTRATION" value="BBA" />
                            <Picker.Item label="BACHELOR IN ECONOMICS" value="BIE" />
                            <Picker.Item label="BACHELOR IN DATA AND BUSINESS ANALYTICS" value="BDBA" />
                            <Picker.Item label="DUAL DEGREE IN BUSINESS ADMINISTRATION + INTERNATIONAL RELATIONS" value="BBA-BIR" />
                            <Picker.Item label="DUAL DEGREE IN BUSINESS ADMINISTRATION + LAWS" value="BBA-BL" />
                            <Picker.Item label="DUAL DEGREE IN BUSINESS ADMINISTRATION + DATA & BUSINESS ANALYTICS" value="BBA-BDBA" />
                            <Picker.Item label="DUAL DEGREE IN ECONOMICS + INTERNATIONAL RELATIONS" value="BIE-BIR" />
                            <Picker.Item label="BACHELOR IN BEHAVIOR AND SOCIAL SCIENCES" value="BBSS" />
                            <Picker.Item label="BACHELOR IN INTERNATIONAL RELATIONS" value="BIR" />
                            <Picker.Item label="BACHELOR IN LAWS" value="BL" />
                            <Picker.Item label="BACHELOR IN PHILOSOPHY, POLITICS, LAW AND ECONOMICS" value="PPLE" />
                            <Picker.Item label="BACHELOR IN APPLIED MATHEMATICS" value="BAM" />
                            <Picker.Item label="DUAL DEGREE IN PHILOSOPHY, POLITICS, LAW & ECONOMICS + DATA & BUSINESS ANALYTICS" value="PPLE-BDBA" />
                            <Picker.Item label="BACHELOR IN DESIGN" value="BD" />
                            <Picker.Item label="DUAL DEGREE IN BUSINESS ADMINISTRATION + DESIGN" value="BBA-BD" />
                            <Picker.Item label="BACHELOR IN COMMUNICATION AND DIGITAL MEDIA" value="BCDM" />
                            <Picker.Item label="BACHELOR IN URBAN STUDIES" value="BUS" />
                            <Picker.Item label="BACHELOR IN ARCHITECTURAL STUDIES" value="BAS" />
                            <Picker.Item label="DUAL DEGREE IN LAWS + INTERNATIONAL RELATIONS" value="BL-BIR" />
                            <Picker.Item label="BACHELOR IN ENVIRONMENTAL SCIENCES AND SUSTAINABILITY" value="BEESS" />
                        </Picker>
                    </View>
                    <Btn
                        textColor="white"
                        bgColor={darkGreen}
                        btnLabel="Next"
                        Press={signupinfos}
                    />
                    <Btn
                        textColor="white"
                        bgColor="grey"
                        btnLabel="Skip"
                        Press={() => navigation.navigate('Home')}
                    />
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
        fontSize: Dimensions.get('window').height * 0.05,
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
        justifyContent: 'space-around',
    },
    select: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 25,
        marginBottom: 40,
        width: '80%',
        height: Dimensions.get('window').height * 0.06,
        justifyContent: 'center',
    }
});

export default SignUpInfo;
