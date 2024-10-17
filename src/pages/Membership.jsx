import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MembershipSelection = () => {
    const [tiers, setTiers] = useState([]);
    const [selectedTier, setSelectedTier] = useState(1); // Default to Free tier
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch available membership tiers
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
        <div className="container mt-5">
            <h2>Select Your Membership Tier</h2>
            {error && <p className="text-danger">{error}</p>}
            <div className="tiers-list">
                {tiers.map(tier => (
                    <div key={tier.id} className="tier-option">
                        <h4>{tier.name} - ${tier.price}</h4>
                        <p>{tier.description}</p>
                        <button
                            className={`btn ${selectedTier === tier.id ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => handleTierChange(tier.id)}
                        >
                            Select {tier.name}
                        </button>
                    </div>
                ))}
            </div>
            <button className="btn btn-success mt-3" onClick={handleSubmit}>Confirm Membership</button>
        </div>
    );
};

export default MembershipSelection;
