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
import { Link as Lk } from 'react-router-dom';


const defaultTheme = createTheme();

export default function Signup() {
  const [validationErrors, setValidationErrors] = useState({});
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const nameRegex = /^[A-Za-z]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\d+$/;
    const passwordRegex = /^(?=.[a-z])(?=.[A-Z])(?=.\d)(?=.[!@#$%^&*]).{8,}$/;

    const firstName = data.get('firstName');
    const lastName = data.get('lastName');
    const email = data.get('email');
    const phoneNumber = data.get('phoneNumber');
    const password = data.get('password');

    const errors = {};

    if (!nameRegex.test(firstName)) {
      errors.firstName = 'Invalid first name. Only letters are allowed.';
    }

    if (!nameRegex.test(lastName)) {
      errors.lastName = 'Invalid last name. Only letters are allowed.';
    }

    if (!emailRegex.test(email)) {
      errors.email = 'Invalid email address. It must contain an @ sign.';
    }

    if (!phoneRegex.test(phoneNumber)) {
      errors.phoneNumber = 'Invalid phone number. It must contain only numbers.';
    }

    if (!passwordRegex.test(password)) {
      errors.password =
        'Invalid password. It must contain at least one lowercase letter, one uppercase letter, one digit, and one special character.';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      console.log({
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
      });
    }
  };

  return (
    <div style={{background:'#16202C',color:'white'}}>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="given-name"
                  name="firstName"
                  required
                  fullWidth
                  id="firstName"
                  label="First Name"
                  autoFocus
                  error={!!validationErrors.firstName}
                  helperText={validationErrors.firstName}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  fullWidth
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  error={!!validationErrors.lastName}
                  helperText={validationErrors.lastName}
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
                  error={!!validationErrors.email}
                  helperText={validationErrors.email}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  name="phoneNumber"
                  label="Phone Number"
                  type="tel"
                  error={!!validationErrors.phoneNumber}
                  helperText={validationErrors.phoneNumber}
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
                  error={!!validationErrors.password}
                  helperText={validationErrors.password}
                />
              </Grid>
              <Grid item xs={12}>
                <FormControlLabel
                  control={<Checkbox value="allowExtraEmails" color="primary" />}
                  label="I want to receive inspiration, marketing promotions and updates via email."
                />
              </Grid>
            </Grid>
            {Object.keys(validationErrors).length > 0 && (
              <Typography variant="body2" color="error" align="center" sx={{ mt: 2 }}>
                Please fix the errors before submitting.
              </Typography>
            )}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
            <Lk to='/signin' style={{textDecoration:'none',color:'black'}}>Sign Up</Lk> 
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                   <Lk to="/signin" style={{textDecoration:'none',color:'white'}}> Already have an account? Sign in</Lk>
              </Grid>
            </Grid>
          </Box>
        </Box>
        
      </Container>
    </ThemeProvider>
    </div>
    
  );
}