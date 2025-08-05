import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const HeaderComponent = ({ onLogout, role }) => {
    const navigate = useNavigate();

    const handleLogoutClick = () => {
        onLogout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="container-fluid">
                <Link className="navbar-brand" to="/">
                    Hospital Management
                </Link>
                <div className="collapse navbar-collapse">
                    <ul className="navbar-nav me-auto">
                        {role && (
                            <>
                                {/* Common navigation for all logged-in roles */}
                                
                                <li className="nav-item">
                                    <Link className="nav-link" to="/patient">
                                        Patients
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/doctors">
                                        Doctors
                                    </Link>
                                </li>
                                <li className="nav-item">
                                    <Link className="nav-link" to="/appointments">
                                        Appointments
                                    </Link>
                                </li>

                                {/* Medical Inventory - Super Admin only */}
                                {role === 'SUPER_ADMIN' && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/medical-inventory">
                                            Medical Inventory
                                        </Link>
                                    </li>
                                )}

                                {/* Prescriptions - Doctors and Admins */}
                                {(role === 'SUPER_ADMIN' || role === 'ADMIN' || role === 'DOCTOR' || role ==='PATIENT') && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/prescriptions">
                                            Prescriptions
                                        </Link>
                                    </li>
                                )}
                                {/* User Management - Super Admin only */}
                                {role === 'SUPER_ADMIN' && (
                                    <li className="nav-item">
                                        <Link className="nav-link" to="/users">
                                            Registered Users
                                        </Link>
                                    </li>
                                )}
                            </>
                        )}
                    </ul>

                    <ul className="navbar-nav ms-auto">
                        {role ? (
                            <>
                                <li className="nav-item nav-link text-white">Role: {role}</li>
                                <li className="nav-item">
                                    <button
                                        className="btn btn-outline-light"
                                        onClick={handleLogoutClick}
                                    >
                                        Logout
                                    </button>
                                </li>
                            </>
                        ) : (
                            <li className="nav-item">
                                <Link className="nav-link" to="/login">
                                    Login
                                </Link>
                            </li>
                        )}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default HeaderComponent;