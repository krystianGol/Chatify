import React, { use, useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import ChatSettingsScreen from "../screens/ChatSettingsScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ChatListScreen from "../screens/ChatListScreen";
import ChatScreen from "../screens/ChatScreen";
import NewChatScreen from "../screens/NewChatScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useDispatch, useSelector } from "react-redux";
import { getFirebaseApp } from "../utils/firebaseHelper";
import {
  child,
  get,
  getDatabase,
  off,
  onValue,
  query,
  ref,
  set,
} from "firebase/database";
import { setChatsData } from "../store/chatSlice";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import colors from "../constans/colors";
import { setStoredUsers } from "../store/userSlice";
import { setChatMessages } from "../store/messagesSlice";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerTitle: "",
        headerShadowVisible: false,
      }}
    >
      <Tab.Screen
        name="ChatList"
        component={ChatListScreen}
        options={{
          tabBarLabel: "Chats",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="chatbubble-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: "Settings",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const StackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Group>
        <Stack.Screen
          name="Home"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ChatScreen"
          component={ChatScreen}
          //initialParams={{ selectedUserId: null }}
          options={{
            headerTitle: "",
            headerBackTitle: "Back",
          }}
        />
        <Stack.Screen
          name="ChatSettings"
          component={ChatSettingsScreen}
          options={{
            headerTitle: "Settings",
            headerBackTitle: "Back",
          }}
        />
      </Stack.Group>

      <Stack.Group screenOptions={{ presentation: "containedModal" }}>
        <Stack.Screen name="NewChat" component={NewChatScreen} />
      </Stack.Group>
    </Stack.Navigator>
  );
};

const MainNavigator = (props) => {
  const userData = useSelector((state) => state.auth.userData);
  const storedUsers = useSelector((state) => state.users.storedUsers);
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("Subscribing to firebase listeners");

    const app = getFirebaseApp();
    const db = ref(getDatabase(app));
    const userChatsRef = child(db, `userChats/${userData.userId}`);
    const refs = [userChatsRef];

    onValue(userChatsRef, (querySnapshot) => {
      const chatsIdsdata = querySnapshot.val() || {};
      const chatIds = Object.values(chatsIdsdata);

      const chatsData = {};
      let chatsCounter = 0;

      for (let i = 0; i < chatIds.length; i++) {
        const chatId = chatIds[i];
        const chatRef = child(db, `chats/${chatId}`);
        refs.push(chatRef);

        onValue(chatRef, (chatSnapshot) => {
          chatsCounter++;
          const data = chatSnapshot.val();

          if (data) {
            data.key = chatSnapshot.key;

            data.users.forEach(userId => {
              if (storedUsers[userId]) return;
              const userRef = child(db, `users/${userId}`);
              get(userRef)
                .then(userSnapshot => {
                  const userSnapshotData = userSnapshot.val();
  
                  dispatch(setStoredUsers({ newUsers: { userSnapshotData } }))
                })
              refs.push(userRef);
            })

            chatsData[chatSnapshot.key] = data;
          }

          if (chatsCounter >= chatIds.length) {
            dispatch(setChatsData({ chatsData }));
            setIsLoading(false);
          }
        });

        const messagesRef = child(db, `messages/${chatId}`);
        refs.push(messagesRef);

        onValue(messagesRef, (messagesSnapshot) => {
          const messagesData = messagesSnapshot.val();
          dispatch(setChatMessages({ chatId, messagesData }));
        })

        if (chatsCounter == 0) setIsLoading(false);
      }
    });

    return () => {
      console.log("Unsubscribing to firebase listeners");
      refs.forEach((ref) => off(ref));
    };
  }, []);

  if (isLoading) {
    <View style={ styles.indicatorContainer }>
      <ActivityIndicator
        size={"large"}
        color={colors.primaryColor}
        style={{ marginTop: 15 }}
      />
    </View>;
  }

  return <StackNavigator />;
};

const styles = StyleSheet.create({
  indicatorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default MainNavigator;
