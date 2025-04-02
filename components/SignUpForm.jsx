import { View, Text, Alert, ActivityIndicator } from "react-native";
import React, { useCallback, useEffect, useReducer, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";

import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { signUp } from "../utils/actions/authAction";
import colors from "../constans/colors";
import { useDispatch, useSelector } from "react-redux";


const initialState = {
  inputValues: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  },
  inputValidities: {
      firstName: false,
      lastName: false,
      email: false,
      password: false,
  },
  formIsValid: false
}

const SignUpForm = () => {

  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [errorMessage, setErrorMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const inputChangedHandler = useCallback((inputId, inputValue) => {
          const result = validateInput(inputId, inputValue);
          dispatchFormState({ inputId, validationResult: result, inputValue })
      }, [dispatchFormState])

  
  useEffect(() => {
    if (errorMessage) {
      Alert.alert('An error occured', errorMessage);
    }
  }, [errorMessage])


  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);

      const action = signUp(
        formState.inputValues.firstName,
        formState.inputValues.lastName,
        formState.inputValues.email,
        formState.inputValues.password,
      );

      await dispatch(action);
      setErrorMessage(null);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message)
    }
  }, [dispatch, formState])

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
      { isLoading ? 
          <ActivityIndicator 
            size={'small'}
            color={colors.primaryColor}
            style={{ marginTop: 15}}
          />
          :
          <SubmitButton
          title="Sign Up"
          onPress={authHandler}
          style={{ marginTop: 20 }}
          disabled={!formState.formIsValid}
      />}
    </>
  );
};

export default SignUpForm;
