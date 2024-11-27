import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import HeaderThree from '../Components/layout/headerthree';

const ProfilePage = () => {
    const { id } = useParams();
    const [profile, setProfile] = useState(null);
    const [interests, setInterests] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        axios.get(`http://localhost:5000/users/profile/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            setProfile(response.data.profile);
            setInterests(response.data.interests);
        })
        .catch(error => {
            console.error('Error fetching profile:', error);
            setError('Failed to load profile.');
        });
    }, [id]);

    const handleLike = async () => {
        const token = localStorage.getItem('token');
        
        try {
            await axios.post(
                'http://localhost:5000/users/like',
                { likedUserId: id },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("You've liked this profile!");
        } catch (error) {
            console.error('Error liking profile:', error);
            setError('Failed to like profile.');
        }
    };

    if (error) return <p>{error}</p>;
    if (!profile) return <p>Loading...</p>;

    return (
        <Fragment>
           
            <div className="container mt-5">
                <div className="card shadow-lg p-4" style={{
                    borderRadius: '20px',
                    overflow: 'hidden',
                    maxWidth: '600px',
                    margin: '0 auto',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                    textAlign: 'left'
                }}>
                    <div style={{ position: 'relative' }}>
                        {profile?.profile_picture ? (
                            <img
                                src={profile.profile_picture}
                                alt={`${profile.name}'s profile`}
                                style={{
                                    width: '100%',
                                    height: '400px',
                                    objectFit: 'cover',
                                }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: '100%',
                                    height: '400px',
                                    backgroundColor: '#ddd',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '24px',
                                    color: '#666',
                                }}
                            >
                                No Image
                            </div>
                        )}
                        <div
                            style={{
                                position: 'absolute',
                                bottom: '0',
                                width: '100%',
                                background: 'linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)',
                                color: '#fff',
                                padding: '20px',
                                textAlign: 'left',
                            }}
                        >
                            <h2 className="mb-1" style={{ fontWeight: 'bold' }}>{profile?.name} {profile?.surname}</h2>
                            <p>{profile?.bio || 'No bio available'}</p>
                        </div>
                    </div>

                    <div className="profile-info mt-4" style={{ textAlign: 'left' }}>
                        <p><strong>Age:</strong> {profile?.age || 'N/A'}</p>
                        <p><strong>Gender:</strong> {profile?.gender || 'N/A'}</p>
                        <p><strong>Location:</strong> {profile?.location || 'N/A'}</p>
                    </div>

                    <h4 className="mt-4" style={{ textAlign: 'left' }}>Interests</h4>
                    <ul className="list-inline" style={{ textAlign: 'left' }}>
                        {interests.length > 0 ? (
                            interests.map(interest => (
                                <li key={interest.id} className="list-inline-item badge m-2 p-2" style={{
                                    backgroundColor: '#e0e0e0',
                                    color: '#333',
                                    borderRadius: '20px',
                                    fontSize: '0.9rem',
                                    padding: '10px 15px',
                                }}>
                                    {interest.name}
                                </li>
                            ))
                        ) : (
                            <p>No interests selected.</p>
                        )}
                    </ul>

                    <div className="text-center mt-4">
                        <button onClick={handleLike} className="btn" style={{
                            backgroundColor: '#ff6b6b',
                            color: 'white',
                            padding: '10px 20px',
                            fontSize: '1.1rem',
                            borderRadius: '25px',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                            cursor: 'pointer',
                        }}>
                            Like
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default ProfilePage;
