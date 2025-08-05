import React, { useState, useEffect } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

const PatientMedications = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                const response = await api.get('/api/prescriptions/patient/1');
                setPrescriptions(response.data);
            } catch (err) {
                setError('Failed to load prescriptions');
                console.error('Error fetching prescriptions:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchPrescriptions();
    }, []);

    if (loading) return <div className="container text-center my-5">Loading medications...</div>;
    if (error) return <div className="container alert alert-danger">{error}</div>;

    return (
        <div className="container">
            <h2 className="my-4">My Medications</h2>
            
            {prescriptions.length === 0 ? (
                <div className="alert alert-info">No prescriptions found</div>
            ) : (
                prescriptions.map(prescription => (
                    <div key={prescription.id} className="card mb-4">
                        <div className="card-header bg-light">
                            <div className="d-flex justify-content-between align-items-center">
                                <h5 className="mb-0">
                                    Prescription from Dr. {prescription.doctor?.name || 'Unknown'} - 
                                    {new Date(prescription.createdAt).toLocaleDateString()}
                                </h5>
                                <span className="badge bg-primary">ID: {prescription.id}</span>
                            </div>
                            {prescription.notes && (
                                <div className="mt-2">
                                    <p className="mb-0 fst-italic">"{prescription.notes}"</p>
                                </div>
                            )}
                        </div>
                        <div className="card-body">
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead className="table-light">
                                        <tr>
                                            <th>#</th>
                                            <th>Medication</th>
                                            <th>Image</th>
                                            <th>Dosage</th>
                                            <th>Frequency</th>
                                            <th>Timing</th>
                                            <th>Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {prescription.items?.map((item, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{item.medicalItem?.name || 'Unknown'}</td>
                                                <td>
                                                    {item.medicalItem?.imagePath ? (
                                                        <img 
                                                            src={`/api/images/${item.medicalItem.imagePath}`}
                                                            alt={item.medicalItem.name}
                                                            style={{ 
                                                                width: '50px', 
                                                                height: '50px', 
                                                                objectFit: 'cover',
                                                                borderRadius: '4px'
                                                            }}
                                                            onError={(e) => {
                                                                e.target.src = '/placeholder-medication.png';
                                                                e.target.alt = 'Image not available';
                                                            }}
                                                        />
                                                    ) : (
                                                        <span className="text-muted">No image</span>
                                                    )}
                                                </td>
                                                <td>{item.dosage}</td>
                                                <td>{item.frequency}</td>
                                                <td>{item.timing}</td>
                                                <td>{item.duration}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default PatientMedications;