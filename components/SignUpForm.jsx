import { View, Text } from "react-native";
import React, { useCallback, useReducer } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";

import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/fromReducer";


const initialState = {
  inputValidities: {
      firstName: false,
      lastName: false,
      email: false,
      password: false,
  },
  formIsValid: false
}

const SignUpForm = () => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback((inputId, inputValue) => {
          const result = validateInput(inputId, inputValue);
          dispatchFormState({ inputId, validationResult: result })
      }, [dispatchFormState])

  return (
    <>
      <Input
        id="firstName"
        label="First name"
        icon="user-o"
        iconPack={FontAwesome}
        iconSize="20"
        errorText={formState.inputValidities['firstName']}
        onInputChange={inputChangedHandler}
      />
      <Input
        id="lastName"
        label="Last name"
        icon="user-o"
        iconPack={FontAwesome}
        iconSize="20"
        errorText={formState.inputValidities['lastName']}
        onInputChange={inputChangedHandler}
      />
      <Input
        id="email"
        label="Email"
        icon="mail-outline"
        iconPack={Ionicons}
        iconSize="20"
        keyboardType="email-address"
        autoCapitalize="none"
        errorText={formState.inputValidities['email']}
        onInputChange={inputChangedHandler}
      />
      <Input
        id="password"
        label="Password"
        icon="lock"
        iconPack={AntDesign}
        autoCapitalize="none"
        secureTextEntry={true}
        iconSize="22"
        errorText={formState.inputValidities['password']}
        onInputChange={inputChangedHandler}
      />
      <SubmitButton
        title="Sign Up"
        onPress={() => console.log("Pressed")}
        style={{ marginTop: 20 }}
        disabled={!formState.formIsValid}
      />
    </>
  );
};

export default SignUpForm;
