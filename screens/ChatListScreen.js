import { View, Text, StyleSheet, Button } from "react-native";
import React, { useEffect } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import CustomHeaderButton from "../components/CustomHeaderButton";
import { useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";

const ChatListScreen = (props) => {

  const userData = useSelector((state) => state.auth.userData);
  const selectedUser = props.route?.params?.selectedUserId;

  
  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
        <HeaderButtons
          HeaderButtonComponent={CustomHeaderButton}
        > 
          <Item 
            title="New chat"
            iconName='create-outline'
            onPress={() => props.navigation.navigate("NewChat")}
          />
        </HeaderButtons>
        )
      },
    });
  }, []);

  useEffect(() => {

    if (!selectedUser) {
      return;
    }

    const chatUsers = [selectedUser, userData.userId];
    
    const navigationProps = {
      newChatData: { users: chatUsers }
    }

    props.navigation.navigate("ChatScreen", navigationProps)
    
  }, [props.route?.params]);
  

  return (
    <View style={styles.container}>
      <Text>ChatListScreen</Text>
      <Button
        title="Go to chat screen"
        onPress={() => {
          props.navigation.navigate("ChatScreen");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ChatListScreen;
