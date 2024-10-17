import React, { Component, Fragment } from "react";
import axios from 'axios';
import { Navigate, Link } from 'react-router-dom';
import HeaderThree from "../Components/layout/headerthree";
import Footer from "../Components/layout/footer";

class Dashboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
            user: null,
            matches: [],  // Store matches in the state
            redirect: false, // Used to handle logout redirection
            currentIndex: 0, // Track the current index of the carousel
        };
    }

    componentDidMount() {
        const token = localStorage.getItem('token');
        
        // If no token is found, redirect to login
        if (!token) {
            this.setState({ redirect: true });
        } else {
            // Fetch user data and matches
            this.fetchUserData(token);
            this.fetchMatches(token);
        }
    }

    fetchUserData(token) {
        axios.get('http://localhost:5000/dashboard', {
            headers: {
                Authorization: `Bearer ${token}`  // Send token in request headers
            }
        })
        .then(response => {
            this.setState({
                message: response.data.message,
                user: response.data.user
            });
        })
        .catch(error => {
            console.error("Error loading dashboard:", error);
        });
    }

    fetchMatches(token) {
        // Fetch matches based on similar interests
        axios.get('http://localhost:5000/users/matches', {
            headers: {
                Authorization: `Bearer ${token}`,  // Send token in request headers
            },
        })
        .then(response => {
            this.setState({ matches: response.data });
        })
        .catch(error => {
            console.error('Error fetching matches:', error);
        });
    }

    handleLogout = () => {
        // Remove token from localStorage
        localStorage.removeItem('token');
        
        // Redirect to the login page
        this.setState({ redirect: true });
    };

    handleNext = () => {
        const { currentIndex, matches } = this.state;
        const maxIndex = Math.floor(matches.length / 3); // Calculate max index based on 3 profiles per page

        if (currentIndex < maxIndex) {
            this.setState({ currentIndex: currentIndex + 1 });
        }
    };

    render() {
        const { matches, currentIndex } = this.state;

        // If the user is not authenticated, redirect to login
        if (this.state.redirect) {
            return <Navigate to="/login" />;
        }

        // Split matches into groups of 3 for each carousel item
        const matchGroups = [];
        for (let i = 0; i < matches.length; i += 3) {
            matchGroups.push(matches.slice(i, i + 3));
        }

        // Add a final card to say "That's all your matches" if there are matches
        if (matches.length > 0) {
            matchGroups.push([{ id: 'no-more-matches', isEndMessage: true }]);
        }

        return (
            <Fragment>
                <HeaderThree/>
                
                {/* Dashboard Message and User Info */}
                <div className="dashboard-content container mt-5">
                    {this.state.user && <p>Welcome, {this.state.user.email}</p>}

                    {/* Matches Section */}
                    <h2>Matches</h2>
                    
                    {/* Carousel */}
                    <div id="matchesCarousel" className="carousel slide">
                        <div className="carousel-inner">
                            {matchGroups.map((group, groupIndex) => (
                                <div className={`carousel-item ${groupIndex === currentIndex ? 'active' : ''}`} key={groupIndex}>
                                    <div className="row">
                                        {group.map((match) => (
                                            match.isEndMessage ? (
                                                <div className="col-12 text-center" key="end-message">
                                                    <div className="card mb-4">
                                                        <div className="card-body">
                                                            <h5 className="card-title">That's all your matches!</h5>
                                                            <p className="card-text">You've viewed all available matches.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="col-md-4" key={match.id}>
                                                    <Link to={`/profile/${match.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        <div className="card mb-4" style={{ cursor: 'pointer' }}>
                                                            <div className="card-body text-center">
                                                                {match.profile_picture ? (
                                                                    <img
                                                                        src={match.profile_picture}
                                                                        alt={`${match.name}'s profile`}
                                                                        style={{
                                                                            width: '150px',
                                                                            height: '150px',
                                                                            objectFit: 'cover',
                                                                            borderRadius: '50%',
                                                                        }}
                                                                    />
                                                                ) : (
                                                                    <div
                                                                        style={{
                                                                            width: '150px',
                                                                            height: '150px',
                                                                            backgroundColor: '#ddd',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            justifyContent: 'center',
                                                                            borderRadius: '50%',
                                                                            fontSize: '24px',
                                                                            color: '#999',
                                                                        }}
                                                                    >
                                                                        No Image
                                                                    </div>
                                                                )}
                                                                <h5 className="card-title mt-3">{match.name} {match.surname}</h5>
                                                                <p className="card-text">{match.bio || "No bio available"}</p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Visible Next Button, hide if there are no more matches */}
                        {currentIndex < matchGroups.length - 1 && (
                            <button className="carousel-control-next" type="button" onClick={this.handleNext}>
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        )}
                    </div>
                </div>

                <Footer/>
            </Fragment>
        );
    }
}

export default Dashboard;
