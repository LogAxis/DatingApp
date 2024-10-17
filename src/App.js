import React from 'react';
import {BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import logo from './logo.svg';
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


function App() {
  return (
    <div className="App">      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/contact' element={<Contact/>}/>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/Dashboard" element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
        <Route path="/ProfileCompletion" element={<PrivateRoute><ProfileCompletion/></PrivateRoute>}/>
        <Route path='/Profileview' element={<PrivateRoute><ProfileView/></PrivateRoute>}/>
        <Route path='/profile/:id' element={<PrivateRoute><ProfilePage/></PrivateRoute>}/>
        <Route path='/Membership' element={<PrivateRoute><MembershipSelection/></PrivateRoute>} />    
      </Routes>
    </div>
  );
}

export default App;
