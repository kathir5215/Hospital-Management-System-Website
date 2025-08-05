// src/components/Signup.js
import React, { useState } from "react";
import api from "./api";

const Signup = () => {
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        role: 'ADMIN' // Default role
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.password !== confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        try {
            const response = await api.post('/api/register', form);
            setSuccess('Registration successful! Waiting for admin approval.');
            setError('');
            // Clear form after successful submission
            setForm({
                username: '',
                email: '',
                password: '',
                role: ''
            });
            setConfirmPassword('');
        } catch (error) {
            console.error('Registration error:', error);
            setSuccess('');
            if (error.response) {
                setError(error.response.data.message || 
                        error.response.data || 
                        'Registration failed');
            } else {
                setError('Registration failed. Please try again later.');
            }
        }
    };
    

    return (
        <div className="container mt-5" style={{ maxWidth: '500px' }}>
            <div className="card shadow">
                <div className="card-body">
                    <h2 className="text-center mb-4">Create Account</h2>
                    
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
                    
                    {success && (
                        <div className="alert alert-success alert-dismissible fade show">
                            {success}
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={() => setSuccess('')}
                            />
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Username*</label>
                            <input 
                                className="form-control"
                                type="text"
                                value={form.username}
                                onChange={(e) => setForm({...form, username: e.target.value})}
                                required
                                minLength="3"
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Email*</label>
                            <input 
                                className="form-control"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({...form, email: e.target.value})}
                                required
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Password* (min 8 characters)</label>
                            <input 
                                className="form-control"
                                type="password"
                                value={form.password}
                                onChange={(e) => setForm({...form, password: e.target.value})}
                                required
                                minLength="8"
                            />
                        </div>
                        
                        <div className="mb-3">
                            <label className="form-label">Confirm Password*</label>
                            <input 
                                className="form-control"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        
                        <div className="mb-4">
                            <label className="form-label">Account Type*</label>
                            <select
                                className="form-select"
                                value={form.role}
                                onChange={(e) => setForm({...form, role: e.target.value})}
                                required
                            >
                                <option value="ADMIN">Admin</option>
                                <option value="DOCTOR">Doctor</option>
                                <option value="PATIENT">Patient</option>
                            </select>
                            <small className="text-muted">
                                {form.role} accounts require super admin approval
                            </small>
                        </div>
                        
                        <div className="d-grid gap-2">
                            <button type="submit" className="btn btn-primary">
                                Register
                            </button>
                        </div>
                    </form>
                    
                    <div className="mt-3 text-center">
                        Already have an account?{' '}
                        <a href="/login" className="text-decoration-none">
                            Login here
                        </a>
                    </div>
                </div>
            </div>
            
        </div>
    );
};

export default Signup;