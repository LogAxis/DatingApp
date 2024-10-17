import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';

const title = "Welcome to Ollya";
const otherTitle = "Sign up with your email";

const LogIn = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            // API call to backend for login
            const response = await axios.post('http://localhost:5000/login', {
                email,
                password,
            });

            // Store the JWT token in localStorage
            localStorage.setItem('token', response.data.token);

            // Redirect to the dashboard after successful login
            navigate('/dashboard');
        } catch (error) {
            console.error('Error during login:', error);
            setError('Invalid login credentials, please try again.');
        }
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
                                        <input
                                            type="password"
                                            name="password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder="Enter Your Password *"
                                            className="my-form-control"
                                            required
                                        />
                                    </div>
                                    {/* Display error message if login fails */}
                                    {error && <p style={{ color: 'red' }}>{error}</p>}
                                    <p className="f-pass">Forgot your password? <a href="#">recover password</a></p>
                                    <div className="text-center">
                                        <button type="submit" className="default-btn"><span>Sign IN</span></button>
                                    </div>
                                    <div className="or">
                                        <p>OR</p>
                                    </div>
                                    <div className="or-content">
                                        <p>{otherTitle}</p>
                                        <a href="#" className="default-btn reverse"><img src="assets/images/login/google.png" alt="google" /> <span>Sign Up with Google</span></a>
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
