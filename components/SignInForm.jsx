import React, { useReducer, useCallback, useState, useEffect } from "react";
import { Alert, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useDispatch } from "react-redux";

import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { signIn } from "../utils/actions/authAction";
import colors from "../constans/colors";

const isTestMode = true;

const initialState = {
  inputValues: {
    email: isTestMode ? "krystian@gmail.com" : "",
    password: isTestMode ? "123456" : "",
  },
  inputValidities: {
    email: isTestMode,
    password: isTestMode,
  },
  formIsValid: isTestMode,
};

const SignInForm = () => {
  const dispatch = useDispatch();

  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  useEffect(() => {
    if (errorMessage) {
      Alert.alert("An error occured", errorMessage);
    }
  }, [errorMessage]);

  const authHandler = useCallback(async () => {
    try {
      setIsLoading(true);

      const action = signIn(
        formState.inputValues.email,
        formState.inputValues.password
      );

      await dispatch(action);
      setErrorMessage(null);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage(error.message);
    }
  }, [dispatch, formState]);

  return (
    <>
      <Input
        id="email"
        label="Email"
        icon="mail-outline"
        iconPack={Ionicons}
        iconSize="20"
        keyboardType="email-address"
        autoCapitalize="none"
        errorText={formState.inputValidities["email"]}
        onInputChange={inputChangedHandler}
        initialValue={formState.inputValues.email}
      />
      <Input
        id="password"
        label="Password"
        icon="lock"
        iconPack={AntDesign}
        autoCapitalize="none"
        secureTextEntry={true}
        iconSize="22"
        errorText={formState.inputValidities["password"]}
        onInputChange={inputChangedHandler}
        initialValue={formState.inputValues.password}
      />
      {isLoading ? (
        <ActivityIndicator
          size={"small"}
          color={colors.primaryColor}
          style={{ marginTop: 15 }}
        />
      ) : (
        <SubmitButton
          title="Sign In"
          onPress={authHandler}
          style={{ marginTop: 20 }}
          disabled={!formState.formIsValid}
        />
      )}
    </>
  );
};

export default SignInForm;
