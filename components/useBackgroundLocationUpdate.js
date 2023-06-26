import Geolocation from "react-native-geolocation-service";
import BackgroundTimer from "react-native-background-timer";
import { useEffect } from "react";

// Import your api
import { useUpdateUserLocationMutation } from "../services/appApi";

const useBackgroundLocationUpdate = (userId, isGhostModeEnabled) => {
  // Get the mutation hook
  const [updateUserLocation] = useUpdateUserLocationMutation();

  useEffect(() => {
    const intervalId = BackgroundTimer.setInterval(() => {
      // Check if ghost mode is enabled
      if (!isGhostModeEnabled) {
        Geolocation.getCurrentPosition(
          async (position) => {
            // Use the mutation to update the user location
            try {
              await updateUserLocation({
                userId: userId,
                location: {
                  lat: position.coords.latitude,
                  long: position.coords.longitude
                }
              });
            } catch (error) {
              console.log(error);
            }
          },
          (error) => {
            console.log(error);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
        );
      }
    }, 5 * 60 * 1000); // 5 * 60 * 1000 milliseconds => 5 minutes

    return () => {
      BackgroundTimer.clearInterval(intervalId);
    };
  }, [userId, updateUserLocation, isGhostModeEnabled]); // Include isGhostModeEnabled in dependencies
};

export default useBackgroundLocationUpdate;
