import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Register from './pages/Register';
import Login from './pages/Login';
import PrivateRoute from './Components/PrivateRoute';
import Dashboard from './pages/DashBoard';
import ProfileCompletion from './pages/ProfileCompletion';
import ProfileView from './pages/ProfileView';
import ProfilePage from './pages/ProfilePage';
import MembershipSelection from './pages/Membership';
import ChatPage from './pages/ChatPage';
import MatchedPage from './pages/MatchedPage';
import RequestPasswordReset from './pages/RequestPassword';
import ResetPassword from './pages/ResetPassword';
import Policy from './pages/policy';
import ErrorPage from './pages/errorpage';
import { SendBirdProvider } from '@sendbird/uikit-react';
import axios from 'axios';

function App() {
  const [userId, setUserId] = useState("3"); // Default userId
  const [loggedInUser, setLoggedInUser] = useState(null); // Store user details

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) return;

        const response = await axios.get('http://localhost:5000/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { profile } = response.data;
        setUserId(profile.id);
        setLoggedInUser(profile); // Store full user profile
        console.log(`Logged-in user: ID=${profile.id}, Name=${profile.name}, Email=${profile.email}`);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  return (

      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/Dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/ProfileCompletion" element={<PrivateRoute><ProfileCompletion /></PrivateRoute>} />
          <Route path="/Profileview" element={<PrivateRoute><ProfileView /></PrivateRoute>} />
          <Route path="/profile/:id" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
          <Route path="/Membership" element={<PrivateRoute><MembershipSelection /></PrivateRoute>} />
          <Route path="/chat" element={<PrivateRoute><ChatPage /></PrivateRoute>} />
          <Route path="/matched" element={<PrivateRoute><MatchedPage /></PrivateRoute>} />
          <Route path="*" element={<ErrorPage />} />
          <Route path="policy" element={<Policy />} />

          {/* Password reset routes */}
          <Route path="/request-password-reset" element={<RequestPasswordReset />} />
          <Route path="/reset-password" element={<ResetPassword />} />
        </Routes>

        {/* Debugging Info */}
        {loggedInUser && (
          <div style={{ position: 'fixed', bottom: 0, right: 0, background: '#f4f4f4', padding: '10px', boxShadow: '0px -2px 5px rgba(0,0,0,0.1)' }}>
            <p>Logged-in User: <strong>{loggedInUser.name}</strong></p>
            <p>ID: {loggedInUser.id}</p>
            <p>Email: {loggedInUser.email}</p>
          </div>
        )}
      </div>
 
  );
}

export default App;
