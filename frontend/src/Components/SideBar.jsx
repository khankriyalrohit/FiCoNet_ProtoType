import React from 'react';
import './Sidebar.css'; // Adjust the import as needed

const SideBar = ({ onCategoryChange }) => {
  return (
    <div className="sidebar">
      <button className="category red" onClick={() => onCategoryChange('activeFire')}>
        <h2>Active Fire</h2>
      </button>
      <button className="category grey" onClick={() => onCategoryChange('burntRegion')}>
        <h2>Burnt Region</h2>
      </button>
      <button className="category reddish-yellow" onClick={() => onCategoryChange('fireOrigin')}>
        <h2>Fire Origin</h2>
      </button>
      <button className="category blue" onClick={() => onCategoryChange('waterSource')}>
        <h2>Water Source</h2>
      </button>
      <button className="category reddish-orange" onClick={() => onCategoryChange('largeFire')}>
        <h2>Large Fire</h2>
      </button>
      <button className="category orange" onClick={() => onCategoryChange('smallFire')}>
        <h2>Small Fire</h2>
      </button>
    </div>
  );
};

export default SideBar;
