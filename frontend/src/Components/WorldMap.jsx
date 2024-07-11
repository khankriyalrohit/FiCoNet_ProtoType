import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const fireIcon = new L.Icon({
  iconUrl: require('../assets/fire-icon.png'), // Ensure you have a fire-icon.png in your assets
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const waterIcon = new L.Icon({
  iconUrl: require('../assets/water-icon.png'), // Ensure you have a water-icon.png in your assets
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const WorldMap = ({ selectedCategory }) => {
  const [fireEvents, setFireEvents] = useState([]);
  const [waterResources, setWaterResources] = useState([]);
  const mapRef = useRef();

  useEffect(() => {
    fetch('/api/fire-events')
      .then(response => response.json())
      .then(data => setFireEvents(data))
      .catch(error => console.error('Error fetching fire data:', error));

    fetch('/api/water-resources')
      .then(response => response.json())
      .then(data => setWaterResources(data))
      .catch(error => console.error('Error fetching water resource data:', error));
  }, []);

  const metersToDegrees = (meters, lat) => {
    const latOffset = meters / 111320;
    const lngOffset = meters / (111320 * Math.cos(lat * (Math.PI / 180)));
    return { latOffset, lngOffset };
  };

  const groupFireEvents = (events) => {
    const grouped = {};
    const validEvents = events.filter(event => event && event.latitude && event.longitude);

    if (validEvents.length === 0) {
      return grouped;
    }

    const { latOffset, lngOffset } = metersToDegrees(350, validEvents[0].latitude);

    validEvents.forEach(event => {
      const latGroup = Math.floor(event.latitude / latOffset);
      const lngGroup = Math.floor(event.longitude / lngOffset);
      const key = `${latGroup}-${lngGroup}`;

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(event);
    });

    return grouped;
  };

  const groupedFireEvents = groupFireEvents(fireEvents);

  const shouldHighlightArea = (events) => events.filter(e => e.active_fire).length >= 4;

  const calculatePolygonCorners = (center) => {
    const lat = center.latitude;
    const lng = center.longitude;
    const { latOffset, lngOffset } = metersToDegrees(350, lat);

    return [
      [lat - latOffset, lng - lngOffset],
      [lat - latOffset, lng + lngOffset],
      [lat + latOffset, lng + lngOffset],
      [lat + latOffset, lng - lngOffset]
    ];
  };

  const filterEvents = () => {
    switch (selectedCategory) {
      case 'activeFire':
        return fireEvents.filter(event => event.active_fire);
      case 'burntRegion':
        return fireEvents.filter(event => !event.active_fire);
      case 'fireOrigin':
        return [fireEvents.reduce((prev, curr) => (prev.time_of_active_fire < curr.time_of_active_fire ? prev : curr))];
      case 'waterSource':
        return waterResources;
      case 'largeFire':
        return Object.keys(groupedFireEvents)
          .filter(key => shouldHighlightArea(groupedFireEvents[key]))
          .flatMap(key => groupedFireEvents[key]);
      default:
        return [];
    }
  };

  const filteredEvents = filterEvents();

  return (
    <MapContainer
      center={[30.3833, 78.4833]}
      zoom={10}
      style={{ height: '600px', width: '100%' }}
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />

      {selectedCategory === 'largeFire' && Object.keys(groupedFireEvents).map(key => {
        const events = groupedFireEvents[key];
        const center = events[0];

        return shouldHighlightArea(events) && (
          <Polygon
            key={key}
            positions={calculatePolygonCorners(center)}
            color="red"
            fillOpacity={0.5}
          />
        );
      })}

      {filteredEvents.map((event, index) => (
        <Marker
          key={index}
          position={[event.latitude, event.longitude]}
          icon={selectedCategory === 'waterSource' ? waterIcon : fireIcon}
        >
          <Popup>
            {selectedCategory === 'waterSource' ? (
              <div>
                <h3>Type: {event.type}</h3>
                <p>Latitude: {event.latitude}</p>
                <p>Longitude: {event.longitude}</p>
              </div>
            ) : (
              <div>
                <h3>Sensor ID: {event.sensor_id}</h3>
                <p>Latitude: {event.latitude}</p>
                <p>Longitude: {event.longitude}</p>
                <p>Time of Active Fire: {event.time_of_active_fire}</p>
                <p>Active Fire: {event.active_fire ? 'Yes' : 'No'}</p>
              </div>
            )}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default WorldMap;
