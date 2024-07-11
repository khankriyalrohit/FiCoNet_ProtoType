import React from 'react';
import './Header.css';


const Header = () => {
  return (
    <header className="header">
      <div className="logo">
        <img src='https://tethys-engineering.pnnl.gov/sites/default/files/taxonomy-images/ministryenvironment_india_logo.jpg' alt="FiCoNet Logo" />
      </div>
      <div className="header-text">
        <h1>FiCoNet</h1>
        <h2>Fire Control Network</h2>
        <h3>Ministry of Environment, Forest and Climate Change</h3>
        <h4>भारतीय वन निरीक्षण</h4>
      </div>
    </header>
  );
};

export default Header;
