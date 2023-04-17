import React from 'react';
import { TextInput, View } from 'react-native';
import { darkGreen } from './Constant_color';

const Field = props => {
    const { rightElement, ...otherProps } = props;

    return (
        <View style={{ flexDirection: 'row', alignItems: 'center',justifyContent: 'space-between'  }}>
            <TextInput
                {...otherProps}
                style={{ borderRadius: 100, color: darkGreen, paddingHorizontal: 10, width: '70%', backgroundColor: 'rgb(220,220, 220)', marginVertical: 10 }}
                placeholderTextColor={darkGreen}
            />
            {rightElement && <View style={{ position: 'absolute', justifyContent:"center", right: 10, top: 10  }}>{rightElement}</View>}
        </View>
    );
};

export default Field;
