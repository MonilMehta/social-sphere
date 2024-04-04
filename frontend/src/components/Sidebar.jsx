import React, { useState, useEffect } from 'react';
import { Link as Lk } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faBell, faUser, faList } from '@fortawesome/free-solid-svg-icons';
import '../styles/Sidebar.css';
const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const threshold = 200; // Adjust as needed
      console.log(scrollY);
      setIsCollapsed(scrollY > threshold);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
    <Lk to='/' activeClassName='active'>
      <div className='sidebar-icons'>
        <FontAwesomeIcon icon={faHouse} className='faiconss' />
        {!isCollapsed?<h5 className='sidebar-text'>Home</h5>:''}
      </div>
    </Lk>
    <Lk to='/notifications' activeClassName='active'>
      <div className='sidebar-icons'>
        <FontAwesomeIcon icon={faBell} className='faiconss'/>
        {!isCollapsed?<h5 className='sidebar-text'>Notification</h5>:''}
      </div>
    </Lk>
    <Lk to='/profile' activeClassName='active'>
      <div className='sidebar-icons'>
        <FontAwesomeIcon icon={faUser} className='faiconss'/>
        {!isCollapsed?<h5 className='sidebar-text'>Profile</h5>:''}
      </div>
    </Lk>
    <Lk to='/more' activeClassName='active'>
      <div className='sidebar-icons'>
        <FontAwesomeIcon icon={faList} className='faiconss' />
        {!isCollapsed?<h5 className='sidebar-text'>More</h5>:''}
      </div>
    </Lk>
  </div>
  );
};

export default Sidebar;