import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import api from './api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Basic email validation
        if (!email || !email.includes('@')) {
            setError('Please enter a valid email address');
            return;
        }

        setIsLoading(true);
        setError('');
        setMessage('');
        
        try {
            const response = await api.post('/api/forgot-password', { email });
            
            if (response.data && response.data.message) {
                setMessage(response.data.message);
            } else {
                setMessage('Password reset link sent to your email');
            }
        } catch (err) {
            console.error('Error:', err); // Debug log
            console.error('Error response:', err.response); // Debug log
            
            const errorMessage = err.response?.data?.message 
                || err.response?.data?.error
                || err.message
                || 'Failed to send reset link. Please try again later.';
            
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6 col-lg-4">
                    <div className="card shadow">
                        <div className="card-body p-4">
                            <h3 className="card-title text-center mb-4">Forgot Password</h3>
                            
                            {message && (
                                <div className="alert alert-success alert-dismissible fade show">
                                    {message}
                                    <button 
                                        type="button" 
                                        className="btn-close" 
                                        onClick={() => setMessage('')}
                                    />
                                </div>
                            )}
                            
                            {error && (
                                <div className="alert alert-danger alert-dismissible fade show">
                                    {error}
                                    <button 
                                        type="button" 
                                        className="btn-close" 
                                        onClick={() => setError('')}
                                    />
                                </div>
                            )}
                            
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                
                                <button 
                                    type="submit" 
                                    className="btn btn-primary w-100 py-2"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                            Sending...
                                        </>
                                    ) : 'Send Reset Link'}
                                </button>
                            </form>
                            
                            <div className="mt-3 text-center">
                                <Link to="/login" className="text-decoration-none">
                                    <i className="bi bi-arrow-left me-1"></i> Back to Login
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;