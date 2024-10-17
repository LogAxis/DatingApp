import { Component } from "react";
import { Link, NavLink, Navigate } from "react-router-dom";

class HeaderThree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect: false,
        };
    }

    // Logout function
    handleLogout = () => {
        // Remove token from localStorage
        localStorage.removeItem('token');
        
        // Set redirect state to true to trigger navigation to the login page
        this.setState({ redirect: true });
    };

    // Lifecycle method to handle scroll event
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
    }

    componentWillUnmount() {
        // Remove scroll event listener to prevent memory leaks
        window.removeEventListener('scroll', this.handleScroll);
    }

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
        // Redirect to login page after logout
        if (this.state.redirect) {
            return <Navigate to="/" />;
        }

        return (
            <header className="header header--style2" id="navbar">
                <div className="header__bottom">
                    <div className="container">
                        <nav className="navbar navbar-expand-lg">
                            <Link className="navbar-brand" to="/Dashboard"><img src="assets/images/logo/logo.png" alt="logo" /></Link>
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
                                    </ul>
                                </div>
                                
                                {/* Change My Account button to Logout */}
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
