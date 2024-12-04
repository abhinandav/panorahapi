/* eslint-disable */

'use client';

import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@configs/firebaseconfig'
import { useRouter } from 'next/navigation';


import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Divider from '@mui/material/Divider';
import Alert from '@mui/material/Alert';

import Link from 'next/link';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [isPasswordShown, setIsPasswordShown] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      const token = await user.getIdToken();
      console.log('Token:', token);
      localStorage.setItem("authToken", token);
      router.push(`/dashboards/doctypelist`);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleClickShowPassword = () => setIsPasswordShown((prev) => !prev);


  return (
    <div style={{ display: 'flex', justifyContent: 'center', minHeight: '100vh', alignItems: 'center' }}>
      <div style={{ width: '100%', maxWidth: 400, padding: '20px', borderRadius: '8px' }}>
        <Typography variant="h4" align="center">
          Welcome to Panorah! 👋🏻
        </Typography>
        <Typography align="center" style={{ marginBottom: '20px' }}>
          Please sign-in to your account to start the adventure.
        </Typography>

        {error && <Alert severity="error" style={{ marginBottom: '20px' }}>{error}</Alert>}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
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
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="Remember me"
          />
          <Button fullWidth variant="contained" type="submit">
            Login
          </Button>
        </form>

        <div style={{ textAlign: 'center', margin: '16px 0' }}>
          <Typography>
            Forgot password?{' '}
            <Link href="/forgot-password" passHref>
              <Typography component="span" color="primary">
                Click here
              </Typography>
            </Link>
          </Typography>
        </div>

        <Divider>or</Divider>

        <Button
          color="secondary"
          fullWidth
          style={{ marginTop: '16px' }}
          startIcon={<img src="/images/logos/google.png" alt="Google" width={22} />}
          onClick={() => console.log('Google Login')} 
        >
          Sign in with Google
        </Button>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <Typography>
            New on our platform?{' '}
            <Link href="/register" passHref>
              <Typography component="span" color="primary">
                Create an account
              </Typography>
            </Link>
          </Typography>
        </div>
      </div>
    </div>
  );
};

export default Login;
