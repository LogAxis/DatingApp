import React, { Component } from "react";
import { Link, NavLink, Navigate } from "react-router-dom";
import { jwtDecode} from 'jwt-decode';  // Import jwt-decode to decode JWT token

class HeaderThree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
            membershipTierId: null,  // State to store membership tier
        };
    }

    componentDidMount() {
        // Decode token to get membership tier
        const token = localStorage.getItem('token');
        if (token) {
            const decoded = jwtDecode(token);
            this.setState({ membershipTierId: decoded.membership_tier_id });
        }

        // Add scroll event listener
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        // Remove scroll event listener to prevent memory leaks
        window.removeEventListener('scroll', this.handleScroll);
    }

    handleLogout = () => {
        // Remove token from localStorage and redirect
        localStorage.removeItem('token');
        this.setState({ redirect: true });
    };

    handleScroll = () => {
        const header = document.querySelector('.header');
        if (header) {
            var value = window.scrollY;
            if (value > 200) {
                header.classList.add('header-fixed', 'animated', 'fadeInDown');
            } else {
                header.classList.remove('header-fixed', 'animated', 'fadeInDown');
            }
        }
    };

    render() {
        const { redirect, membershipTierId } = this.state;

        // Redirect to login page after logout
        if (redirect) {
            return <Navigate to="/" />;
        }

        return (
            <header className="header header--style2" id="navbar">
                <div className="header__bottom">
                    <div className="container">
                        <nav className="navbar navbar-expand-lg">
                            <Link className="navbar-brand" to="/Dashboard">
                                <img src="assets/images/logo/logo.png" alt="logo" />
                            </Link>
                            <button className="navbar-toggler collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#navbarNavAltMarkup" aria-controls="navbarNavAltMarkup" aria-expanded="false"
                                aria-label="Toggle navigation">
                                <span className="navbar-toggler--icon"></span>
                            </button>
                            <div className="collapse navbar-collapse justify-content-end" id="navbarNavAltMarkup">
                                <div className="navbar-nav mainmenu">
                                    <ul>
                                        <li><NavLink to="/Dashboard">Home</NavLink></li>
                                        <li><NavLink to="/ProfileView">Profile</NavLink></li>
                                        <li><NavLink to="/Membership">Membership</NavLink></li>

                                        {/* Conditionally render Chat and Matched links based on membership tier */}
                                        {membershipTierId > 1 && (
                                            <>
                                                <li><NavLink to="/chat">Chat</NavLink></li>
                                                <li><NavLink to="/matched">Matched</NavLink></li>
                                            </>
                                        )}
                                    </ul>
                                </div>

                                {/* Logout button */}
                                <div className="header__more">
                                    <button className="default-btn" onClick={this.handleLogout}>Logout</button>
                                </div>
                            </div>
                        </nav>
                    </div>
                </div>
            </header>
        );
    }
}

export default HeaderThree;
