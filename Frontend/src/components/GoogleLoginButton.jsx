import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export default function GoogleLoginButton({ setUser }) {
  const handleLoginSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/google-login`,
        { token: credentialResponse.credential }
      );

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));

      setUser(res.data.user);
    } catch (error) {
      console.error("Login failed:", error.response?.data || error.message);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleLoginSuccess}
      onError={() => console.log('Login Failed')}
    />
  );
}
