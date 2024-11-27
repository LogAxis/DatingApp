import React, { useState } from 'react';
import axios from 'axios';
import zxcvbn from 'zxcvbn';  // For password strength check
import { useNavigate } from 'react-router-dom';
import { initializeSendBirdUser } from '../Services/sendbirdInit';  // Import SendBird initialization

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const navigate = useNavigate();

  // Handle password strength update
  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
    const strengthResult = zxcvbn(value);
    setPasswordStrength(strengthResult.score);
  };

  // Check confirm password match
  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
    setPasswordsMatch(password === value);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      // Register user on the backend
      const response = await axios.post('http://localhost:5000/register', {
        name,
        email,
        password,
      });

      const uid = String(response.data.userId);  // Convert userId to string for SendBird registration

      // Register user on SendBird
      await initializeSendBirdUser(uid, name,null);

      // Store the JWT token
      localStorage.setItem('token', response.data.token);

      // Redirect to profile completion page
      navigate('/Profileview');
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed');
    }
  };

  // Helper functions for password strength feedback
  const getPasswordStrengthText = (score) => {
    switch (score) {
      case 0:
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  };

  const getStrengthBarColor = (score) => {
    switch (score) {
      case 0:
      case 1:
        return 'bg-danger';
      case 2:
        return 'bg-warning';
      case 3:
        return 'bg-info';
      case 4:
        return 'bg-success';
      default:
        return '';
    }
  };

  return (
    <section className="log-reg">
      <div className="top-menu-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-8 col-7">
              <div className="logo">
                <a href="/"><img src="assets/images/logo/logo.png" alt="logo" /></a>
              </div>
            </div>
            <div className="col-lg-4 col-5">
              <a href="/" className="backto-home"><i className="fas fa-chevron-left"></i> Back to Home</a>
            </div>
          </div>
        </div>
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-7">
            <div className="log-reg-inner">
              <div className="section-header">
                <h2 className="title">Welcome to Dating Le Vava</h2>
                <p>Let's create your profile! Just fill in the fields below, and we’ll get a new account.</p>
              </div>
              <div className="main-content">
                <form onSubmit={handleSubmit}>
                  <h4 className="content-title">Account Details</h4>
                  <div className="form-group">
                    <label>Username*</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter Your Username *"
                      className="my-form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Email Address*</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Your Email *"
                      className="my-form-control"
                      required
                    />
                  </div>

                  {/* Password Field with Strength Meter */}
                  <div className="form-group">
                    <label>Password*</label>
                    <input
                      type="password"
                      value={password}
                      onChange={handlePasswordChange}
                      placeholder="Enter Your Password *"
                      className="my-form-control"
                      required
                    />
                    {passwordStrength !== null && (
                      <div className="mt-2">
                        <div className="progress">
                          <div
                            className={`progress-bar ${getStrengthBarColor(passwordStrength)}`}
                            style={{ width: `${(passwordStrength + 1) * 20}%` }}
                          />
                        </div>
                        <small>Password strength: {getPasswordStrengthText(passwordStrength)}</small>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password Field */}
                  <div className="form-group">
                    <label>Confirm Password*</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={handleConfirmPasswordChange}
                      placeholder="Enter Your Password Again *"
                      className="my-form-control"
                      required
                    />
                    {!passwordsMatch && (
                      <small className="text-danger">Passwords do not match</small>
                    )}
                  </div>

                  <button type="submit" className="default-btn reverse"><span>Create Your Profile</span></button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
