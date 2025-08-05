import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from './api';

const Login = ({ onLogin }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Redirect away if already logged in
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            navigate('/patient', { replace: true });
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await api.post('/api/login', { username, password });

            if (response.data.token) {
                // Store token and role (first one assumed)
                localStorage.setItem('token', response.data.token);
                localStorage.setItem('role', response.data.roles[0].toUpperCase());


                if (onLogin) {
                    onLogin(response.data.token, response.data.roles[0]);
                }

                // Navigate to default page after login
                navigate('/patient', { replace: true });
            } else {
                setError("Invalid response format from server.");
            }
        } catch (error) {
            if (error.response?.status === 403) {
                setError('Your account is not yet approved. Please contact administrator.');
            } else {
                setError(error.response?.data?.message || 'Login failed. Please check your credentials.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/forgot-password', { email });
            setError('Password reset link sent to your email');
        } catch (error) {
            setError(error.response?.data?.message || 'Failed to send reset link');
        }
    };

    return (
        <div className="container mt-5 d-flex justify-content-center">
            <div className="card p-4 shadow" style={{ width: '100%', maxWidth: '400px' }}>
                {!showForgotPassword ? (
                    <form onSubmit={handleLogin}>
                        <h3 className="text-center mb-4">Login</h3>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <div className="mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <input
                                type="password"
                                className="form-control"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="d-grid mb-2">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </div>
                        <p className="text-center text-primary" role="button" onClick={() => setShowForgotPassword(true)}>
                            Forgot Password?
                        </p>
                        <div className="mt-3 text-center">
                            Don't have an account?{' '}
                            <Link to="/signup" className="text-decoration-none">Sign up here</Link>
                        </div>
                    </form>
                ) : (
                    <form onSubmit={handleForgotPassword}>
                        <h3 className="text-center mb-4">Reset Password</h3>
                        {error && <div className="alert alert-info">{error}</div>}
                        <div className="mb-3">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Your Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="d-grid mb-2">
                            <button type="submit" className="btn btn-warning">Send Reset Link</button>
                        </div>
                        <p className="text-center text-secondary" role="button" onClick={() => setShowForgotPassword(false)}>
                            Back to Login
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default Login;
