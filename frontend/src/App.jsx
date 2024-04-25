import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Signup from './pages/Signup';
import SignIn from './pages/SignIn';
import './App.css';
import Landing from './pages/Landing';
import Profile from './pages/Profile';
const App = () => {

  return (
    <div>
    
    <Router>
      <Routes>
        <Route path='/' element={<Landing/>} />
        <Route path='/Home' element={<Home/>} />
        <Route path='/signup' element={<Signup/>} />
        <Route path='/signin' element={<SignIn/>} />
        <Route path='/profile' element={<Profile/>} />
      </Routes>
    </Router>
    </div>
  );
};

export default App;
