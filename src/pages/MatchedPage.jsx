import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SendBird from 'sendbird';

const MatchedPage = () => {
    const [matches, setMatches] = useState([]);
    const [error, setError] = useState(null);

    // Initialize SendBird instance
    const sb = new SendBird({ appId: '9FD0F563-359A-4D98-8EE9-A2B548706773' }); // Replace with your SendBird app ID

    useEffect(() => {
        const token = localStorage.getItem('token');

        // Fetch matched users from the backend
        axios.get('http://localhost:5000/users/matched', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => {
            setMatches(response.data);
        })
        .catch(error => {
            console.error('Error fetching matches:', error);
            setError('Failed to load matches.');
        });
    }, []);

    // Function to start a conversation with a matched user
    const handleStartConversation = async (matchedUserId) => {
        const token = localStorage.getItem('token');
        const decodedToken = JSON.parse(atob(token.split('.')[1])); // Decode JWT to get user ID
        const currentUserId = decodedToken.id;

        // Connect to SendBird using the current user ID
        sb.connect(currentUserId.toString(), (user, error) => {
            if (error) {
                console.error('SendBird connection failed:', error);
                setError('Failed to start conversation.');
                return;
            }

            // Create a chat with matched user
            sb.GroupChannel.createChannelWithUserIds(
                [currentUserId.toString(), matchedUserId.toString()],
                true,
                (channel, error) => {
                    if (error) {
                        console.error('Error creating channel:', error);
                        setError('Failed to create chat channel.');
                        return;
                    }

                    // Send a message saying "matched"
                    channel.sendUserMessage('matched', (message, error) => {
                        if (error) {
                            console.error('Error sending message:', error);
                            setError('Failed to send message.');
                        } else {
                            alert(`Message sent to ${matchedUserId}: matched`);
                        }
                    });
                }
            );
        });
    };

    if (error) return <p>{error}</p>;

    return (
        <div className="container mt-5" style={{ maxWidth: '700px' }}>
            <h2 className="text-center" style={{ color: '#ff6b6b', fontWeight: 'bold', marginBottom: '20px' }}>Your Matches</h2>
            {matches.length > 0 ? (
                <div className="matches-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {matches.map(match => (
                        <div
                            key={match.id}
                            className="match-card"
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                padding: '15px',
                                borderRadius: '15px',
                                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                                backgroundColor: '#ffffff',
                                transition: 'transform 0.3s ease',
                            }}
                        >
                            <img
                                src={match.profile_picture || 'https://via.placeholder.com/80'}
                                alt="Profile"
                                style={{
                                    width: '80px',
                                    height: '80px',
                                    borderRadius: '50%',
                                    objectFit: 'cover',
                                    marginRight: '15px',
                                }}
                            />
                            <div style={{ flex: 1 }}>
                                <h5 style={{ margin: '0', fontWeight: 'bold', color: '#333' }}>{match.name}</h5>
                                <p style={{ color: '#555', fontSize: '0.9rem' }}>{match.bio || 'No bio available'}</p>
                            </div>
                            <button
                                onClick={() => handleStartConversation(match.id)}
                                style={{
                                    backgroundColor: '#ff6b6b',
                                    color: '#fff',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '20px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 4px 8px rgba(255, 107, 107, 0.3)',
                                    transition: 'background-color 0.3s ease',
                                    cursor: 'pointer',
                                }}
                                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                Start Conversation
                            </button>
                        </div>
                    ))}
                </div>
            ) : (
                <p className="text-center" style={{ color: '#666' }}>No matches yet.</p>
            )}
        </div>
    );
};

export default MatchedPage;
