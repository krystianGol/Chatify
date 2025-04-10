import {
  View,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  FlatList,
  Text,
  Image,
  ActivityIndicator
} from "react-native";
import React, { useCallback, useState, useEffect, useRef } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { useSelector } from "react-redux";
import AwesomeAlert from 'react-native-awesome-alerts';

import colors from "../constans/colors";
import Bubble from "../components/Bubble";
import PageContainer from "../components/PageContainer";
import { creatChat, sendImage, sendTextMessage } from "../utils/actions/chatActions";
import ReplayTo from "../components/ReplayTo";
import { lunchImagePicker, openCamera, uploadImageAsync } from "../utils/imageHelper";

const ChatScreen = (props) => {
  const [chatId, setChatId] = useState(props.route?.params?.chatId);
  const [chatUsers, setChatUsers] = useState([]);
  const [messageText, setMessageText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [replayingTo, setReplayingTo] = useState();
  const [tempImageUri, setTempImageUri] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const storedUsers = useSelector((state) => state.users.storedUsers);
  const userData = useSelector((state) => state.auth.userData);
  const storedChats = useSelector((state) => state.chats.chatsData);

  const flatList = useRef();

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

      await sendTextMessage(chatId, userData.userId, messageText, replayingTo && replayingTo.key);
      setMessageText("");
      setReplayingTo(null);
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

  const pickImage = useCallback(async () => {
    try {
      const tempUri = await lunchImagePicker();
      if (!tempUri) return;

      setTempImageUri(tempUri);

    } catch (error) {
      console.log(error)
    }

  }, [tempImageUri])

  const uploadImage = useCallback(async () => {
    setIsLoading(true);

    try {
      let id = chatId;

      if (!id) {
        id = await creatChat(userData.userId, props.route.params.newChatData);
        setChatId(id);
      }

      const uploadUrl = await uploadImageAsync(tempImageUri, true);
      setIsLoading(false);

      await sendImage(id, userData.userId, uploadUrl, replayingTo && replayingTo.key);

      setReplayingTo(null);
      setTimeout(() => setTempImageUri(""), 500);
    } catch (error) {
      console.log(error);
    }
  }, [isLoading, tempImageUri, chatId])

  const takePhoto = useCallback(async () => {
    try {
      const tempUri = await openCamera();
      if (!tempUri) return;

      setTempImageUri(tempUri);

    } catch (error) {
      console.log(error)
    }

  }, [tempImageUri])

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
              ref={ref => flatList.current = ref}
              onContentSizeChange={() => flatList.current.scrollToEnd({ animated: false })}
              onLayout={() => flatList.current.scrollToEnd({ animated: false })}
              data={chatMessages}
              renderItem={(itemData) => {
                const message = itemData.item;
                const isOwnMessage = message.sentBy === userData.userId;
                const messageType = isOwnMessage ? "myMessage" : "theirMessage";

                return <Bubble 
                  type={messageType}
                  text={message.text}
                  date={message.sentAt}
                  setReplay={() => setReplayingTo(message)}
                  replayingTo={message.replayTo && chatMessages.find(i => i.key === message.replayTo)}
                  imageUrl={message.imageUrl}
                />
              }}
            />
          }
        </PageContainer>
        {
          replayingTo && 
            <ReplayTo
              text={replayingTo.text}
              user={storedUsers[replayingTo.sentBy]}
              onCancel={() => setReplayingTo()}
            />
        }
        <View style={styles.inputContainer}>
          <TouchableOpacity 
            style={styles.mediaButton}
            onPress={pickImage}
            >
            <Feather name="plus" size={24} color={colors.blue} />
          </TouchableOpacity>

          <TextInput
            style={styles.textBox}
            value={messageText}
            onChangeText={(text) => setMessageText(text)}
            onSubmitEditing={sendMessage}
          />

          {messageText === "" && (
            <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
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
          <AwesomeAlert 
            show={tempImageUri !== ""}
            title="Send image ?"
            closeOnTouchOutside={true}
            closeOnHardwareBackPress={false}
            showCancelButton={true}
            showConfirmButton={true}
            cancelText="Cancel"
            confirmText="Send"
            confirmButtonColor={colors.primaryColor}
            cancelButtonColor={colors.red}
            titleStyle={styles.popupTitleStyle}
            onCancelPressed={() => setTempImageUri("")}
            onConfirmPressed={uploadImage}
            onDismiss={() => setTempImageUri("")}
            customView={(
              <View>
                {
                  isLoading &&
                  <ActivityIndicator 
                    size={'small'}
                    colors={colors.primaryColor}
                  />
                }
                {
                  !isLoading && tempImageUri !== "" &&
                  <Image source={{ uri: tempImageUri }} style={{ width: 200, height: 200 }}/>
                }
              </View>
            )}
          />
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
  popupTitleStyle: {
    fontFamily: 'medium',
    letterSpacing: 0.3,
    color: colors.textColor
  }
});

export default ChatScreen;
