import React from 'react';
import { Link as Lk } from 'react-router-dom';
import profileImage from '../assets/profile-img.jpg';
import Logo from '../assets/Logo2.svg';
import '../styles/Navbar.css';
const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Lk to="/"><img src={Logo} alt='logo' className='logo'/></Lk>
      </div>
      <div className="navbar-search">
        <input type="text" placeholder="Search..." />
      </div>
      <div className="navbar-Lks">
        <Lk to="/login"><button type='submit' /></Lk>
        <Lk to="/profile"><img src={profileImage} alt="Profile" className='profile-img'/></Lk>
      </div>
    </nav>
  );
};

export default Navbar;
