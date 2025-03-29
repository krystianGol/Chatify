import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";

import MainNavigator from "./MainNavigator";
import ChatListScreen from "../screens/ChatListScreen";
import AuthScreen from "../screens/AuthScreen";


const AppNavigator = (props) => {

  const isAuth = false;
  
  return (
    <NavigationContainer>
      {isAuth && <MainNavigator />}
      {!isAuth && <AuthScreen/>}
    </NavigationContainer>
  );
};

export default AppNavigator;
