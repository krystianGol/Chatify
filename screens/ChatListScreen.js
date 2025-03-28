import { View, Text, StyleSheet, Button } from 'react-native'
import React from 'react'

const ChatListScreen = props => {
  return (
    <View style={styles.container}>
      <Text>ChatListScreen</Text>
      <Button 
        title="Go to settings"
        onPress={() => {
            props.navigation.navigate("ChatSettings")
        }}
      />
    </View>
  )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default ChatListScreen