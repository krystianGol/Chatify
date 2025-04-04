import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

import colors from '../constans/colors'

const PageTitle = (props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{props.title}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 10,
    },
    text: {
        fontSize: 28,
        color: colors.textColor,
        fontFamily: 'bold',
        letterSpacing: 0.3,
    }
})

export default PageTitle