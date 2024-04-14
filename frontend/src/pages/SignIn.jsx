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
function SignIn() {
  const [validationErrors, setValidationErrors] = useState({});

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const email = data.get('email');
    const password = data.get('password');

    const errors = {};

    if (!emailRegex.test(email)) {
      errors.email = 'Invalid email address. It must contain an @ sign.';
    }

    if (!password) {
      errors.password = 'Password is required.';
    }

    setValidationErrors(errors);

    if (Object.keys(errors).length === 0) {
      console.log({
        email,
        password,
      });
    }
  };

  const theme = createTheme();

  return (
    <div style={{background:'white',color:'black'}}>
      <ThemeProvider theme={theme}>
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
            Sign in
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              error={!!validationErrors.email}
              helperText={validationErrors.email}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!validationErrors.password}
              helperText={validationErrors.password}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
             <Lk to='/Home' style={{textDecoration:'none',color:'black'}}>Sign In</Lk> 
            </Button>
            <Grid container>
              <Grid item>
                <Lk to="/signup" style={{textDecoration:'none',color:'black'}}>Don't have an account? Sign Up</Lk>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
    </div>
    
  );
}

export default SignIn;