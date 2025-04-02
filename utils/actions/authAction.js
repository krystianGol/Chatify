import { getFirebaseApp } from "../firebaseHelper";
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { child, getDatabase, set, ref } from "firebase/database";
import { authenticate, logout } from "../../store/authSlice";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserData } from "./userActions";

let timer;

export const signUp = (firstName, lastName, email, password) => {
  return async (dispatch) => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid, stsTokenManager } = result.user;
      const { accessToken, expirationTime } = stsTokenManager;

      const userData = await createUser(firstName, lastName, email, uid);
      const expiryDate = new Date(expirationTime);

      const timeNow = new Date();
      const milisecondsUntilExpiry = expiryDate - timeNow;

      dispatch(authenticate({ token: accessToken, userData }));
      storeData(accessToken, uid, expiryDate);

      timer = setTimeout(() => {
        console.log("Set time out");
        dispatch(logoutUser());
      }, milisecondsUntilExpiry);
      
    } catch (error) {
      console.log(error);
      const errorCode = error.code;
      let message = "";

      if (errorCode === "auth/email-already-in-use") {
        message = "This email is already in use";
      }
      throw new Error(message);
    }
  };
};

export const logoutUser = () => {
  return async dispatch => {
    clearTimeout(timer); 
    await AsyncStorage.clear(); 
    dispatch(logout()); 
  };
};


export const signIn = (email, password) => {
  return async (dispatch) => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    try {
      const result = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const { uid, stsTokenManager } = result.user;
      const { accessToken, expirationTime } = stsTokenManager;

      const expiryDate = new Date(expirationTime);
      const userData = await getUserData(uid);
      const timeNow = new Date();
      const milisecondsUntilExpiry = expiryDate - timeNow;

      dispatch(authenticate({ token: accessToken, userData }));
      storeData(accessToken, uid, expiryDate);

      timer = setTimeout(() => {
        console.log("Set time out");
        dispatch(logoutUser());
      }, milisecondsUntilExpiry);

    } catch (error) {
      console.log(error);
      const errorCode = error.code;
      let message = "";

      if (errorCode === "auth/invalid-credential" || errorCode === "auth/user-not-found") {
        message = "Invalid email or password. Please try again.";
      }
      throw new Error(message);
    }
  };
};

const createUser = async (firstName, lastName, email, userId) => {
  const firstAndLastName = `${firstName} ${lastName}`.toLowerCase();
  const userData = {
    firstName,
    lastName,
    firstAndLastName,
    email,
    userId,
    signUpDate: new Date().toISOString(),
  };
  const db = ref(getDatabase());
  const childDbRef = child(db, `users/${userId}`);
  await set(childDbRef, userData);
  return userData;
};


const storeData = async (token, userId, expiryDate) => {
  try {
    await AsyncStorage.setItem("userData", JSON.stringify({
      token,
      userId,
      expiryDate: expiryDate.toISOString(),
    }));
  } catch (e) {
    console.log(e);
  }
};