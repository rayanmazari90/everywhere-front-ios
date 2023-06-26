import React, { useState, useContext } from "react";
import { View, Text, Switch, StyleSheet, Image } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useRoute } from "@react-navigation/native";
import { darkGreen, green } from "../components/Constant_color";
import GhostModeContext from "../components/GhostModeContext";

const Settings = () => {
  const { isGhostModeEnabled, setIsGhostModeEnabled } =
    useContext(GhostModeContext);
  const route = useRoute();
  const userInfo = route.params?.userInfo;

  const toggleGhostMode = () => {
    console.log("HEY USERS", userInfo);
    setIsGhostModeEnabled((prev) => !prev);
  };

  return (
    <View style={styles.container}>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Profile:</Text>
        {/*<Image source={userInfo.image} />*/}
        <Text style={styles.value}>{userInfo.name}</Text>
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{userInfo.name}</Text>
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{userInfo.email}</Text>
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Year Bachelor: </Text>
        <Text style={styles.value}>{userInfo.UserYearBachelor}</Text>
      </View>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Ghost Mode:</Text>
        <View style={styles.toggleContainer}>
          <Switch
            value={isGhostModeEnabled}
            onValueChange={toggleGhostMode}
            trackColor={{ false: "#767577", true: darkGreen }}
            thumbColor={isGhostModeEnabled ? "#f4f3f4" : "#f4f3f4"}
          />
        </View>
      </View>
      <View style={styles.infoContainer}>
        <Ionicons name="information-circle" size={24} color="#888" />
        <Text style={styles.infoText}>
          The Ghost Mode won't take your location into account and won't let
          your friends know which party you are attending. However, you won't be
          able to see those clusters, and see the friends attending neither.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8
  },
  value: {
    fontSize: 16
  },
  toggleContainer: {
    marginLeft: "auto"
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20
  },
  infoText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#888"
  }
});

export default Settings;
