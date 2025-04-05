import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React, { use, useState } from "react";
import Feather from "@expo/vector-icons/Feather";

import userImage from "../assets/Images/userImage.jpeg";
import colors from "../constans/colors";
import { lunchImagePicker, uploadImageAsync } from "../utils/imageHelper";
import { updateUserData } from "../utils/actions/authAction";
import { useDispatch } from "react-redux";
import { updateLoggedInUserData } from "../store/authSlice";

const ProfileImage = (props) => {
  const dispatch = useDispatch();
  const source = props.uri ? { uri: props.uri } : userImage;

  const [image, setImage] = useState(source);
  const [isLoading, setIsLoading] = useState(false);

  const showEditButton = props.showEditButton && props.showEditButton === true;

  const userId = props.userId;

  const pickImage = async () => {
    try {
      const tempImageUri = await lunchImagePicker();

      if (!tempImageUri) return;

      setIsLoading(true);
      const uploadUrl = await uploadImageAsync(tempImageUri);
      setIsLoading(false);
      if (!uploadUrl) {
        throw new Error("Could not upload image");
      }

      const newData = { profilePicture: uploadUrl };

      await updateUserData(userId, newData);

      dispatch(updateLoggedInUserData({ newData }));

      setImage({ uri: uploadUrl });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const Container = showEditButton ? TouchableOpacity : View;

  return (
    <Container onPress={pickImage}>
      {isLoading ? (
        <View
          height={props.size}
          width={props.size}
          style={styles.loadingContainer}
        >
          <ActivityIndicator size={"small"} color={colors.primaryColor} />
        </View>
      ) : (
        <Image
          style={{
            ...styles.image,
            ...{ height: props.size, width: props.size },
          }}
          source={image}
        ></Image>
      )}

      {showEditButton && !isLoading && (
        <View style={styles.editIconContainer}>
          <Feather name="edit-2" size={24} color="black" />
        </View>
      )}
    </Container>
  );
};

const styles = StyleSheet.create({
  image: {
    borderRadius: 50,
    borderColor: colors.grey,
    borderWidth: 1,
  },
  editIconContainer: {
    position: "absolute",
    bottom: -5,
    right: -8,
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ProfileImage;
