import { View, Text } from 'react-native'
import React from 'react'
import { HeaderButton } from 'react-navigation-header-buttons'
import { Ionicons } from '@expo/vector-icons'
import colors from '../constans/colors'


const CustomHeaderButton = (props) => {
  return (
   <HeaderButton 
    {...props}
    IconComponent={Ionicons} 
    iconSize={23}
    color={props.color ?? colors.blue}
   />
  )
}

export default CustomHeaderButton