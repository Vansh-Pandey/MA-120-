import React from 'react';
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import MainPage from './pages/MainPage';

const App = () => {
  return (
    <div>
     
    <Navbar/>
    <Routes>
      <Route path="/" element={<MainPage/>}/>
    </Routes>
    </div>
  );
};

export default App;
