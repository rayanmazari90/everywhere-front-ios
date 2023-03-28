import React from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';

export default function Btn({ bgColor, btnLabel, textColor, Press }) {
    const { width, height } = Dimensions.get('window');
    const buttonWidth = width * 0.8; // adjust the percentage as needed

    return (
        <TouchableOpacity
            onPress={Press}
            style={{
                backgroundColor: bgColor,
                borderRadius: 100,
                alignItems: 'center',
                width: buttonWidth,
                paddingVertical: 5,
                marginVertical: 10,
                shadowColor: 'black',
                shadowOpacity: 0.5,
                shadowRadius: 10,
                shadowOffset: { width: 0, height: 10 },
                elevation: 5,
            }}>
            <Text style={{ color: textColor, fontSize: 0.04 * height, fontWeight: 'bold' }}>
                {btnLabel}
            </Text>
        </TouchableOpacity>
    );
}

