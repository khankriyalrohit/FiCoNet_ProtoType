import React from 'react';
import './FireEvents.css';

const FireEvents = ({ event }) => {
  const handleViewButtonClick = () => {
    const latLng = [event.latitude, event.longitude];
    // Assuming you have a method to center the map on the specified location
    window.centerMapOnLocation(latLng);
  };

  return (
    <div className="FireEventsCard">
      <h2>Large Fire Detected</h2>
      <div className="section">
        <div className="row">
          <div className="col-md-3"><strong>Sensor ID:</strong> {event.sensor_id}</div>
          <div className="col-md-3"><strong>Latitude:</strong> {event.latitude}</div>
          <div className="col-md-3"><strong>Longitude:</strong> {event.longitude}</div>
          <div className="col-md-3"><strong>Time of Active Fire:</strong> {new Date(event.time_of_active_fire).toLocaleString()}</div>
        </div>
        <div className="row">
          <div className="col-md-3"><strong>State:</strong> {event.state}</div>
          <div className="col-md-3"><strong>District:</strong> {event.district}</div>
          <div className="col-md-3"><strong>Region:</strong> {event.region}</div>
          <div className="col-md-3 ">
            <button onClick={handleViewButtonClick} className="viewbutton">View</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FireEvents;
