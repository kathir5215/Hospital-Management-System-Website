import React, { useEffect, useState } from 'react';
import { listDoctors } from './CommonUrl';
import { useNavigate } from 'react-router-dom';
import { getCurrentRole } from './Auth';

const ListDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const role = getCurrentRole();

    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const response = await listDoctors();
                setDoctors(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
                setError('Failed to load doctors. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, []);

    if (loading) return <div className="container mt-4">Loading doctors...</div>;
    if (error) return <div className="container alert alert-danger mt-4">{error}</div>;

    return (
        <div className="container">
            <h2 className="text-center">List Of Doctors</h2>
            {(role ==='SUPER_ADMIN' || role === 'ADMIN') &&
            (<button
                className="btn btn-primary mb-4"
                onClick={() => navigate('/add-doctor')}
            >
                Add Doctor
            </button>)}

            <div className="table-responsive">
                {doctors.length > 0 ? (
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Doctor Id</th>
                                <th>Name</th>
                                <th>Phone</th>
                                <th>Gender</th>
                                <th>Available</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {doctors.map((doctor) => (
                                <tr key={doctor.id}>
                                    <td>{doctor.id}</td>
                                    <td>{doctor.name}</td>
                                    <td>{doctor.phone}</td>
                                    <td>{doctor.gender}</td>
                                    <td>{doctor.available}</td>
                                    <td>
                                        {(role === 'SUPER_ADMIN' || role === 'ADMIN') && (
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => navigate(`/edit-doctor/${doctor.id}`)}
                                            >
                                                Edit
                                            </button>
                                        )}
                                        {role === 'SUPER_ADMIN' && (
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => navigate(`/delete-doctor/${doctor.id}`)}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="alert alert-info">No doctors found</div>
                )}
            </div>
        </div>
    );
};

export default ListDoctors;
