import React, { useEffect, useState } from 'react';
import baseUrl from '../utility/baseURL';

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};

const Countdown = () => {
  const [token, setToken] = useState(window.localStorage.getItem('token'));
  const [seconds, setSeconds] = useState(0);

  const refreshToken = () => {
    const storedToken = window.localStorage.getItem('token');
    setToken(storedToken);

    if (storedToken) {
      const decodedToken = parseJwt(storedToken);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decodedToken && decodedToken.exp) {
        const timeUntilExpiration = decodedToken.exp - currentTime;
        setSeconds(timeUntilExpiration > 0 ? timeUntilExpiration : 0);

        // Check if countdown reaches 0 and delete token
        if (timeUntilExpiration <= 0) {
          window.localStorage.removeItem('token');
          setToken(null); // Update token state to null or ''
        }
      }
    }
  };

  useEffect(() => {
    refreshToken();

    // Update countdown every second
    const intervalId = setInterval(() => {
      refreshToken();
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const handleTokenValidation = async () => {
    try {
      // Checking if token exists (aka user is logged in)
      if (token) {
        // Sends GET request to validate the token by fetching posts
        const response = await fetch(`${baseUrl}/posts`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          // Token is still valid, update the token in local storage
          const data = await response.json();
          window.localStorage.setItem("token", data.token);
          setToken(window.localStorage.getItem("token"));
        } else {
          // Token is invalid or expired, handle accordingly
          throw new Error('Invalid or expired token');
        }
      }
    } catch (error) {
      // Handle token validation failure (e.g., logout the user)
      console.error('Token validation error:', error);
      window.localStorage.removeItem('token');
      setToken(null); // Update token state to null or ''
    }
  };

  if (token) {
    const decodedToken = parseJwt(token);
    const userId = decodedToken ? decodedToken.user_id : null;

    return (
      <div>
        You Have a Token that expires in {seconds} seconds<br/><br/>
        Your Token is: <br/>{token}<br/><br/>
        Your user ID is: <br/>{userId}<br/><br/>
        You are logged in as: <br/>
        <button onClick={handleTokenValidation}>Refresh Token</button>
      </div>
    );
  } else {
    return (
      <div>
        You currently do not have a Token
        <br/>
        <br/>
        <a href='/login'>Login</a>
      </div>
    );
  }
};

export default Countdown;

