import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  ScrollView,
} from "react-native";
import React, { useCallback, useReducer, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";

import PageTitle from "../components/PageTitle";
import PageContainer from "../components/PageContainer";
import Input from "../components/Input";
import { validateInput } from "../utils/actions/formActions";
import { reducer } from "../utils/reducers/formReducer";
import { useDispatch, useSelector } from "react-redux";
import SubmitButton from "../components/SubmitButton";
import { updateUserData, logoutUser } from "../utils/actions/authAction";
import colors from "../constans/colors";
import { updateLoggedInUserData } from "../store/authSlice";
import ProfileImage from "../components/ProfileImage";

const SettingsScreen = (props) => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.auth.userData);

  const initialState = {
    inputValues: {
      firstName: userData.firstName || "",
      lastName: userData.lastName || "",
      email: userData.email || "",
      about: userData.about || "",
    },
    inputValidities: {
      firstName: undefined,
      lastName: undefined,
      email: undefined,
      about: undefined,
    },
    formIsValid: false,
  };

  const [formState, dispatchFormState] = useReducer(reducer, initialState);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const inputChangedHandler = useCallback(
    (inputId, inputValue) => {
      const result = validateInput(inputId, inputValue);
      dispatchFormState({ inputId, validationResult: result, inputValue });
    },
    [dispatchFormState]
  );

  const saveHandler = useCallback(async () => {
    const updatedValues = formState.inputValues;

    try {
      setIsLoading(true);
      await updateUserData(userData.userId, updatedValues);
      dispatch(updateLoggedInUserData({ newData: updatedValues }));

      setShowSuccessMessage(true);

      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error("❌ Save Error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [formState, dispatch]);

  return (
    <PageContainer>
      <PageTitle title="Settings" />

      <ScrollView>
        <View style={styles.imageContainer}>
        <ProfileImage 
          userId={userData.userId}
          size={70}
          uri={userData.profilePicture}
          showEditButton={true}
        />
        </View>

        <Input
          id="firstName"
          label="First name"
          icon="user-o"
          iconPack={FontAwesome}
          iconSize="20"
          errorText={formState.inputValidities["firstName"]}
          onInputChange={inputChangedHandler}
          initialValue={userData.firstName}
        />
        <Input
          id="lastName"
          label="Last name"
          icon="user-o"
          iconPack={FontAwesome}
          iconSize="20"
          errorText={formState.inputValidities["lastName"]}
          onInputChange={inputChangedHandler}
          initialValue={userData.lastName}
        />
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
          initialValue={userData.email}
        />
        <Input
          id="about"
          label="About me"
          icon="book-open"
          iconPack={Feather}
          iconSize="20"
          onInputChange={inputChangedHandler}
          errorText={formState.inputValidities["about"]}
          initialValue={userData.about}
        />
        <View style={{ marginTop: 20 }}>
          {showSuccessMessage && <Text>Saved!</Text>}
          {isLoading ? (
            <ActivityIndicator
              size={"small"}
              color={colors.primaryColor}
              style={{ marginTop: 15 }}
            />
          ) : (
            <SubmitButton
              title="Save"
              onPress={saveHandler}
              style={{ marginTop: 20 }}
              disabled={!formState.formIsValid}
            />
          )}
        </View>
        <SubmitButton
          title="Logout"
          onPress={() => dispatch(logoutUser())}
          style={{ marginTop: 20 }}
          color={colors.red}
        />
      </ScrollView>
    </PageContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
  }
})

export default SettingsScreen;
