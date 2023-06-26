import React, { useState, useLayoutEffect } from "react";
import {
  Alert,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  KeyboardAvoidingView
} from "react-native";
import Background from "../components/Background";
import Btn from "../components/Btn";
import { darkGreen } from "../components/Constant_color";
import Field from "../components/Field";
import { useNavigation } from "@react-navigation/native";
import { useSignupUserMutation } from "../services/appApi";
import Icon from "react-native-vector-icons/MaterialIcons";

const SignUp = () => {
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
      headerShown: true,
      headerTransparent: true
    });
  }, []);
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(null);
  const navigation = useNavigation();
  const [signupUser, { isLoading, error }] = useSignupUserMutation();
  function handleEmailChange(text) {
    setEmail(text);
    if (text.endsWith("@student.ie.edu")) {
      setIsEmailValid(true);
    } else {
      setIsEmailValid(false);
    }
  }

  function EmailValidityIndicator({ isValid }) {
    if (isValid === null) {
      return null;
    }
    const color = isValid ? "green" : "red";
    return (
      <View
        style={{
          width: 10,
          height: 10,
          backgroundColor: color,
          borderRadius: 5,
          marginLeft: 5
        }}
      />
    );
  }
  function isPasswordValid(password) {
    if (password.length < 8) {
      return false;
    }
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,}$/;
    return regex.test(password);
  }

  async function passtosignup() {
    if (
      name.trim() === "" ||
      email.trim() === "" ||
      password.trim() === "" ||
      confirmPassword.trim() === ""
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill in all the required fields."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    if (!isPasswordValid(password)) {
      Alert.alert(
        "Error",
        "Password is not secure. It should be at least 8 characters long, contain a lowercase letter, an uppercase letter, a digit, and a special character."
      );
      return;
    }

    try {
      if (email.endsWith("@student.ie.edu")) {
        const response = await signupUser({ name, email, password });

        if (response.error) {
          const errorMessage = response.error.data.message;

          if (errorMessage === "Email is already registered") {
            Alert.alert("Error", "Email is already registered");
          } else if (errorMessage === "Name is already registered") {
            Alert.alert("Error", "Name is already registered");
          } else {
            Alert.alert("Error", "An error occurred");
          }

          return; // Important to return here to prevent proceeding in case of an error.
        }

        navigation.navigate("SignUpInfo", { email });
      } else {
        setMessage("Please enter a valid IE email");
      }
    } catch (error) {
      console.log("here");
      Alert.alert("Something went wrong!");
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
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.container}
      >
        <View style={styles.container}>
          {/*<Text
                    style={styles.title}>
                    Register
    </Text>*/}

          <View style={styles.form}>
            <Text style={styles.subTitle}>Welcome to Everywhere</Text>
            <Text style={styles.label}>Create a new account</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Name"
                onChangeText={(text) => setName(text)}
                value={name}
              />
            </View>
            <View
              style={[
                styles.inputContainer,
                { justifyContent: "space-between" }
              ]}
            >
              <TextInput
                placeholder="Email / Username"
                keyboardType={"email-address"}
                onChangeText={handleEmailChange}
                value={email}
                style={{ flex: 1 }}
              />
              <EmailValidityIndicator isValid={isEmailValid} />
            </View>
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
            <View style={{ width: "100%", alignItems: "center" }}>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  width: "78%",
                  paddingRight: 16,
                  paddingTop: 10,
                  paddingBottom: 10
                }}
              >
                <Text
                  numberOfLines={3}
                  ellipsizeMode="tail"
                  style={{ color: "grey", fontSize: 16, textAlign: "center" }}
                >
                  By signing up, you agree to our{" "}
                  <Text
                    style={{
                      color: darkGreen,
                      fontWeight: "bold",
                      fontSize: 16
                    }}
                  >
                    Terms & Conditions
                  </Text>{" "}
                  <Text style={{ color: "grey", fontSize: 16 }}>and </Text>
                  <Text
                    style={{
                      color: darkGreen,
                      fontWeight: "bold",
                      fontSize: 16
                    }}
                  >
                    Privacy Policy
                  </Text>
                </Text>
              </View>
            </View>
            <Btn
              textColor="white"
              bgColor={darkGreen}
              btnLabel="Signup"
              Press={passtosignup}
            />
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center"
              }}
            >
              <Text style={{ fontSize: 16, fontWeight: "bold" }}>
                Already have an account?{" "}
              </Text>
              <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                <Text
                  style={{
                    color: darkGreen,
                    fontWeight: "bold",
                    fontSize: 16
                  }}
                >
                  Login
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  label: {
    color: "#6C6C6C",
    fontSize: Dimensions.get("window").height * 0.025,
    marginBottom: Dimensions.get("window").height * 0.02
  },
  form: {
    top: 40,
    flex: 1,
    backgroundColor: "white",
    height: Dimensions.get("window").height * 0.85,
    width: "90%",
    borderRadius: Dimensions.get("window").width * 0.12,
    paddingTop: Dimensions.get("window").height * 0.05,
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 5 },
    elevation: 5
  },
  subTitle: {
    color: darkGreen,
    fontSize: Dimensions.get("window").height * 0.045,
    fontWeight: "bold",
    top: 5
  },
  inputContainer: {
    borderRadius: 100,
    height: 50,
    color: darkGreen,
    paddingHorizontal: 10,
    width: "80%",
    backgroundColor: "rgb(220,220, 220)",
    marginVertical: 10,
    flexDirection: "row",
    alignItems: "center"
  },
  eyeIcon: {
    position: "absolute", // Position the icon absolutely
    right: 5, // Set this to 0 to position the icon at the right end
    alignSelf: "center" // align it to center vertically within its parent
  }
});

export default SignUp;
