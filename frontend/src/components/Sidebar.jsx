import React from 'react';
import { Link as Lk } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHouse, faBell, faUser, faList } from '@fortawesome/free-solid-svg-icons';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <Lk to='/' activeClassName='active'>
        <div className='sidebar-icons'>
          <FontAwesomeIcon icon={faHouse} className='faiconss' />
          <h3>Home</h3>
        </div>
      </Lk>
      <Lk to='/notifications' activeClassName='active'>
        <div className='sidebar-icons'>
          <FontAwesomeIcon icon={faBell} className='faiconss'/>
          <h3>Notification</h3>
        </div>
      </Lk>
      <Lk to='/profile' activeClassName='active'>
        <div className='sidebar-icons'>
          <FontAwesomeIcon icon={faUser} className='faiconss'/>
          <h3>Profile</h3>
        </div>
      </Lk>
      <Lk to='/more' activeClassName='active'>
        <div className='sidebar-icons'>
          <FontAwesomeIcon icon={faList} className='faiconss' />
          <h3>More</h3>
        </div>
      </Lk>
    </div>
  );
};

export default Sidebar;
