import { getFirebaseApp } from "../firebaseHelper";
import { child, getDatabase, push, ref } from "firebase/database";

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