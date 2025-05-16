import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Layout from './components/Layout';
import './index.css';

function App() {
  return (
    <Router>
      <UserProvider>
        <Layout />
      </UserProvider>
    </Router>
  );
}

export default App;