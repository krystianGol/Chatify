import React, { useReducer, useCallback } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";

import Input from "../components/Input";
import SubmitButton from "../components/SubmitButton";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/fromReducer";

const initialState = {
  inputValidities: {
      email: false,
      password: false,
  },
  formIsValid: false
}


const SignInForm = () => {
  const [formState, dispatchFormState] = useReducer(reducer, initialState);

  const inputChangedHandler = useCallback((inputId, inputValue) => {
            const result = validateInput(inputId, inputValue);
            dispatchFormState({ inputId, validationResult: result })
        }, [dispatchFormState])

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
        title="Sign In"
        onPress={() => console.log("Pressed")}
        style={{ marginTop: 20 }}
        disabled={!formState.formIsValid}
      />
    </>
  );
};

export default SignInForm;
