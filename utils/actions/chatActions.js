import { getFirebaseApp } from "../firebaseHelper";
import { child, getDatabase, push, ref, update } from "firebase/database";

export const creatChat = async (loggedInUserId, chatData) => {
    const newChatData = {
        ...chatData,
        createdBy: loggedInUserId,
        updatedBy: loggedInUserId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const app = getFirebaseApp();
    const db = ref(getDatabase(app));
    const newChat = await push(child(db, 'chats'), newChatData);

    const chatUsers = newChatData.users;
    for (let index = 0; index < chatUsers.length; index++) {
        const userId = chatUsers[index];   
        await push(child(db, `userChats/${userId}`), newChat.key)
    }               
    return newChat.key;
}

export const sendTextMessage = async (chatId, senderId, messageText, replayTo) => {
    const app = getFirebaseApp();
    const db = ref(getDatabase(app));
    const messagesRef = child(db, `messages/${chatId}`);

    const messageData = {
        sentBy: senderId,
        sentAt: new Date().toISOString(),
        text: messageText,
    }

    if (replayTo) {
        messageData.replayTo = replayTo;
    }

    await push(messagesRef, messageData);

    const chatRef = child(db, `chats/${chatId}`);
    await update(chatRef, {
        updatedBy: senderId,
        updatedAt: new Date().toISOString(),
        latestMessageText: messageText,
    })
}