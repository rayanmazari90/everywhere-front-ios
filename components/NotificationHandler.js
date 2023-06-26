import { useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import messaging from "@react-native-firebase/messaging";

export const useNotificationHandler = () => {
  messaging().onMessage(async (remoteMessage) => {
    console.log("A new FCM message arrived!", JSON.stringify(remoteMessage));
  });

  const navigation = useNavigation();

  const handleNavigation = (remoteMessage) => {
    if (remoteMessage) {
      navigation.navigate("Chats");
    }
  };

  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log(
      "Message received in the background!",
      JSON.stringify(remoteMessage)
    );
    handleNavigation(remoteMessage);
  });

  useEffect(() => {
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        "Notification caused app to open from background state:",
        remoteMessage
      );
      handleNavigation(remoteMessage);
    });

    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log(
            "Notification caused app to open from quit state:",
            remoteMessage
          );
          handleNavigation(remoteMessage);
        }
      });
  }, []);
};
