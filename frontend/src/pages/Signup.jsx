import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link as RouterLink } from 'react-router-dom';
import axios from 'axios';

const defaultTheme = createTheme();

export default function Signup() {
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [buttonDisabled, setButtonDisabled] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const fullName = data.get('fullName');
    const username = data.get('username');
    const email = data.get('email');
    const password = data.get('password');

    // Basic validation
    if (!fullName || !username || !email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('https://social-sphere-xzkh.onrender.com/api/v1/users/register', {
        fullName,
        username,
        email,
        password,
      }, {
        timeout: 5000 // Timeout in milliseconds (e.g., 5 seconds)
      });
      setRegistrationSuccess(true);
      console.log('User registered successfully:', response.data);
    } catch (error) {
      console.error('Error registering user:', error);
      alert('An error occurred while registering. Please try again later.');
    }
  };

  return (
    <div style={{ background: 'white', color: 'black' }}>
      <ThemeProvider theme={defaultTheme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign up
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="name"
                    name="fullName"
                    required
                    fullWidth
                    id="fullName"
                    label="Full Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={<Checkbox value="allowExtraEmails" color="primary" />}
                    label="I want to receive inspiration, marketing promotions and updates via email."
                  />
                </Grid>
              </Grid>
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }} disabled={buttonDisabled}>
                Sign Up
              </Button>
              {registrationSuccess && (
                <Grid container justifyContent="flex-end">
                  <Grid item>
                    <RouterLink to="/signin" style={{ textDecoration: 'none', color: 'black' }}> Already have an account? Sign in</RouterLink>
                  </Grid>
                </Grid>
              )}
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
    </div>
  );
}
