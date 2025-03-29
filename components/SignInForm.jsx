import React from 'react'
import Ionicons from '@expo/vector-icons/Ionicons';
import AntDesign from '@expo/vector-icons/AntDesign';

import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";

const SignInForm = () => {
    return (
        <>
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
              title="Sign In"
              onPress={() => console.log("Pressed")}
              style={{ marginTop: 20 }}
            />
        </>
      )
}

export default SignInForm