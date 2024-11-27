import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import axios from 'axios';
import { initializeSendBirdUser } from '../Services/sendbirdInit'; // Import SendBird initialization

const title = "Welcome to Dating Le Vava";
const otherTitle = "Sign up with your email";

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // For password visibility toggle
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Loader state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading

    try {
      // API call to backend for login
      const response = await axios.post('http://localhost:5000/login', {
        email,
        password,
      });

      const uid = response.data.userId; // Get the user ID from the response

      // Log in the user to SendBird
     // await initializeSendBirdUser(uid, email);  // You can use their actual name or email as the nickname

      // Store the JWT token in localStorage
      localStorage.setItem('token', response.data.token);

      // Redirect to the dashboard after successful login
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during login:', error);
      setError('Invalid login credentials, please try again.');
    } finally {
      setLoading(false); // End loading
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle password visibility
  };

  return (
    <section className="log-reg">
      <div className="top-menu-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-7">
              <div className="logo">
                <Link to="/"><img src="assets/images/logo/logo.png" alt="logo" /></Link>
              </div>
            </div>
            <div className="col-lg-4 col-5">
              <Link to="/" className="backto-home"><i className="fas fa-chevron-left"></i> Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">

          <div className="image image-log"></div>
          <div className="col-lg-7">
            <div className="log-reg-inner">
              <div className="section-header inloginp">
                <h2 className="title">{title}</h2>
              </div>
              <div className="main-content inloginp">
                <form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Your Email *"
                      className="my-form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Password</label>
                    <div className="input-group">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter Your Password *"
                        className="my-form-control"
                        required
                      />
                      <span
                        className="input-group-text"
                        onClick={togglePasswordVisibility}
                        style={{ cursor: 'pointer' }}
                      >
                        {showPassword ? 'Hide' : 'Show'}
                      </span>
                    </div>
                  </div>
                  {/* Display error message if login fails */}
                  {error && <p style={{ color: 'red' }}>{error}</p>}

                  {/* Show loader if loading */}
                  {loading && <p>Loading...</p>}

                  <p className="f-pass">Forgot your password? <NavLink to='/request-password-reset'> Click Here</NavLink></p>
                  <div className="text-center">
                    <button type="submit" className="default-btn"><span>Sign IN</span></button>
                  </div>
                  <div className="or">
                   {/*} <p>OR</p>
                  </div>
                  <div className="or-content">
                    <p>{otherTitle}</p>
                    <a href="#" className="default-btn reverse">
                      <img src="assets/images/login/google.png" alt="google" />
                      <span>Sign Up with Google</span>
                    </a>*/}
                    <p className="or-signup"> Don't have an account? <Link to="/register">Sign up here</Link></p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LogIn;
