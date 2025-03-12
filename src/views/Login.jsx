/* eslint-disable */

'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@configs/firebaseconfig';
import { useRouter } from 'next/navigation';
import axios from 'axios';


import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Box, Select, MenuItem } from '@mui/material';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const [selectedServer, setSelectedServer] = useState('https://api.panorah.com/');
  const router = useRouter();

  const defaultServers = [
    'http://127.0.0.1:8000/',
    'http://127.0.0.1:8001/',
    'https://api.panorah.com/',
    'https://prodapi.panorah.com/',
  ];


    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);

        localStorage.setItem('server', selectedServer);

        try {
            const response = await axios.post(`${selectedServer}auth/jwt/login`, {
                email: email,
                password: password,
            });

            const { accessToken } = response.data.data;

            console.log('Access Token:', accessToken);
            localStorage.setItem('authToken', accessToken); 
            router.push('/dashboards/doctypelist'); 
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        }
    };


  const handleClickShowPassword = () => setIsPasswordShown((prev) => !prev);

  const handleSelectServer = (value) => {
    setSelectedServer(value);
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        minHeight: '100vh',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 400,
          padding: '20px',
          borderRadius: '8px',
        }}
      >
        <Typography variant="h4" align="center">
          Welcome to Panorah! 👋🏻
        </Typography>
        <Typography align="center" style={{ marginBottom: '20px' }}>
          Please sign-in to your account to start the adventure.
        </Typography>

        {error && (
          <Alert severity="error" style={{ marginBottom: '20px' }}>
            {error}
          </Alert>
        )}

        <form
          onSubmit={handleLogin}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
          />
          <TextField
            fullWidth
            label="Password"
            type={isPasswordShown ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleClickShowPassword}>
                    <i className={isPasswordShown ? 'tabler-eye' : 'tabler-eye-off'} />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Divider>Choose Server</Divider>

          <Box sx={{ paddingTop: '10px', width: '100%' }}>
            <Select
              value={selectedServer}
              onChange={(e) => handleSelectServer(e.target.value)}
              variant="outlined"
              displayEmpty
              fullWidth
            >
              {defaultServers.map((server, index) => (
                <MenuItem key={index} value={server}>
                  {server}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Button fullWidth variant="contained" type="submit">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;
