
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Loginn';
import Register from './components/Register'; 
import Test from './components/test';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={< Test />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;