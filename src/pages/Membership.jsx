import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MembershipSelection = () => {
    const [tiers, setTiers] = useState([]);
    const [selectedTier, setSelectedTier] = useState(1); // Default to Free tier
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/membership-tiers')
            .then(response => {
                setTiers(response.data);
            })
            .catch(error => {
                console.error('Error fetching membership tiers:', error);
                setError('Failed to load membership tiers.');
            });
    }, []);

    const handleTierChange = (tierId) => {
        setSelectedTier(tierId);
    };

    const handleSubmit = () => {
        const token = localStorage.getItem('token');
        axios.post('http://localhost:5000/users/select-membership', {
            membership_tier_id: selectedTier
        }, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(() => {
            alert('Membership updated successfully!');
            navigate('/dashboard');  // Redirect to dashboard after selecting tier
        })
        .catch(error => {
            console.error('Error updating membership:', error);
            setError('Failed to update membership.');
        });
    };

    return (
        <div className="container mt-5" style={{ maxWidth: '600px', textAlign: 'center' }}>
            <h2 style={{ color: '#ff6b6b', fontWeight: 'bold', marginBottom: '20px' }}>Select Your Membership Tier</h2>
            {error && <p className="text-danger">{error}</p>}

            <div className="tiers-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {tiers.map(tier => (
                    <div 
                        key={tier.id} 
                        onClick={() => handleTierChange(tier.id)}
                        style={{
                            border: selectedTier === tier.id ? '3px solid #ff6b6b' : '1px solid #ddd',
                            borderRadius: '20px',
                            padding: '20px',
                            boxShadow: selectedTier === tier.id ? '0 8px 16px rgba(255, 107, 107, 0.2)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease',
                            backgroundColor: selectedTier === tier.id ? '#fff0f0' : '#ffffff',
                        }}
                    >
                        <h4 style={{ color: '#333', fontWeight: 'bold', marginBottom: '10px' }}>
                            {tier.name} - ${tier.price}
                        </h4>
                        <p style={{ color: '#555', fontSize: '0.95rem', marginBottom: '15px' }}>{tier.description}</p>
                        <button
                            className="btn"
                            style={{
                                backgroundColor: selectedTier === tier.id ? '#ff6b6b' : 'transparent',
                                color: selectedTier === tier.id ? '#fff' : '#ff6b6b',
                                border: selectedTier === tier.id ? 'none' : '2px solid #ff6b6b',
                                borderRadius: '30px',
                                padding: '8px 16px',
                                fontWeight: 'bold',
                                transition: 'background-color 0.3s ease, color 0.3s ease',
                            }}
                        >
                            {selectedTier === tier.id ? 'Selected' : `Select ${tier.name}`}
                        </button>
                    </div>
                ))}
            </div>

            <button 
                className="btn mt-4"
                onClick={handleSubmit}
                style={{
                    backgroundColor: '#ff6b6b',
                    color: '#fff',
                    fontWeight: 'bold',
                    padding: '12px 20px',
                    borderRadius: '30px',
                    boxShadow: '0 6px 12px rgba(255, 107, 107, 0.3)',
                    border: 'none',
                    transition: 'transform 0.2s',
                }}
                onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.98)'}
                onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
                Confirm Membership
            </button>
        </div>
    );
};

export default MembershipSelection;
