// src/App.js
import React from 'react';
import Routing from './utils/Routing'; // Import Routing component
import './App.css';

// before -> className ="App"
const App = () => {
  return (
    <div className="app-container"> 
      <Routing /> {/* The routing logic is now handled here*/}
    </div>
  );
};

export default App;
