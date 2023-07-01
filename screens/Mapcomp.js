import React, { useEffect, useState, useContext } from "react";
import {
  StyleSheet,
  View,
  ImageBackground,
  TouchableOpacity,
  Text,
  Pressable,
  Image
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import MapboxGL, {
  ShapeSource,
  SymbolLayer,
  Marker,
  MarkerView,
  Camera
} from "@rnmapbox/maps";
import ClubsPage from "./Clubspage";
import appApi, {
  useClubsgetMutation,
  useLocationsGetMutation
} from "./../services/appApi";
import GhostModeContext from "../components/GhostModeContext";
//import { UseClubsget } from './../services/appApi';
//
MapboxGL.setWellKnownTileServer("mapbox");
MapboxGL.setAccessToken(
  "sk.eyJ1IjoicmF5bWF6bWF6IiwiYSI6ImNsaHFucmY3czBpbnAza252N3V6aG5pdXMifQ.og_YU_6Ow-klAdJE2xNELw"
);
const mapStyle = "mapbox://styles/mapbox/dark-v11";
//MarkerComponent

const Mapcomp = () => {
  const { isGhostModeEnabled } = useContext(GhostModeContext);
  const centerCoordinate = [-3.70379, 40.416775]; // Madrid coordinates
  const [clubsget, { isLoading, error }] = useClubsgetMutation();
  const [dataArr, setDataArr] = useState([]);
  const [locations, setlocations] = useState([]);
  const [mapLoaded, setMapLoaded] = useState(false);
  const navigation = useNavigation();
  const [heatmapData, setHeatmapData] = useState(null);
  const [mapKey, setMapKey] = useState(Math.random());
  const [locationsget] = useLocationsGetMutation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response_club = await clubsget();
        setDataArr(response_club.data);
        const response_loc = await locationsget();
        setlocations(response_loc.data);
        setHeatmapData(response_loc.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleMarkerPress = () => {
    navigation.navigate("ClubsPage", { club: club });
  };

  const renderMarkers = () => {
    return dataArr.map((club) => {
      //const image ='https://drive.google.com/uc?export=view&id=' + club.image;
      const image = `data:image/gif;base64,${club.image}`;
      return (
        <MapboxGL.MarkerView
          key={club.clubname}
          id={club.clubname}
          title={club.clubname}
          coordinate={[club.lng, club.lat]}
          allowOverlap={true}
        >
          <TouchableOpacity
            onPressIn={() => {
              navigation.navigate("ClubsPage", { club: club });
            }}
          >
            <ImageBackground
              source={{
                uri: "https://img1.picmix.com/output/stamp/normal/3/0/0/2/672003_d26a7.gif"
              }} // GIF URL
              style={{
                width: 70,
                height: 70,
                borderRadius: 50,
                //position: "relative",
                backgroundClip: "padding-box",
                paddingTop: 30,
                paddingHorizontal: 15
              }}
              imageStyle={{
                resizeMode: "cover",
                opacity: 0.8
              }}
            >
              <ImageBackground
                source={{ uri: image }} // Club's image
                style={{
                  width: 40,
                  height: 40,
                  backgroundColor: "transparent",
                  borderRadius: 125,
                  overflow: "hidden",
                  overflow: "hidden",
                  borderWidth: 2,
                  borderColor: "white",
                  boxShadow:
                    "0 10px 20px rgba(0,0,0,0.19), 0 6px 6px rgba(0,0,0,0.23)",
                  backgroundImage:
                    "linear-gradient(to bottom right, blue, red)",
                  backgroundClip: "padding-box"
                }}
              ></ImageBackground>
            </ImageBackground>
          </TouchableOpacity>
        </MapboxGL.MarkerView>
      );
    });
  };

  const data = async () => {
    const data = await handleEvents();
    setDataArr(data.data);
    return data.data;
  };

  return (
    <View style={styles.page}>
      <View style={styles.container}>
        {heatmapData && (
          <MapboxGL.MapView
            style={styles.map}
            styleURL={mapStyle}
            projection="globe"
            scaleBarEnabled={false}
            onDidFinishLoadingMap={() => setMapLoaded(true)} // Set mapLoaded to true when map is fully loaded
          >
            <MapboxGL.UserLocation visible={true} />
            <MapboxGL.Camera
              zoomLevel={12}
              centerCoordinate={centerCoordinate}
              animationMode={"flyTo"}
              animationDuration={0}
            />
            {renderMarkers()}
            <MapboxGL.ShapeSource
              id="heatmapDataSource"
              shape={{
                type: "FeatureCollection",
                features: heatmapData.map((point, index) => ({
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [point.long, point.lat]
                  },
                  properties: {
                    id: index.toString(), // Unique ID for each feature
                    weight: point.weight // Weight of the point
                  }
                }))
              }}
            >
              {!isGhostModeEnabled && (
                <MapboxGL.HeatmapLayer
                  id="heatmapLayerId"
                  sourceID="heatmapDataSource"
                  sourceLayerID=""
                  //heatmapWeight={(feature) => feature.properties.weight*0.0001} // Use the weight property from each feature in the heatmapData
                  style={{
                    visibility: "visible", // The heatmap layer is shown
                    heatmapRadius: 50, // Radius of influence in pixels
                    heatmapWeight: 1, // Measure of how much an individual point contributes to the heatmap
                    heatmapIntensity: 0.4, // Controls the intensity of the heatmap globally
                    heatmapColor: [
                      "interpolate",
                      ["linear"],
                      ["heatmap-density"],
                      0,
                      "rgba(0, 0, 255, 0)",
                      0.1,
                      "royalblue",
                      0.3,
                      "cyan",
                      0.5,
                      "lime",
                      0.7,
                      "yellow",
                      1,
                      "red"
                    ], // Defines the color of each pixel based on its density value
                    heatmapOpacity: 0.6 // The global opacity at which the heatmap layer will be drawn
                  }}
                />
              )}
            </MapboxGL.ShapeSource>
          </MapboxGL.MapView>
        )}
      </View>
    </View>
  );
};

export default Mapcomp;

const styles = StyleSheet.create({
  page: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  container: {
    height: "100%",
    width: "100%"
  },
  map: {
    flex: 1
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
