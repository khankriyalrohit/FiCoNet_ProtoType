import React, { useState } from 'react';
import SideBar from './Components/SideBar';
import WorldMap from './Components/WorldMap';
import './App.css';
import Header from './Components/Header';
import LargeForestFire from './Components/LargeForestFire';

const App = () => {
  const [category, setCategory] = useState('');

  const handleCategoryChange = (newCategory) => {
    if (category === newCategory) {
      setCategory(''); // Deselect the category if it's already selected
    } else {
      setCategory(newCategory);
    }
  };

  return (
    <div className="app">
      <Header />
      <div className='mainpage'>
        <SideBar onCategoryChange={handleCategoryChange} />
        <div className="map-container">
          <WorldMap selectedCategory={category} />
        </div>
      </div>
      <LargeForestFire />
    </div>
  );
};

export default App;
