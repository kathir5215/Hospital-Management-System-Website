import React, { useEffect, useState } from 'react';
import { listPatients } from './CommonUrl';
import { useNavigate } from 'react-router-dom';
import { getCurrentRole } from './Auth';


const ListPatients = () => {
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
   

    const role = getCurrentRole();

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await listPatients();
                setPatients(response.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
                setError('Failed to load patients. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchPatients();
    }, []);

    if (loading) return <div className="container mt-4">Loading patients...</div>;
    if (error) return <div className="container alert alert-danger mt-4">{error}</div>;

    return (
        <div className="container">
            <h2 className="text-center">List Of Patients</h2>
            {(role ==='SUPER_ADMIN' || role === 'ADMIN') && (<button
                className="btn btn-primary mb-4"
                onClick={() => navigate('/add-patient')}
            >
                Add Patient
            </button>)}

            <div className="table-responsive">
                {patients.length > 0 ? (
                    <table className="table table-striped table-bordered">
                        <thead>
                            <tr>
                                <th>Patient Id</th>
                                <th>First Name</th>
                                <th>Last Name</th>
                                <th>Phone No</th>
                                <th>Address</th>
                                <th>Gender</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((patient) => (
                                <tr key={patient.id}>
                                    <td>{patient.id}</td>
                                    <td>{patient.firstName}</td>
                                    <td>{patient.lastName}</td>
                                    <td>{patient.phone}</td>
                                    <td>{patient.address}</td>
                                    <td>{patient.gender}</td>
                                    <td>
                                        {(role === 'SUPER_ADMIN' || role === 'ADMIN') && (
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => navigate(`/edit-patient/${patient.id}`)}
                                            >
                                                Edit
                                            </button>
                                        )}
                                        {role === 'SUPER_ADMIN' && (
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => navigate(`/delete-patient/${patient.id}`)}
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
                    <div className="alert alert-info">No patients found</div>
                )}
            </div>
        </div>
    );
};

export default ListPatients;
