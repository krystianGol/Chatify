import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Text
} from "react-native";
import React, { useCallback, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useSelector } from "react-redux";

import colors from "../constans/colors";
import Bubble from "../components/Bubble";
import PageContainer from "../components/PageContainer";
import { creatChat, sendTextMessage } from "../utils/actions/chatActions";

const ChatScreen = (props) => {
  const [chatId, setChatId] = useState(props.route?.params?.chatId);
  const [chatUsers, setChatUsers] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const storedUsers = useSelector((state) => state.users.storedUsers);
  const userData = useSelector((state) => state.auth.userData);
  const storedChats = useSelector((state) => state.chats.chatsData);
  const chatMessages = useSelector((state) => {
    if (!chatId) return [];

    const chatMessagesData = state.messages.messagesData[chatId];

    if (!chatMessagesData) return [];

    const messageList = [];

    for (const key in chatMessagesData) {
      const message = chatMessagesData[key];
      messageList.push({
        key,
        ...message,
      });
    }
    return messageList;
  });

  console.log("Message list", chatMessages);

  const chatData =
    (chatId && storedChats[chatId]) || props.route?.params?.newChatData;
  const sendMessage = useCallback(async () => {
    try {
      let id = chatId;

      if (!id) {
        id = await creatChat(userData.userId, props.route.params.newChatData);
        setChatId(id);
      }

      await sendTextMessage(chatId, userData.userId, messageText);
      setMessageText("");
    } catch (error) {
      setErrorMessage("Something went wrong");
      setTimeout(() => {
        setErrorMessage("");
      }, 4000);
      console.log(error);
    }
  }, [messageText, chatId]);

  const setTitle = () => {
    const otherUserId = chatUsers.find((uid) => uid !== userData.userId);
    const otherUserData = storedUsers[otherUserId];

    return (
      otherUserData && `${otherUserData.firstName} ${otherUserData.lastName}`
    );
  };

  useEffect(() => {
    props.navigation.setOptions({
      headerTitle: setTitle(),
    });

    setChatUsers(chatData.users);
  }, [chatUsers]);

  return (
    <SafeAreaView style={styles.container} edges={["left", "right", "bottom"]}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={100}
      >
        <PageContainer>
          {!chatId && <Bubble text="This is new chat say Hi !" type="system" />}
          {errorMessage !== "" && <Bubble text={errorMessage} type="error" />}
          {
            chatId && 
            <FlatList 
              data={chatMessages}
              renderItem={(itemData) => {
                const message = itemData.item;
                const isOwnMessage = message.sentBy === userData.userId;
                const messageType = isOwnMessage ? "myMessage" : "theirMessage";
                return <Bubble 
                  title={message.text}
                  type={messageType}
                />
              }}
            />
          }
        </PageContainer>
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.mediaButton}>
            <Feather name="plus" size={24} color={colors.blue} />
          </TouchableOpacity>

          <TextInput
            style={styles.textBox}
            value={messageText}
            onChangeText={(text) => setMessageText(text)}
            onSubmitEditing={sendMessage}
          />

          {messageText === "" && (
            <TouchableOpacity style={styles.mediaButton}>
              <Feather name="camera" size={24} color={colors.blue} />
            </TouchableOpacity>
          )}

          {messageText !== "" && (
            <TouchableOpacity
              style={{ ...styles.mediaButton, ...styles.sendButton }}
              onPress={sendMessage}
            >
              <Feather name="send" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 10,
    height: 50,
    marginTop: "auto",
  },
  textBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: 50,
    borderColor: colors.lightGrey,
    marginHorizontal: 15,
    paddingHorizontal: 12,
  },
  mediaButton: {
    alignItems: "center",
    justifyContent: "center",
  },
  sendButton: {
    backgroundColor: colors.blue,
    borderRadius: 50,
    padding: 8,
  },
  screen: {
    flex: 1,
  },
});

export default ChatScreen;
