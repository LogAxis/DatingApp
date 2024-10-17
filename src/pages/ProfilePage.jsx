import React, { useState, useEffect, Fragment } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import HeaderThree from '../Components/layout/headerthree';

const ProfilePage = () => {
    const { id } = useParams();  // Get the user's ID from the URL
    const [profile, setProfile] = useState(null);
    const [interests, setInterests] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        // Fetch the profile and interests data
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

    if (error) return <p>{error}</p>;
    if (!profile) return <p>Loading...</p>;

    return (
        <Fragment>
            <HeaderThree/>
            <div className="container mt-5">
                <div className="card shadow-lg p-4">
                    <h2 className="text-center mb-4">{profile.name} {profile.surname}'s Profile</h2>
                    <div className="text-center mb-4">
                        {profile.profile_picture ? (
                            <img
                                src={profile.profile_picture}  // Use the image URL for rendering
                                alt={`${profile.name}'s profile`}
                                style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '50%' }}
                            />
                        ) : (
                            <div
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    backgroundColor: '#ddd',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '18px',
                                    color: '#666',
                                }}
                            >
                                No Image
                            </div>
                        )}
                    </div>

                    <div className="profile-info text-center">
                        <p><strong>Bio:</strong> {profile.bio || 'No bio available'}</p>
                        <p><strong>Age:</strong> {profile.age || 'N/A'}</p>
                        <p><strong>Gender:</strong> {profile.gender || 'N/A'}</p>
                        <p><strong>Location:</strong> {profile.location || 'N/A'}</p>
                    </div>

                    <h4 className="text-center mt-4">Interests</h4>
                    <ul className="list-inline text-center">
                        {interests.length > 0 ? (
                            interests.map(interest => (
                                <li key={interest.id} className="list-inline-item badge bg-secondary m-2 p-2">
                                    {interest.name}
                                </li>
                            ))
                        ) : (
                            <p className="text-center">No interests selected.</p>
                        )}
                    </ul>
                </div>
            </div>
        </Fragment>
    );
};

export default ProfilePage;
