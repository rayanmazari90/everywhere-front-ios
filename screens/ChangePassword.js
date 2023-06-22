import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Dimensions,
  TextInput
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import Background from "../components/Background";
import Btn from "../components/Btn";
import { darkGreen } from "../components/Constant_color";
import Field from "../components/Field";
import { useChangePasswordMutation } from "../services/appApi";
import { useNavigation, useRoute } from "@react-navigation/native";

const ChangePassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [changePassword, { isLoading, error }] = useChangePasswordMutation();
  const navigation = useNavigation();
  const { width, height } = Dimensions.get("window");
  const route = useRoute();
  const email = route.params.email;

  function isPasswordValid(password) {
    // Password should be at least 8 characters long
    if (password.length < 8) {
      return false;
    }

    // Password should contain at least one lowercase letter, one uppercase letter, one digit and one special character
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    console.log(regex.test(password));
    return regex.test(password);
  }

  async function handleChangePassword() {
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match");
      return;
    }
    try {
      if (isPasswordValid(password)) {
        changePassword({ email, password }).then(({ data }) => {
          if (data) {
            navigation.navigate("Login");
          }
        });
      } else {
        setMessage("Password is not secure");
      }
    } catch {
      console.error(error);
    }
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <Background>
      <View style={styles.container}>
        <Text style={styles.title}>Change Password</Text>
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Password"
              secureTextEntry={!showPassword}
              onChangeText={(text) => setPassword(text)}
              value={password}
            />
            <TouchableOpacity
              onPress={toggleShowPassword}
              style={styles.eyeIcon}
            >
              <Icon
                name={showPassword ? "visibility" : "visibility-off"}
                size={24}
                color="#6C6C6C"
              />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <TextInput
              placeholder="Confirm Password"
              secureTextEntry={!showConfirmPassword}
              onChangeText={(text) => setConfirmPassword(text)}
              value={confirmPassword}
            />
            <TouchableOpacity
              onPress={toggleShowConfirmPassword}
              style={styles.eyeIcon}
            >
              <Icon
                name={showConfirmPassword ? "visibility" : "visibility-off"}
                size={24}
                color="#6C6C6C"
              />
            </TouchableOpacity>
          </View>

          <Btn
            Press={handleChangePassword}
            textColor="white"
            bgColor={darkGreen}
            btnLabel="Change Password"
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
    borderRadius: 100,
    color: darkGreen,
    paddingHorizontal: 10,
    width: "70%",
    backgroundColor: "rgb(220,220, 220)",
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  eyeIcon: {
    position: "absolute", // Position the icon absolutely
    right: 5, // Set this to 0 to position the icon at the right end
    alignSelf: "center" // align it to center vertically within its parent
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

export default ChangePassword;
