import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  Alert,
  Modal,
  Dimensions,
  ActivityIndicator
} from "react-native";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useSelector } from "react-redux";
import {
  useFindSenderMutation,
  useDeleteMessageMutation
} from "../../services/appApi";
import Video from "react-native-video";
import VideoPlayer from "react-native-video-controls";
dayjs.extend(relativeTime);

const Message = ({
  message,
  prevSenderId,
  prevSenderIdreverse,
  onMessageAction
}) => {
  const user = useSelector((state) => state.user);
  const [
    findSender,
    { isLoading: findSenderIsLoading, error: findSenderError }
  ] = useFindSenderMutation();
  const [senderUser, setSenderUser] = useState(null);
  const [
    deleteMessage,
    { isLoading: deleteMessageIsLoading, error: deleteMessageError }
  ] = useDeleteMessageMutation();
  const [timerId, setTimerId] = useState(null);
  const [imageModalVisible, setImageModalVisible] = useState(false);
  const [selectedImageUri, setSelectedImageUri] = useState(null);
  const [videoPaused, setVideoPaused] = useState(true);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideoUri, setSelectedVideoUri] = useState(null);

  const handleDeleteMessageAlert = () => {
    if (isMyMessage()) {
      Alert.alert(
        "Delete Message?",
        "Do you want to delete this message?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          {
            text: "OK",
            onPress: handleDeleteMessage
          }
        ],
        { cancelable: false }
      );
    }
  };

  const handleDeleteMessage = async () => {
    try {
      await deleteMessage({ messageId: message._id });
      onMessageAction();
      console.log("Message deleted:", message);
    } catch (error) {
      console.error("Failed to delete message:", error);
    }
  };

  const handleImageClick = (imageUri) => {
    setSelectedImageUri(imageUri);
    setImageModalVisible(true);
  };

  const handleVideoClick = (videoUri) => {
    setSelectedVideoUri(videoUri);
    setVideoModalVisible(true);
  };

  const samesender = () => {
    return message.sender === prevSenderId;
  };

  const findthesender = async () => {
    findSender({ senderId: message.sender })
      .then((result) => {
        setSenderUser(result.data);
      })
      .catch((error) => {
        console.error("Error fetching sender:", error);
      });
  };

  const isMyMessage = () => {
    return message.sender === user.user._id;
  };

  useEffect(() => {
    if (!isMyMessage()) {
      findthesender();
    }
  }, [message]);

  const getSenderImage = () => {
    if (isMyMessage()) {
      return user.user.image;
    } else {
      if (message.sender !== prevSenderId) {
        return senderUser ? senderUser.image : null;
      }
      return null;
    }
  };

  const getSenderName = () => {
    if (isMyMessage()) {
      return user.user.name;
    } else {
      if (message.sender !== prevSenderIdreverse) {
        return senderUser ? senderUser.name : null;
      }
      return null;
    }
  };

  const senderImage = getSenderImage();
  const isUrlPdp = senderImage && senderImage.startsWith("http");

  return (
    <TouchableOpacity
      onLongPress={handleDeleteMessageAlert}
      onPress={() => handleImageClick(message.message)}
    >
      {message.sender !== prevSenderIdreverse && !isMyMessage() && (
        <Text style={styles.senderName}>{getSenderName()}</Text>
      )}
      <View
        style={[
          styles.container,
          { flexDirection: isMyMessage() ? "row-reverse" : "row" }
        ]}
      >
        {message.sender !== prevSenderId &&
          !isMyMessage() &&
          (isUrlPdp ? (
            <Image source={{ uri: senderImage }} style={styles.image} />
          ) : (
            <Image
              source={{ uri: `data:image/png;base64,${senderImage}` }}
              style={styles.image}
            />
          ))}
        <View
          style={[
            styles.messageContainer,
            {
              backgroundColor: isMyMessage() ? "lightgreen" : "white",
              marginLeft: samesender() ? 60 : 0
            }
          ]}
        >
          {message.message.startsWith(
            "https://everywherestorage.blob.core.windows.net/images"
          ) ? (
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: message.message }}
                style={{ width: 200, height: 300 }}
              />
              <Text style={[styles.time, styles.absoluteTime]}>
                {dayjs(message.createdAt).format("HH:mm")}
              </Text>
            </View>
          ) : message.message.startsWith(
              "https://everywherestorage.blob.core.windows.net/videos/"
            ) ? (
            <TouchableOpacity onPress={() => handleVideoClick(message.message)}>
              <View style={{ position: "relative" }}>
                <Image
                  source={{ uri: message.thumbnailUrl }} // Use the thumbnail URL
                  style={{ width: 200, height: 300 }}
                />
                <Image
                  source={require("../../assets/play-button.png")}
                  style={{
                    width: 50, // Change these values according to the desired size
                    height: 50, // Change these values according to the desired size
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: [{ translateX: -25 }, { translateY: -25 }] // This centers the button. Make sure to adjust these values (they should be negative half of width and height)
                  }}
                />
                <Text style={[styles.time, styles.absoluteTime]}>
                  {dayjs(message.createdAt).format("HH:mm")}
                </Text>
              </View>
            </TouchableOpacity>
          ) : message.message.length > 1000 ? (
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: `data:image/png;base64,${message.message}` }}
                style={{ width: 170, height: 300 }}
              />
              <Text style={[styles.time, styles.absoluteTime]}>
                {dayjs(message.createdAt).format("HH:mm")}
              </Text>
            </View>
          ) : message.message.startsWith("https") ? (
            <View style={{ position: "relative" }}>
              <Image
                source={{ uri: message.message }}
                style={{ width: 230, height: 180 }}
              />
              <Text style={[styles.time, styles.absoluteTime]}>
                {dayjs(message.createdAt).format("HH:mm")}
              </Text>
            </View>
          ) : (
            <Text>{message.message}</Text>
          )}
          {!message.message.startsWith("https") &&
            message.message.length <= 1000 && (
              <Text style={styles.time}>
                {dayjs(message.createdAt).format("HH:mm")}
              </Text>
            )}
        </View>
      </View>
      <Modal
        visible={videoModalVisible}
        transparent={true}
        onRequestClose={() => setVideoModalVisible(false)}
      >
        <VideoPlayer
          source={{ uri: selectedVideoUri }}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            bottom: 0,
            right: 0
          }}
          navigator={null}
          onBack={() => setVideoModalVisible(false)}
          disableBack={false}
          fullscreen={true}
          resizeMode="contain"
          onLoadStart={() => <ActivityIndicator size="large" color="#0000ff" />}
        />
      </Modal>
      <Modal
        visible={imageModalVisible}
        transparent={true}
        onRequestClose={() => setImageModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalContainer}
          onPress={() => setImageModalVisible(false)}
        >
          <Image
            source={{ uri: selectedImageUri }}
            style={styles.modalImage}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </Modal>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 5
  },
  messageContainer: {
    borderRadius: 10,
    padding: 10,
    maxWidth: "60%"
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginHorizontal: 10
  },
  shadowColor: "#000",
  shadowOffset: {
    width: 0,
    height: 1
  },
  shadowOpacity: 0.22,
  shadowRadius: 2.22,
  elevation: 3,
  senderName: {
    fontWeight: "bold",
    marginBottom: 5,
    marginLeft: 60
  },
  absoluteTime: {
    position: "absolute",
    bottom: 5,
    right: 10,
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 2,
    borderRadius: 5
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center"
  },
  modalImage: {
    width: Dimensions.get("window").width - 40,
    height: Dimensions.get("window").height - 80
  }
});

export default Message;
