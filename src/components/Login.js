import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Login({ setIsLoggedIn }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();

        try {
            const response = await axios.post(
                'https://budget-management-system-1fqb.onrender.com/login/',
                { username, password }
            );

            const authToken = response.data.access;
            const refreshToken = response.data.refresh;

            localStorage.setItem('authToken', authToken);
            localStorage.setItem('refreshToken', refreshToken);

            setIsLoggedIn(true);

            const userInfoResponse = await axios.get(
                'https://budget-management-system-1fqb.onrender.com/transaction/user/',
                {
                    headers: {
                        Authorization: `Bearer ${authToken}`,
                    },
                }
            );

            const userName = userInfoResponse.data.username;
            localStorage.setItem('username', userName);

            setMessage('Login successful!');
            navigate('/home');
        } catch (error) {
            console.error('Login error:', error);
            setMessage('Login failed. Please check your credentials.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h1 className="text-center">Welcome Back!</h1>
                <p className="text-center text-muted">Login to manage your personal budget</p>
                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            id="username"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary btn-block mt-3">Login</button>
                </form>
                {message && (
                    <div id="login-message" className="mt-3 text-center">
                        <p className={message.includes('successful') ? 'text-success' : 'text-danger'}>
                            {message}
                        </p>
                    </div>
                )}
                <div className="mt-4 text-center">
                    <p className="text-muted">Don't have an account?</p>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate('/register')}
                    >
                        Create New Account
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Login;
