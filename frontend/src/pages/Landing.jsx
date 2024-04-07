import React from 'react';
import GoogleIcon from '@mui/icons-material/Google';
import Logo from '../assets/Logo2.svg';
import { Link as Lk} from 'react-router-dom';

const Landing = () => {
  return (
    <>
      <div className='landing' style={{ width: '100vw', height: '100vh', display: 'flex', alignItems: 'center' }}>
        <div style={{ marginLeft: '5rem' }}> {/* Adjusted margin-left here */}
          <img src={Logo} alt='logo' className='logo' />
        </div>
        <div style={{ marginLeft: '28%', marginTop: '4rem', fontFamily: 'Poppins' }}>
          <h2 style={{ fontSize: '3rem' }}>Circling Now</h2>
          <h3 style={{ fontSize: '1.5rem',marginTop:'2rem' }}>A place to share your thoughts and ideas</h3>
          <button style={{
            borderRadius: '25px',
            background: 'White',
            color: 'black',
            marginTop: '2rem',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            fontFamily: 'Poppins'
          }}>Continue With  <GoogleIcon />
          </button>
          <p style={{ color: 'white', marginTop: '1rem', marginLeft: '5rem' }}>or</p> 
          <button style={{
            borderRadius: '25px',
            background: 'White',
            color: 'black',
            marginTop: '2rem',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            fontFamily: 'Poppins',
            textDecoration:'none',
            color: 'black',
          }}> <Lk to='/signup'>Create Account</Lk>
          </button>
          <h4 style={{ fontSize: '1rem', marginTop: '3rem' }}>Already have an account?</h4>
          <button style={{
            borderRadius: '25px',
            background: 'White',
            color: 'black',
            marginTop: '2rem',
            border: 'none',
            padding: '10px 20px',
            cursor: 'pointer',
            fontFamily: 'Poppins',
            marginLeft: '2rem' 
          }}><Lk to='/signin'>Sign In</Lk>
          </button>
        </div>
      </div>
    </>
  )
}

export default Landing;
