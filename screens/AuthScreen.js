import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import PageContainer from "../components/PageContainer";
import SignUpForm from "../components/SignUpForm";
import SignInForm from "../components/SignInForm";
import colors from "../constans/colors";

const AuthScreen = (props) => {
  const [isSignedUp, setIsSignedUp] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <PageContainer>
        <ScrollView>
          <KeyboardAvoidingView
            style={styles.keyboardAvoidView}
            behavior={Platform.OS === "ios" ? "height" : undefined}
            keyboardVerticalOffset={100}
          >
            {isSignedUp ? <SignInForm /> : <SignUpForm />}
            <TouchableOpacity
              onPress={() => setIsSignedUp((prevState) => !prevState)}
              style={styles.linkContainer}
            >
              <Text style={styles.link}>{`Switch to ${
                isSignedUp ? "Sign Up" : "Sign In"
              }`}</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </ScrollView>
      </PageContainer>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  linkContainer: {
    justifyContent: "flex-end",
    alignItems: "flex-end",
    marginVertical: 15,
    marginTop: 6,
  },
  link: {
    color: colors.blue,
    fontFamily: "medium",
    letterSpacing: 0.3,
  },
  keyboardAvoidView: {
    flex: 1,
    justifyContent: "center",
  },
});

export default AuthScreen;
