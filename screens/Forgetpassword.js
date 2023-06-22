import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions
} from "react-native";
import Background from "../components/Background";
import Btn from "../components/Btn";
import { darkGreen } from "../components/Constant_color";
import Field from "../components/Field";
import { useForgetPasswordMutation } from "../services/appApi";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const Forgetpassword = () => {
  const [email, setEmail] = useState("");
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");
  const [forgetPassword, { isLoading, error }] = useForgetPasswordMutation();

  async function handleForgetpassword() {
    try {
      if (email.endsWith("@student.ie.edu")) {
        const { data } = await forgetPassword({ email });
        navigation.navigate("VerifyForgetPassword", { email });
      } else {
        setMessage("Please enter valid IE email");
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Background>
      <View style={styles.container}>
        <View style={styles.form}>
          <Text style={styles.label}>Enter the email of your account</Text>
          <Field
            placeholder="Email / Username"
            keyboardType={"email-address"}
            onChangeText={(text) => setEmail(text)}
            value={email}
            containerStyle={styles.inputContainer}
          />
          <Btn
            Press={handleForgetpassword}
            textColor="white"
            bgColor={darkGreen}
            btnLabel="Next"
            btnStyle={styles.button}
          />
        </View>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    width: Dimensions.get("window").width,
    height: "100%"
  },
  title: {
    color: "white",
    fontSize: Dimensions.get("window").height * 0.06,
    fontWeight: "bold",
    marginTop: Dimensions.get("window").height * 0.03,
    marginBottom: Dimensions.get("window").height * 0.05
  },
  form: {
    backgroundColor: "white",
    height: Dimensions.get("window").height * 0.7,
    width: "90%",
    borderRadius: Dimensions.get("window").width * 0.12,
    paddingTop: Dimensions.get("window").height * 0.15,
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5
  },
  subTitle: {
    color: darkGreen,
    fontSize: Dimensions.get("window").height * 0.035,
    fontWeight: "bold"
  },
  label: {
    color: "#6C6C6C",
    fontSize: Dimensions.get("window").height * 0.02,
    marginBottom: Dimensions.get("window").height * 0.02
  },
  inputContainer: {
    width: "85%",
    height: Dimensions.get("window").height * 0.07,
    marginBottom: Dimensions.get("window").height * 0.02,
    borderWidth: 1,
    borderColor: "#6C6C6C",
    borderRadius: Dimensions.get("window").width * 0.08,
    paddingLeft: Dimensions.get("window").width * 0.04
  },
  forgotContainer: {
    alignSelf: "flex-end",
    marginRight: Dimensions.get("window").width * 0.05,
    marginBottom: Dimensions.get("window").height * 0.02
  },
  forgotText: {
    color: darkGreen,
    fontSize: Dimensions.get("window").height * 0.02,
    fontWeight: "bold",
    textDecorationLine: "underline"
  },
  button: {
    width: "35%",
    height: Dimensions.get("window").height * 0.01,
    marginTop: Dimensions.get("window").height * 0.03,
    borderRadius: Dimensions.get("window").width * 0.08,
    alignItems: "center",
    justifyContent: "center"
  },
  signupContainer: {
    flexDirection: "row",
    marginTop: Dimensions.get("window").height * 0.02
  },
  signupLabel: {
    color: "#6C6C6C",
    fontSize: Dimensions.get("window").height * 0.02
  },
  signupText: {
    color: darkGreen,
    fontSize: Dimensions.get("window").height * 0.02,
    fontWeight: "bold",
    textDecorationLine: "underline"
  }
});

export default Forgetpassword;
