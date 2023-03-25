import React, { useEffect, useState } from 'react';
import MapboxGL from '@rnmapbox/maps';
import jsondata from './events.json';

const MarkerComponent = () => {
    const [events, setEvents] = useState([]);
    useEffect(() => {
      setEvents(jsondata.events);
    }, []);

  return (
    <MapboxGL.ShapeSource id="eventMarkers" shape={{
      type: 'FeatureCollection',
      features: events.map(event => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [event.location.longitude, event.location.latitude],
        },
        properties: {
          title: event.title,
          description: event.description,
        },
      })),
    }}>
      <MapboxGL.SymbolLayer
        id="eventMarkersSymbol"
        style={{
          iconImage: 'marker-15',
          iconAllowOverlap: true,
          iconSize: 6,
        }}
      />
    </MapboxGL.ShapeSource>
  );
};

export default MarkerComponent;