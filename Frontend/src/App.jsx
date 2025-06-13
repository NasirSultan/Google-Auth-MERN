
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Loginn';
import Register from './components/Register'; 
import Test from './components/test';
import ResetPassword from './components/ResetPassword';
import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={< Test />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
         <Route path="/Reset" element={<ResetPassword />} />
      </Routes>
    </Router>
  );
}

export default App;