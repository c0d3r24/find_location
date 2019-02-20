import React from 'react';
import { TextInput } from 'react-native';
import {colors} from './../../utils/colors';

const Input = ({value, onChangeText,placeholder, secureTextEntry,placeholderTextColor, customStyle}) => {
    return (
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor}
            style={[styles.input, customStyle]}
            secureTextEntry={secureTextEntry}
        />
    )
};

const styles = {
    input: {
        width: "80%",
        height: 44,
        padding: 10,
        borderBottomWidth: 1,
        borderColor: colors.inputBorderColor,
        marginBottom: 10,
        color: colors.inputTextColor,
        fontSize: 18,
    }
};
export { Input };