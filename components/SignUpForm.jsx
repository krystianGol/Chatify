import { View, Text } from 'react-native'
import React from 'react'
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";

const SignUpForm = () => {
  return (
    <>
    <Input
          label="First name"
          icon="user-o"
          iconPack={FontAwesome}
          iconSize="20"
        />
        <Input
          label="Last name"
          icon="user-o"
          iconPack={FontAwesome}
          iconSize="20"
        />
        <Input
          label="Email"
          icon="mail-outline"
          iconPack={Ionicons}
          iconSize="20"
        />
        <Input
          label="Password"
          icon="lock"
          iconPack={AntDesign}
          iconSize="22"
        />
        <SubmitButton 
          title="Sign Up"
          onPress={() => console.log("Pressed")}
          style={{ marginTop: 20 }}
        />
    </>
  )
}

export default SignUpForm