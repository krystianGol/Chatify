import React, { useRef, useState } from "react";
import { StyleSheet, Text, TouchableWithoutFeedback, View, Image } from "react-native";
import colors from "../constans/colors";
import uuid from "react-native-uuid";
import * as Clipboard from "expo-clipboard";
import { Feather, FontAwesome, Entypo } from "@expo/vector-icons";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { useSelector } from "react-redux";

function formatAmPm(dateString) {
  const date = new Date(dateString);
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  return hours + ":" + minutes + " " + ampm;
}

const MenuItem = (props) => {
  const Icon = props.iconPack ?? Feather;

  return (
    <MenuOption onSelect={props.onSelect}>
      <View style={styles.menuItemContainer}>
        <Text style={styles.menuText}>{props.text}</Text>
        <Icon name={props.icon} size={18} />
      </View>
    </MenuOption>
  );
};

const Bubble = (props) => {
  const storedUsers = useSelector((state) => state.users.storedUsers);

  const { text, type, date, replayingTo, imageUrl } = props;

  const bubbleStyle = { ...styles.container };
  const textStyle = { ...styles.text };
  const wrapperStyle = { ...styles.wrapperStyle };

  const menuRef = useRef(null);
  const id = useRef(uuid.v4());
  const dateString = date && formatAmPm(date);

  let Container = View;

  switch (type) {
    case "system":
      textStyle.color = "#65644A";
      bubbleStyle.backgroundColor = colors.beigne;
      bubbleStyle.alignItems = "center";
      bubbleStyle.marginTop = 10;
      break;
    case "error":
      bubbleStyle.backgroundColor = colors.red;
      textStyle.color = "white";
      bubbleStyle.marginTop = 10;
      break;
    case "myMessage":
      wrapperStyle.justifyContent = "flex-end";
      bubbleStyle.backgroundColor = colors.primaryColor;
      bubbleStyle.marginTop = 5;
      Container = TouchableWithoutFeedback;
      break;
    case "theirMessage":
      wrapperStyle.justifyContent = "flex-start";
      bubbleStyle.maxWidth = "90%";
      bubbleStyle.marginTop = 3;
      Container = TouchableWithoutFeedback;
      break;
    case "reply":
      bubbleStyle.backgroundColor = "#F2F2F2";
      break;
    default:
      break;
  }

  const copyToClipboard = async (text) => {
    await Clipboard.setStringAsync(text);
  };

  const replayingToUser = replayingTo && storedUsers[replayingTo.sentBy];

  return (
    <View style={wrapperStyle}>
      <Container
        onLongPress={() =>
          menuRef.current.props.ctx.menuActions.openMenu(id.current)
        }
        style={{ width: "100%" }}
      >
        <View style={bubbleStyle}>
          {replayingTo && (
            <Bubble
              type="replay"
              text={replayingTo.text}
              name={`${replayingToUser.firstName} ${replayingToUser.lastName}`}
            />
          )}
         { !imageUrl && <Text style={textStyle}>{text}</Text> }
          {
            imageUrl && 
              <Image 
                source={{ uri: imageUrl }}
                style={styles.image}
              />
          }
          {dateString && (
            <View style={styles.timeContainer}>
              <Text style={styles.time}>{dateString}</Text>
            </View>
          )}
          <Menu name={id.current} ref={menuRef}>
            <MenuTrigger />
            <MenuOptions>
              <MenuItem
                text="Copy to clipboard"
                icon={"copy"}
                onSelect={() => copyToClipboard(text)}
              />
              <MenuItem
                text="Replay"
                iconPack={Entypo}
                icon={"arrow-with-circle-left"}
                onSelect={props.setReplay}
              />
            </MenuOptions>
          </Menu>
        </View>
      </Container>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapperStyle: {
    flexDirection: "row",
    justifyContent: "center",
  },
  container: {
    backgroundColor: "white",
    borderRadius: 6,
    padding: 5,
    marginBottom: 10,
    borderColor: "#E2DACC",
    borderWidth: 1,
  },
  text: {
    fontFamily: "regular",
    letterSpacing: 0.3,
  },
  menuItemContainer: {
    flexDirection: "row",
    padding: 5,
  },
  menuText: {
    flex: 1,
    fontFamily: "regular",
    letterSpacing: 0.3,
    fontSize: 16,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  time: {
    fontFamily: "regular",
    letterSpacing: 0.3,
    color: colors.grey,
    fontSize: 12,
  },
  image: {
    width: 300,
    height: 300,
    marginBottom: 5
  }
});

export default Bubble;
