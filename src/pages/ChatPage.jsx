import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { initializeSendBirdUser, fetchPastChats } from '../Services/sendbirdInit';
import { Channel, SendBirdProvider } from '@sendbird/uikit-react';
import '@sendbird/uikit-react/dist/index.css'; // Import required styles

function ChatPage() {
    const [userProfile, setUserProfile] = useState(null); // Store user profile
    const [pastChats, setPastChats] = useState([]); // Store past chats
    const [currentChannelUrl, setCurrentChannelUrl] = useState(''); // Current channel
    const [userId, setUserId] = useState(null); // Dynamic userId

    // Fetch user profile and initialize SendBird user
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await axios.get('http://localhost:5000/users/profile', {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                const { profile } = response.data;
                setUserProfile(profile);
                setUserId(profile.id); // Set dynamic userId

                await initializeSendBirdUser(
                    profile.id,
                    profile.name,
                    profile.profile_picture
                );
                console.log('User initialized in SendBird:', profile.name);
            } catch (error) {
                console.error('Error fetching user profile or initializing SendBird:', error);
            }
        };

        const fetchChats = async () => {
            try {
                const channels = await fetchPastChats();
                setPastChats(channels);
            } catch (error) {
                console.error('Failed to fetch past chats:', error);
            }
        };

        // Fetch profile and chats
        fetchUserProfile().then(fetchChats);
    }, []);

    const handleChannelClick = (channelUrl) => {
        setCurrentChannelUrl(channelUrl);
    };

    // Render loading state if userId is not yet fetched
    if (!userId) {
        return <div>Loading...</div>;
    }

    return (
        <SendBirdProvider appId="9FD0F563-359A-4D98-8EE9-A2B548706773" userId={userId + ""}>
            <div style={{ display: 'flex', height: '100vh', fontFamily: 'Arial, sans-serif' }}>
                {/* Sidebar for past chats */}
                <div
                    style={{
                        width: '30%',
                        borderRight: '1px solid #ddd',
                        padding: '10px',
                        backgroundColor: '#f7f7f7',
                    }}
                >
                    <h2 style={{ margin: 0, marginBottom: '20px', color: '#333' }}>Chats</h2>
                    <ul style={{ listStyleType: 'none', padding: 0, margin: 0 }}>
                        {pastChats.map((chat) => {
                            // Filter out the logged-in user's name from the member list
                            const otherMembers = chat.members.filter(
                                (member) => member.userId !== userId
                            );

                            return (
                                <li
                                    key={chat.url}
                                    style={{
                                        cursor: 'pointer',
                                        padding: '15px',
                                        marginBottom: '10px',
                                        backgroundColor: '#fff',
                                        borderRadius: '10px',
                                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                                        transition: 'background-color 0.3s ease',
                                    }}
                                    onClick={() => handleChannelClick(chat.url)}
                                >
                                    <div
                                        style={{
                                            fontWeight: 'bold',
                                            marginBottom: '5px',
                                            color: '#333',
                                        }}
                                    >
                                        {/* Display the names of other members only */}
                                        Chat with: {otherMembers.map((member) => member.nickname).join(", ")}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#777' }}>
                                        Last message: {chat.lastMessage?.message || 'No messages yet'}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                </div>

                {/* Main chat area */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Channel channelUrl={currentChannelUrl || ''} />
                </div>
            </div>
        </SendBirdProvider>
    );
}

export default ChatPage;
