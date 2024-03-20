/* eslint-disable */
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  const [welcomeMessage, setWelcomeMessage] = useState('...loading');

  useEffect(() => {
    const fetchWelcomeMessage = async () => {
      try {
        const res = await axios.get('http://localhost:3001/users/welcome');
        setWelcomeMessage(res.data);
      } catch (error) {
        console.log(error);
        setWelcomeMessage('Failed to load message from server');
      }
    };

    fetchWelcomeMessage();
  }, []);

  return (
    <div className='App'>
      <h1>"Hello server!" says the client (NEXT)</h1>
      <h1>"{welcomeMessage}" says the server (NEXT)</h1>
    </div>
  );
};

export default Home;
