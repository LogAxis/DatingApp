import React, { useState } from 'react';
import axios from 'axios';

const RequestPasswordReset = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:5000/request-password-reset', { email });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error occurred');
        }
    };

    return (
        <div>
            <h2>Request Password Reset</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <button type="submit">Send Reset Link</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default RequestPasswordReset;
