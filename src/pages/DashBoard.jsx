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
            matches: [],
            redirect: false,
            currentIndex: 0,
            isDesktop: window.innerWidth >= 768 // Determines if in desktop or mobile mode
        };
    }

    componentDidMount() {
        const token = localStorage.getItem('token');
        
        if (!token) {
            this.setState({ redirect: true });
        } else {
            this.checkMutualLikes(token);
            this.fetchUserData(token);
            this.fetchMatches(token);
        }

        // Add event listener for window resize
        window.addEventListener('resize', this.updateScreenMode);
    }

    componentWillUnmount() {
        // Remove event listener on component unmount
        window.removeEventListener('resize', this.updateScreenMode);
    }

    updateScreenMode = () => {
        // Update state based on window width
        this.setState({ isDesktop: window.innerWidth >= 768 });
    };

    checkMutualLikes(token) {
        axios.post('http://localhost:5000/check-mutual-likes', {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => {
            console.log(response.data.message);
        })
        .catch(error => {
            console.error("Error checking mutual likes:", error);
        });
    }

    fetchUserData(token) {
        axios.get('http://localhost:5000/dashboard', {
            headers: {
                Authorization: `Bearer ${token}`
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
        axios.get('http://localhost:5000/users/matches', {
            headers: {
                Authorization: `Bearer ${token}`,
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
        localStorage.removeItem('token');
        this.setState({ redirect: true });
    };

    handleNext = () => {
        const { currentIndex, matches } = this.state;
        const maxIndex = Math.floor(matches.length / 2);

        if (currentIndex < maxIndex) {
            this.setState({ currentIndex: currentIndex + 1 });
        }
    };

    render() {
        const { matches, currentIndex, isDesktop } = this.state;

        if (this.state.redirect) {
            return <Navigate to="/login" />;
        }

        const matchGroups = [];
        for (let i = 0; i < matches.length; i += isDesktop ? 2 : 1) {
            matchGroups.push(matches.slice(i, i + (isDesktop ? 2 : 1)));
        }

        if (matches.length > 0) {
            matchGroups.push([{ id: 'no-more-matches', isEndMessage: true }]);
        }

        return (
            <Fragment>
                <HeaderThree/>
                
                <div className="dashboard-content container mt-5">
                    {this.state.user && <p>Welcome, {this.state.user.email}</p>}

                    <h2 style={{ textAlign: 'center', fontWeight: 'bold', marginBottom: '20px' }}>Your Matches</h2>
                    
                    <div id="matchesCarousel" className="carousel slide" style={{ backgroundColor: '#f7f7f7', padding: '20px', borderRadius: '15px' }}>
                        <div className="carousel-inner">
                            {matchGroups.map((group, groupIndex) => (
                                <div className={`carousel-item ${groupIndex === currentIndex ? 'active' : ''}`} key={groupIndex}>
                                    <div className="row gx-2 justify-content-center">
                                        {group.map((match) => (
                                            match.isEndMessage ? (
                                                <div className="col-12 text-center" key="end-message">
                                                    <div className="card mb-4" style={{ border: 'none', boxShadow: 'none' }}>
                                                        <div className="card-body">
                                                            <h5 className="card-title">That's all your matches!</h5>
                                                            <p className="card-text">You've viewed all available matches.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div
                                                    className="d-flex justify-content-center"
                                                    key={match.id}
                                                    style={{
                                                        flex: '0 0 100%',
                                                        maxWidth: '100%',
                                                        ...(isDesktop && {
                                                            flex: '0 0 50%',
                                                            maxWidth: '50%',
                                                        }),
                                                    }}
                                                >
                                                    <Link to={`/profile/${match.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                                        <div className="card" style={{
                                                            position: 'relative',
                                                            width: '350px',
                                                            height: '450px',
                                                            borderRadius: '20px',
                                                            overflow: 'hidden',
                                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                                                            cursor: 'pointer',
                                                        }}>
                                                            {match.profile_picture ? (
                                                                <img
                                                                    src={match.profile_picture}
                                                                    alt={`${match.name}'s profile`}
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        objectFit: 'cover',
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div
                                                                    style={{
                                                                        width: '100%',
                                                                        height: '100%',
                                                                        backgroundColor: '#ddd',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        fontSize: '24px',
                                                                        color: '#999',
                                                                    }}
                                                                >
                                                                    No Image
                                                                </div>
                                                            )}
                                                            {/* Gradient overlay */}
                                                            <div
                                                                style={{
                                                                    position: 'absolute',
                                                                    bottom: '0',
                                                                    width: '100%',
                                                                    background: 'linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent)',
                                                                    color: '#fff',
                                                                    padding: '20px 10px',
                                                                    textAlign: 'left',
                                                                }}
                                                            >
                                                                <h5 className="card-title mb-1" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{match.name} {match.surname}</h5>
                                                                <p className="card-text" style={{ fontSize: '1rem', margin: '5px 0' }}>{match.bio || "No bio available"}</p>
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

                        {currentIndex < matchGroups.length - 1 && (
                            <button
                                className="carousel-control-next"
                                type="button"
                                onClick={this.handleNext}
                                style={{
                                    position: 'absolute',
                                    top: '50%',
                                    right: '0',
                                    transform: 'translateY(-50%)',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    color: 'white',
                                    padding: '5px 10px',
                                    borderRadius: '5px',
                                    cursor: 'pointer',
                                }}
                            >
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
