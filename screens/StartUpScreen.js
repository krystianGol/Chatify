import React, { useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch } from "react-redux";

import colors from "../constans/colors";
import { setDidTryAutoLogin } from "../store/authSlice";
import { getUserData } from "../utils/actions/userActions";
import { authenticate } from "../store/authSlice";

const StartUpScreen = () => {

    const dispatch = useDispatch();

    useEffect(() => {
        const tryLogin = async () => {
              const authInfo = await AsyncStorage.getItem("userData");
              if (!authInfo) {
                dispatch(setDidTryAutoLogin());
                return;
              }
            const parsedAuthInfo = JSON.parse(authInfo);
            const { token, userId, expiryDate: expiryDateString } = parsedAuthInfo;
            const expiryDate = new Date(expiryDateString);

            if (expiryDate <= new Date() || !token || !userId) {
                dispatch(setDidTryAutoLogin());
                return;
            }

            const userData = await getUserData(userId);
            dispatch(authenticate({ token: token, userData }));

          };
          tryLogin();
    }, [dispatch])

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color={colors.primaryColor} />
    </View>
  );
};

export default StartUpScreen;
