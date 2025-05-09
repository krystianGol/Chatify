import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import React from 'react'

import colors from '../constans/colors'

const SubmitButton = (props) => {

    const enabledBgColor = props.color || colors.primaryColor;
    const disabledBgColor = colors.lightGrey;
    const bgColor = props.disabled ? disabledBgColor : enabledBgColor;

  return (
    <TouchableOpacity 
        style={{
            ...styles.button, 
            ...props.style,
            ...{backgroundColor: bgColor}}}
        onPress={props.disabled ? () => {} : props.onPress}
        >
        <Text style={{ color: props.disabled ? colors.grey : 'white'}}>
        {props.title}
        </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
    button: {
        paddingHorizontal: 30,
        paddingVertical: 10,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export default SubmitButton