import React from 'react';
import './App.css';
import { GridContainer } from './components/GridContainer';
import { useState } from 'react';
import  { LoadGraphWithHook } from './components/BranchHistory';
import {BrowserRouter as Router, Routes, Route, Link} from 'react-router-dom';
function App() {

  return (
    <Router>
      <Routes>
      <Route path = "/" element = {<GridContainer/>}/>
      <Route path = "/history" element = {<LoadGraphWithHook style={{height: '100vh', width:'100vh'}}/>}/>
      </Routes>    
    </Router>
  );
}

export default App;
