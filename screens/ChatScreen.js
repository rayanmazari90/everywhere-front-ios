global.Buffer = global.Buffer || require("buffer").Buffer;
import React, { useLayoutEffect, useState, useEffect } from "react";
import {
  StyleSheet,
  ImageBackground,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Text,
  View,
  TouchableOpacity,
  Modal,
  Image,
  Alert
} from "react-native";
import bg from "../assets/leaves.jpg";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Message from "../components/Message";
import socket from "../utils/socket";
import { useSelector } from "react-redux";
import { useNavigation, useIsFocused } from "@react-navigation/native";
import {
  useLeaveGroupMutation,
  useGetGifsMutation,
  useUpdateLastAccessedMutation
} from "../services/appApi";
import Ionicons from "react-native-vector-icons/Ionicons";
import ImagePicker from "react-native-image-picker";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import RNFS from "react-native-fs";
//import "react-native-get-random-values";
//import ImageResizer from 'react-native-image-resizer';
//import { Video as VideoCompress, Image as ImageCompress } from "react-native-compressor";
import { debounce } from "lodash";
import { url_back } from "../components/connection_url";
import RNFetchBlob from "rn-fetch-blob";
import { RNFFmpeg } from "react-native-ffmpeg";

// ...

const ChatScreen = ({ route, navigation }) => {
  const user = useSelector((state) => state.user);
  const userId = user.user._id;
  const [chatMessages, setChatMessages] = useState([]);
  const [message, setMessage] = useState("");
  const { id, name, image, members, event_group_Id } = route.params;
  const [prevSenderId, setPrevSenderId] = useState(null);
  const [prevSenderIdreverse, setPrevSenderIdreverse] = useState(null);
  const [
    leavegroup,
    { isLoading: leavegroupIsLoading, error: leavegroupError }
  ] = useLeaveGroupMutation();
  const [getGifs, { isLoading: getGifsIsLoading, error: getGifsError }] =
    useGetGifsMutation();
  const [gifs, setGifs] = useState([]);
  const [showGifs, setShowGifs] = useState(false);
  const [gifQuery, setGifQuery] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleTakePhoto = () => {
    var options = {
      mediaType: "mixed",
      noData: false
    };

    launchCamera(options, async (response) => {
      if (response.assets && response.assets[0].uri) {
        try {
          console.log("heeeeeeeeeere");
          handleNewMessageFile(response);
        } catch (error) {
          console.log(error);
        }
      } else if (response.didCancel) {
        console.log("User cancelled photo picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      }
    });
  };

  const handlePickImage = () => {
    var options = {
      mediaType: "mixed",
      noData: false
    };

    launchImageLibrary(options, async (response) => {
      if (response.assets && response.assets[0].uri) {
        try {
          handleNewMessageFile(response);
        } catch (error) {
          console.log(error);
        }
      }
    });
  };

  const handleGifandStickers = () => {
    setShowGifs(true);
    const query = gifQuery || "stickers";

    getGifs({ query: query })
      .then((result) => {
        setGifs(result.data.data);
      })
      .catch((error) => {
        console.error("Error fetching groups:", error);
      });
  };

  const areDifferentDays = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);

    return (
      d1.getFullYear() !== d2.getFullYear() ||
      d1.getMonth() !== d2.getMonth() ||
      d1.getDate() !== d2.getDate()
    );
  };

  const leaveagroup = async () => {
    try {
      await leavegroup({ userId: userId, event_group_Id: event_group_Id });
      navigation.goBack();
    } catch (error) {
      console.error(error);
    }
  };

  const getReceiverIds = (members, userId) => {
    const receiverIds = members.filter((memberId) => memberId !== userId);

    if (receiverIds.length === 1) {
      return receiverIds[0];
    } else if (receiverIds.length > 1) {
      return receiverIds;
    } else {
      return null;
    }
  };
  const receiverID = getReceiverIds(members, userId);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image source={{ uri: image }} style={styles.headerImage} />
          <Text>{name}</Text>
        </View>
      ),
      headerRight: () => (
        <TouchableOpacity style={styles.exitButton} onPress={leaveagroup}>
          <Ionicons name="exit" size={24} color="green" />
        </TouchableOpacity>
      )
    });
    socket.emit("findconv", id);
    socket.on("foundconv", (convmessages) => {
      const reversedMessages = [...convmessages].reverse();
      setChatMessages(reversedMessages);
    });

    return () => {
      socket.off("foundconv");
    };
  }, []);

  useEffect(() => {
    socket.on("foundconv", (convmessages) => {
      const reversedMessages = [...convmessages].reverse();
      setChatMessages(reversedMessages);
    });
  }, [socket]);

  useEffect(() => {
    return () => {
      socket.emit("leaveConversation", { userId: userId, conversationId: id });
    };
  }, []);

  useEffect(() => {
    socket.on("newMessage", (message) => {
      // We add the new message to the chat messages
      setChatMessages((prevMessages) => [message, ...prevMessages]);
    });
    // Clean up function to avoid memory leak due to multiple event listeners.
    return () => {
      socket.off("newMessage");
    };
  }, [socket]);

  useEffect(() => {
    socket.on("newMessageFile", (message) => {
      // We add the new message to the chat messages
      setIsUploading(false);
      setChatMessages((prevMessages) => [message, ...prevMessages]);
    });
    // Clean up function to avoid memory leak due to multiple event listeners.
    return () => {
      socket.off("newMessageFile");
    };
  }, [socket]);

  const onMessageAction = () => {
    socket.emit("findconv", id);
    socket.on("foundconv", (convmessages) => {
      const updatedMessages = [...convmessages].reverse();
      setChatMessages(updatedMessages);
    });
  };

  const handleNewMessage = () => {
    const messageData = {
      conversationId: id,
      message,
      thumbnailUrl: "",
      sender: userId,
      receiver: receiverID,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    socket.emit("newMessage", messageData);
    setMessage("");
  };

  useEffect(() => {
    // Define debounced function
    const debouncedHandleGifAndStickers = debounce(() => {
      handleGifandStickers();
    }, 1000); // 1000ms delay

    // Call debounced function
    if (showGifs) {
      // only call function if showGifs is true
      debouncedHandleGifAndStickers();
    }

    // Cleanup function
    return () => {
      debouncedHandleGifAndStickers.cancel();
    };
  }, [gifQuery, showGifs]);

  const handleNewMessageGif = (gifUrl) => {
    const messageData = {
      conversationId: id,
      message: gifUrl,
      thumbnailUrl: "",
      sender: userId,
      receiver: receiverID,
      isRead: false,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    socket.emit("newMessage", messageData);
    setMessage("");
    setShowGifs(false);
  };

  const uploadFile = async (filePath, sasUrl, fileType) => {
    let uploadResponse = await RNFetchBlob.fetch(
      "PUT",
      sasUrl,
      {
        "x-ms-blob-type": "BlockBlob",
        "Content-Type": fileType
      },
      RNFetchBlob.wrap(filePath)
    );

    console.log("uploadResponse", uploadResponse);
    console.log("HTTP status:", uploadResponse.respInfo.status);

    if (uploadResponse.respInfo.status !== 201) {
      throw new Error("Upload failed");
    }
    const redirects = uploadResponse.respInfo.redirects;
    return redirects;
  };

  const handleNewMessageFile = async (response) => {
    setIsUploading(true);
    try {
      let filePath = response.assets[0].uri;
      if (Platform.OS === "ios" || Platform.OS === "android") {
        filePath = filePath.replace("file://", "");
      }
      let fileType = response.assets[0].type;
      let fileSize = response.assets[0].fileSize;
      if (fileSize > 15000000) {
        setIsUploading(false);
        Alert.alert("Video is too large. Send smaller videos.");
        return null;
      }
      console.log(fileType);
      console.log(fileSize);
      if (fileType.includes("image")) {
        const sasResponse = await fetch(
          `${url_back}/sasToken?fileType=${fileType}`
        );
        const sasData = await sasResponse.json();
        const redirects = await uploadFile(filePath, sasData.sasUrl, fileType);
        const imageUrl = redirects[0].split("?")[0];
        console.log(`Image uploaded at: ${imageUrl}`);

        const messageData = {
          conversationId: id,
          message: imageUrl,
          thumbnailUrl: "", // Include the thumbnail URL
          sender: userId,
          receiver: receiverID,
          isRead: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          fileType: fileType,
          fileSize: fileSize
        };
        const uploadTimeout = setTimeout(() => {
          throw new Error("Upload timed out");
        }, 15000); // Timeout after 30 seconds

        // Your existing code remains the same
        socket.emit("newMessageFile", messageData);

        // Clear the timeout if upload is successful
        clearTimeout(uploadTimeout);
        setMessage("");
      } else if (fileType.includes("video")) {
        // Create a thumbnail
        const thumbPath = `${filePath}-thumbnail.jpg`;

        await RNFFmpeg.execute(
          "-i " + filePath + " -ss 00:00:01.000 -vframes 1 " + thumbPath
        ).then((result) => {
          console.log(`FFmpeg process exited with rc=${result.rc}`);
        });

        // Request a new SAS URL for the thumbnail
        const sasThumbResponse = await fetch(
          `${url_back}/sasToken?fileType=${fileType}`
        );
        const sasThumbData = await sasThumbResponse.json();
        const thumbRedirects = await uploadFile(thumbPath, sasThumbData.sasUrl);
        const thumbnailUrl = thumbRedirects[0].split("?")[0];
        console.log(`Thumbnail uploaded at: ${thumbnailUrl}`);

        const sasResponse = await fetch(
          `${url_back}/sasToken?fileType=${fileType}`
        );
        const sasData = await sasResponse.json();
        const redirects = await uploadFile(filePath, sasData.sasUrl, fileType);
        const videoUrl = redirects[0].split("?")[0];
        console.log(`Video uploaded at: ${videoUrl}`);

        const messageData = {
          conversationId: id,
          message: videoUrl,
          thumbnailUrl: thumbnailUrl, // Include the thumbnail URL
          sender: userId,
          receiver: receiverID,
          isRead: false,
          createdAt: new Date(),
          updatedAt: new Date(),
          fileType: fileType,
          fileSize: fileSize
        };
        const uploadTimeout = setTimeout(() => {
          throw new Error("Upload timed out");
        }, 15000); // Timeout after 30 seconds

        // Your existing code remains the same
        socket.emit("newMessageFile", messageData);

        // Clear the timeout if upload is successful
        clearTimeout(uploadTimeout);
        setMessage("");
      } else {
        throw new Error("Unsupported file type");
      }
    } catch (error) {
      console.log("Error reading file:", error);
      setIsUploading(false);
      // Show error message to the user, replace this with your own error handling logic
      Alert.alert(
        "Error",
        "There was an error during the upload process. Please try again."
      );
    }
  };

  return (
    <ImageBackground source={bg} style={styles.bg}>
      {chatMessages[0] ? (
        <FlatList
          data={chatMessages}
          renderItem={({ item, index }) => (
            <>
              {index > 0 &&
                areDifferentDays(
                  item.createdAt,
                  chatMessages[index - 1].createdAt
                ) && (
                  <Text style={styles.dateSeparator}>
                    {new Date(item.createdAt).toLocaleDateString()}{" "}
                    {/* adjust the date format as you need */}
                  </Text>
                )}
              <Message
                message={item}
                prevSenderId={chatMessages[index - 1]?.sender}
                setPrevSenderId={setPrevSenderId}
                prevSenderIdreverse={chatMessages[index + 1]?.sender}
                setPrevSenderIdreverse={setPrevSenderIdreverse}
                onMessageAction={onMessageAction}
              />
            </>
          )}
          style={styles.list}
          inverted
          contentContainerStyle={{ paddingBottom: 15 }}
        />
      ) : (
        <View style={styles.noMessagesContainer}>
          <Text style={styles.noMessagesText}>No messages yet.</Text>
        </View>
      )}
      {isUploading && (
        <View style={{ flexDirection: "row", justifyContent: "flex-end" }}>
          <Image
            source={require("../assets/loading-gif.gif")}
            style={{ width: 100, height: 100, marginLeft: "auto" }}
          />
        </View>
      )}

      <KeyboardAvoidingView
        behavior={"padding"}
        enabled={Platform.OS === "ios"}
        keyboardVerticalOffset={Platform.select({ android: 64, ios: 0 })}
      >
        {showGifs && (
          <View>
            <View style={styles.inputContainer}>
              <TextInput
                value={gifQuery}
                onChangeText={(text) => {
                  setGifQuery(text);
                }}
                style={styles.input}
                placeholder="Search for a gif..."
              />
              <TouchableOpacity
                onPress={() => {
                  setShowGifs(false);
                }}
                style={styles.closeButton}
              >
                <Ionicons name="close" size={28} color="black" />
              </TouchableOpacity>
            </View>
            <View style={{ backgroundColor: "whitesmoke" }}>
              <FlatList
                data={gifs}
                horizontal
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() =>
                      handleNewMessageGif(item.images.original.url)
                    }
                  >
                    <Image
                      source={{ uri: item.images.original.url }}
                      style={{ width: 70, height: 70 }}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
          </View>
        )}
        <SafeAreaView edges={["bottom"]} style={styles.inputContainer}>
          {!showGifs && (
            <>
              <FontAwesome
                name="plus"
                size={28}
                color="royalblue"
                onPress={handlePickImage}
              />
              <TextInput
                value={message}
                onChangeText={(text) => {
                  setMessage(text);
                }}
                style={styles.input}
                placeholder="Type your message..."
              />

              {message !== "" ? (
                <MaterialCommunityIcons
                  onPress={handleNewMessage}
                  style={styles.send}
                  name="send"
                  size={20}
                  color="white"
                />
              ) : (
                <>
                  <MaterialCommunityIcons
                    name="sticker-emoji"
                    size={28}
                    color="royalblue"
                    style={styles.stickerIcon}
                    onPress={handleGifandStickers}
                  />

                  <FontAwesome
                    name="camera"
                    size={24}
                    color="royalblue"
                    onPress={handleTakePhoto}
                  />
                </>
              )}
            </>
          )}
        </SafeAreaView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  bg: {
    flex: 1
  },
  list: {
    flex: 1,
    padding: 10
  },
  dateSeparator: {
    textAlign: "center",
    marginVertical: 10,
    color: "gray"
  },
  noMessagesContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  noMessagesText: {
    fontSize: 18,
    color: "gray"
  },
  inputgifContainer: {
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "whitesmoke",
    borderRadius: 20
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    paddingHorizontal: 10,
    backgroundColor: "whitesmoke"
  },
  input: {
    flex: 1,
    backgroundColor: "white",
    padding: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    borderRadius: 50,
    borderColor: "lightgray",
    borderWidth: StyleSheet.hairlineWidth
  },
  send: {
    backgroundColor: "royalblue",
    padding: 7,
    borderRadius: 15,
    overflow: "hidden"
  },
  stickerIcon: {
    right: 50
  },
  closeButton: {
    justifyContent: "center",
    paddingHorizontal: 10
  },
  headerImage: {
    width: 40,
    height: 40,
    borderRadius: 20, // half of width/height to make it a circle
    marginRight: 10 // or the value you prefer
  }
});

export default ChatScreen;

/*useEffect(() => {
        // Run cleanup when the component unmounts
        return () => {
            // Update the lastAccessed timestamp
            updateLastAccessedtime();
        };
    }, []); // Empty dependency array means this effect runs once on mount and cleanup on unmount*/

/*    
    const [updateLastAccessed, { isLoading: updateLastAccessedIsLoading, error: updateLastAccessedError }] = useUpdateLastAccessedMutation();
    
    const updateLastAccessedtime = async () => {
        try {
            // Make the API call to update the lastAccessed timestamp
            await updateLastAccessed({ conversationId: id, userId: userId });
        } catch (error) {
            console.error(error);
        }
    };*/
