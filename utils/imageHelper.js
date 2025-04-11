import { View, Text, Platform } from "react-native";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import { getFirebaseApp } from "./firebaseHelper";
import uuid from 'react-native-uuid';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from "firebase/storage";

export const lunchImagePicker = async () => {
  //await checkMediaPermission();

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
};

const checkMediaPermission = async () => {
  if (Platform.OS !== "web") {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      return Promise.reject("We need permission to access your photos");
    }
  }
  return Promise.resolve();
};

export const uploadImageAsync = async (uri, isChatImage = false) => {
  const app = getFirebaseApp();

  const blob = await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      resolve(xhr.response);
    };
    xhr.onerror = function (e) {
      console.log(e);
      reject(new TypeError("Network request failed"));
    };
    xhr.responseType = "blob";
    xhr.open("GET", uri, true);
    xhr.send(null);
  });

  const pathFolder = isChatImage ? 'chatImages' : 'profilePics';
  const storageRef = ref(getStorage(app), `${pathFolder}/${uuid.v4()}`);
  await uploadBytesResumable(storageRef, blob);

  blob.close();

  return await getDownloadURL(storageRef);
};

export const openCamera = async () => {
  
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (permission.granted === false) {
    console.log("No permission")
    return;
  }

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
    allowsEditing: true,
    aspect: [1, 1],
    quality: 1,
  });

  if (!result.canceled) {
    return result.assets[0].uri;
  }
};