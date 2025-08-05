import React, { useEffect, useState, useCallback } from 'react';
import api from './api';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [pendingUsers, setPendingUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState({ key: 'username', direction: 'asc' });

    const normalizeUser = (user) => ({
        ...user,
        username: user.username || '',
        email: user.email || '',
        roles: user.roles || []
    });

    const fetchUsers = useCallback(async () => {
        try {
            const [allUsersResponse, pendingResponse] = await Promise.all([
                api.get('/api/users?approved=true'),
                api.get('/api/users?approved=false')
            ]);

            const filteredUsers = allUsersResponse.data
                .filter(user => !user.roles.includes('SUPER_ADMIN'))
                .map(normalizeUser);

            const filteredPending = pendingResponse.data
                .filter(user => !user.roles.includes('SUPER_ADMIN'))
                .map(normalizeUser);

            setUsers(filteredUsers);
            setPendingUsers(filteredPending);
        } catch (error) {
            setError('Failed to load users. Please refresh the page.');
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    // Approve user without changing role
    const handleApprove = async (userId) => {
        try {
            await api.patch(`/api/users/${userId}/approve`, { approved: true });
            await fetchUsers();
            setSuccess('User approved successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Approval failed. Please try again.');
        }
    };

    const handleReject = async (userId) => {
        if (window.confirm('Are you sure you want to reject this user?')) {
            try {
                await api.delete(`/api/users/${userId}`);
                await fetchUsers();
                setSuccess('User rejected successfully');
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                setError(error.response?.data?.message || 'Rejection failed. Please try again.');
            }
        }
    };

    const handleDeleteUser = async (userId) => {
        if (window.confirm('Permanently delete this user account?')) {
            try {
                await api.delete(`/api/users/${userId}`);
                await fetchUsers();
                setSuccess('User deleted successfully');
                setTimeout(() => setSuccess(''), 3000);
            } catch (error) {
                setError(error.response?.data?.message || 'Deletion failed. Please try again.');
            }
        }
    };

    const handleRoleChange = async (userId, newRole) => {
        try {
            await api.put(`/api/users/${userId}/role`, { role: newRole });
            await fetchUsers();
            setSuccess('User role updated successfully');
            setTimeout(() => setSuccess(''), 3000);
        } catch (error) {
            setError(error.response?.data?.message || 'Role update failed. Please try again.');
        }
    };

    const handleSort = (key) => {
        let direction = 'asc';
        if (sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const sortedUsers = [...users].sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    const filteredPendingUsers = pendingUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredUsers = sortedUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="container mt-4 text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p>Loading user data...</p>
            </div>
        );
    }

    return (
        <div className="container">
            <h2 className="text-center mb-4">User Management</h2>

            {success && (
                <div className="alert alert-success alert-dismissible fade show">
                    {success}
                    <button
                        type="button"
                        className="btn-close"
                        onClick={() => setSuccess('')}
                        aria-label="Close"
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
                        aria-label="Close"
                    />
                </div>
            )}

            <div className="mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Pending Approvals Table */}
            <div className="card mb-4">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">
                        Pending Approvals
                        {filteredPendingUsers.length > 0 && (
                            <span className="badge bg-warning ms-2">
                                {filteredPendingUsers.length}
                            </span>
                        )}
                    </h4>
                </div>
                <div className="card-body">
                    {filteredPendingUsers.length > 0 ? (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle">
                                <thead>
                                    <tr>
                                        <th onClick={() => handleSort('id')}>
                                            ID {sortConfig.key === 'id' && (
                                                <i className={`bi bi-chevron-${sortConfig.direction === 'asc' ? 'up' : 'down'}`} />
                                            )}
                                        </th>
                                        <th onClick={() => handleSort('username')}>
                                            Username {sortConfig.key === 'username' && (
                                                <i className={`bi bi-chevron-${sortConfig.direction === 'asc' ? 'up' : 'down'}`} />
                                            )}
                                        </th>
                                        <th>Email</th>
                                        <th>Role</th> {/* Show role here */}
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredPendingUsers.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>{user.roles[0]}</td> {/* Role displayed, no edit */}
                                            <td>
                                                <div className="btn-group btn-group-sm" role="group">
                                                    <button
                                                        className="btn btn-success"
                                                        onClick={() => handleApprove(user.id)}
                                                        title="Approve User"
                                                    >
                                                        <i className="bi bi-check-lg" /> Approve
                                                    </button>
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => handleReject(user.id)}
                                                        title="Reject User"
                                                    >
                                                        <i className="bi bi-x-lg" /> Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="alert alert-info mb-0">
                            No pending user approvals found
                        </div>
                    )}
                </div>
            </div>

            {/* Registered Users Table */}
            <div className="card">
                <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                    <h4 className="mb-0">Registered Users</h4>
                    <button
                        className="btn btn-sm btn-light"
                        onClick={fetchUsers}
                        title="Refresh Data"
                    >
                        <i className="bi bi-arrow-clockwise" />
                    </button>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th onClick={() => handleSort('id')}>
                                        ID {sortConfig.key === 'id' && (
                                            <i className={`bi bi-chevron-${sortConfig.direction === 'asc' ? 'up' : 'down'}`} />
                                        )}
                                    </th>
                                    <th onClick={() => handleSort('username')}>
                                        Username {sortConfig.key === 'username' && (
                                            <i className={`bi bi-chevron-${sortConfig.direction === 'asc' ? 'up' : 'down'}`} />
                                        )}
                                    </th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map(user => (
                                        <tr key={user.id}>
                                            <td>{user.id}</td>
                                            <td>{user.username}</td>
                                            <td>{user.email}</td>
                                            <td>
                                                <select
                                                    value={user.roles[0]}
                                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                                    className="form-select form-select-sm"
                                                >
                                                    <option value="ADMIN">Admin</option>
                                                    <option value="DOCTOR">Doctor</option>
                                                    <option value="PATIENT">Patient</option>
                                                </select>
                                            </td>
                                            <td>
                                                <div className="btn-group btn-group-sm" role="group">
                                                    <button
                                                        className="btn btn-danger"
                                                        onClick={() => handleDeleteUser(user.id)}
                                                        title="Delete User"
                                                    >
                                                        <i className="bi bi-trash" /> Delete
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">
                                            <div className="alert alert-info mb-0">
                                                No registered users found
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
