import React, { useEffect, useState } from 'react';
import FireEvents from './FireEvents';
import './LargeForestFire.css';

const LargeForestFire = () => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch('/api/fire-events')
      .then(response => response.json())
      .then(data => setEvents(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  // Function to check if a group of events forms a large fire
  const isLargeFire = (events) => {
    return events.length >= 4; // Example condition: 4 sensors detecting fire in a 350m x 350m area
  };

  // Group fire events by proximity (350m x 350m)
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

  // Convert meters to degrees for latitude and longitude
  const metersToDegrees = (meters, lat) => {
    const latOffset = meters / 111320; // 1 degree ≈ 111320 meters
    const lngOffset = meters / (111320 * Math.cos(lat * (Math.PI / 180))); // Adjust for longitude
    return { latOffset, lngOffset };
  };

  const groupedFireEvents = groupFireEvents(events);
  const largeFires = Object.values(groupedFireEvents).filter(isLargeFire).map(events => events[0]);

  return (
    <div className="fire-events-container">
      <h1>Large Forest Fires</h1>
      {largeFires.map((event, index) => (
        <FireEvents key={index} event={event} />
      ))}
    </div>
  );
};

export default LargeForestFire;
