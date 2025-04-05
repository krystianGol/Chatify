import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { useSelector } from "react-redux";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import MainNavigator from "./MainNavigator";
import ChatListScreen from "../screens/ChatListScreen";
import AuthScreen from "../screens/AuthScreen";
import StartUpScreen from "../screens/StartUpScreen";


const AppNavigator = (props) => {

  const isAuth = useSelector(state => state.auth.token !== null && state.auth.token !== "");
  const didTryAutoLogin = useSelector(state => state.auth.didTryAutoLogin);

  return (
    
    //<GestureHandlerRootView>
    <NavigationContainer>
      {isAuth && <MainNavigator />}
      {!isAuth && didTryAutoLogin && <AuthScreen/>}
      {!isAuth && !didTryAutoLogin && <StartUpScreen/>}
    </NavigationContainer>
    //</GestureHandlerRootView>
  );
};

export default AppNavigator;
