import React, { useState } from 'react';
import axios from 'axios';
import zxcvbn from 'zxcvbn';  // Import zxcvbn for password strength
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(null);  // Password strength score
  const [passwordsMatch, setPasswordsMatch] = useState(true);  // Check if passwords match
  const navigate = useNavigate();

  // Update password strength score dynamically as user types
  const handlePasswordChange = (e) => {
    const { value } = e.target;
    setPassword(value);
    const strengthResult = zxcvbn(value);  // Calculate password strength
    setPasswordStrength(strengthResult.score);
  };

  // Check if the confirm password matches the original password
  const handleConfirmPasswordChange = (e) => {
    const { value } = e.target;
    setConfirmPassword(value);
    setPasswordsMatch(password === value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/register', {
        name,
        email,
        password,
      });

      // Store the JWT token in localStorage
      localStorage.setItem('token', response.data.token);

      // Redirect to the profile completion page after successful registration
      navigate('/Profileview');
    } catch (error) {
      console.error('Error during registration:', error);
      alert('Registration failed');
    }
  };

  // Function to display password strength feedback
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

  // Function to set strength bar color based on score
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
          <div className="image"></div>
          <div className="col-lg-7">
            <div className="log-reg-inner">
              <div className="section-header">
                <h2 className="title">Welcome to Ollya</h2>
                <p>Let's create your profile! Just fill in the fields below, and we’ll get a new account.</p>
              </div>
              <div className="main-content">
                <form onSubmit={handleSubmit}>
                  <h4 className="content-title">Account Details</h4>
                  <div className="form-group">
                    <label>Username*</label>
                    <input
                      type="text"
                      name="name"
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
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter Your Email *"
                      className="my-form-control"
                      required
                    />
                  </div>

                  {/* Password with Strength Meter */}
                  <div className="form-group">
                    <label>Password*</label>
                    <input
                      type="password"
                      name="password"
                      value={password}
                      onChange={handlePasswordChange}  // Update password and strength
                      placeholder="Enter Your Password *"
                      className="my-form-control"
                      required
                    />
                    {/* Password strength meter */}
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

                  {/* Confirm Password */}
                  <div className="form-group">
                    <label>Confirm Password*</label>
                    <input
                      type="password"
                      name="confirmPassword"
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
