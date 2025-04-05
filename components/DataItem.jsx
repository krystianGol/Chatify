import { View, Text, StyleSheet, TouchableWithoutFeedback } from "react-native";
import React from "react";

import ProfileImage from "./ProfileImage"
import colors from "../constans/colors";

const DataItem = (props) => {
  const { title, subtitle, image } = props;

  return (
    <TouchableWithoutFeedback>
      <View style={styles.container}>
        <ProfileImage 
            uri={image}
            size={40}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text numberOfLines={1} style={styles.subtitle}>
            {subtitle}
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
          flexDirection: 'row',
          paddingVertical: 7,
          borderBottomColor: colors.extraLightGrey,
          borderBottomWidth: 1,
          alignItems: 'center',
          minHeight: 50
      },
      textContainer: {
          marginLeft: 14
      },
      title: {
          fontFamily: 'medium',
          fontSize: 16,
          letterSpacing: 0.3
      },
      subtitle: {
          fontFamily: 'regular',
          color: colors.grey,
          letterSpacing: 0.3
      }
});

export default DataItem;
