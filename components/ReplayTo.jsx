import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import React from "react";
import Fontisto from "@expo/vector-icons/Fontisto";

import colors from "../constans/colors";

const ReplayTo = (props) => {
  const { text, user, onCancel } = props;
  const name = `${user.firstName} ${user.lastName}`;

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>

        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text numberOfLines={1}>{text}</Text>
      </View>
      <TouchableOpacity onPress={onCancel}>
          <Fontisto name="close" size={24} color={colors.blue} />
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.extraLightGrey,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
    borderLeftColor: colors.blue,
    borderLeftWidth: 4,
  },
  textContainer: {
    flex: 1,
    marginRight: 5,
  },
  name: {
    color: colors.blue,
    fontFamily: "medium",
    letterSpacing: 0.3,
  },
});

export default ReplayTo;
