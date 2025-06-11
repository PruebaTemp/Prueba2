import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './contexts/UserContext';
import Layout from './components/Layout';
import FaceLogin from './components/FaceLogin';
import UpdatePassword from './components/UpdatePassword';
import './index.css';

function App() {
  return (
    <Router>
      <UserProvider>
        <Routes>
          <Route path="/update-password" element={<UpdatePassword />} />
        </Routes>
        <Layout />
      </UserProvider>
    </Router>
  );
}

export default App;
