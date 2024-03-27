import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import SignIn from './pages/SignIn';
import './App.css';
const App = () => {

  return (
    <Router>
      <Routes>
        <Route path='' element={<Home/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/signin' element={<SignIn/>} />
      </Routes>
    </Router>
  );
};

export default App;
