import { View, Text, StyleSheet, Button, FlatList } from "react-native";
import React, { useEffect } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";

import CustomHeaderButton from "../components/CustomHeaderButton";
import { useSelector } from "react-redux";
import { useNavigation, useRoute } from "@react-navigation/native";
import DataItem from "../components/DataItem";
import PageContainer from "../components/PageContainer";
import PageTitle from "../components/PageTitle";

const ChatListScreen = (props) => {
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);

  const userChats = useSelector((state) => {
    const chatsData = state.chats.chatsData;
    return Object.values(chatsData).sort((a, b) => {
      return new Date(b.updatedAt) - new Date(a.updatedAt)
    });
  });

  const selectedUser = props.route?.params?.selectedUserId;

  useEffect(() => {
    props.navigation.setOptions({
      headerRight: () => {
        return (
          <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
            <Item
              title="New chat"
              iconName="create-outline"
              onPress={() => props.navigation.navigate("NewChat")}
            />
          </HeaderButtons>
        );
      },
    });
  }, []);

  useEffect(() => {
    if (!selectedUser) {
      return;
    }

    const chatUsers = [selectedUser, userData.userId];

    const navigationProps = {
      newChatData: { users: chatUsers },
    };

    props.navigation.navigate("ChatScreen", navigationProps);
  }, [props.route?.params]);

  return (
    <PageContainer>
      <PageTitle title="Chats" />
      <FlatList
        data={userChats}
        renderItem={(itemData) => {
          const chatData = itemData.item;
          const chatId = chatData.key;

          const otherUserId = chatData.users.find(
            (uid) => uid !== userData.userId
          );
          const otherUser = storedUsers[otherUserId];

          if (!otherUser) return;

          return (
            <DataItem
              title={`${otherUser.firstName} ${otherUser.lastName}`}
              subtitle={chatData.latestMessageText || "New chat"}
              image={otherUser.profilePicture}
              onPress={() => props.navigation.navigate("ChatScreen", { chatId })}
            />
          );
        }}
      />
    </PageContainer>
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
