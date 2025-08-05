import React, { useState, useEffect } from 'react';
import api from './api';
import { useParams, useNavigate } from 'react-router-dom';

const PrescriptionView = () => {
    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPrescription = async () => {
            try {
                const response = await api.get(`/api/prescriptions/${id}`);
                setPrescription(response.data);
            } catch (err) {
                console.error('Failed to fetch prescription:', err);
                setError('Failed to load prescription details');
            } finally {
                setLoading(false);
            }
        };
        fetchPrescription();
    }, [id]);

    if (loading) {
        return <div className="container text-center my-5">Loading prescription...</div>;
    }

    if (error) {
        return (
            <div className="container">
                <div className="alert alert-danger">{error}</div>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    Go Back
                </button>
            </div>
        );
    }

    if (!prescription) {
        return <div className="container text-center my-5">Prescription not found</div>;
    }

    return (
        <div className="container">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Prescription Details</h2>
                <button className="btn btn-secondary" onClick={() => navigate(-1)}>
                    Back to List
                </button>
            </div>

            <div className="card mb-4">
                <div className="card-header">
                    <h4>Basic Information</h4>
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>Prescription ID:</strong> {prescription.id}</p>
                            <p><strong>Date:</strong> {new Date(prescription.createdAt).toLocaleDateString()}</p>
                            <p><strong>Doctor:</strong> {prescription.doctor?.name || 'N/A'}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Patient:</strong> {prescription.patient?.firstName} {prescription.patient?.lastName}</p>
                            <p><strong>Patient ID:</strong> {prescription.patient?.id}</p>
                        </div>
                    </div>
                    {prescription.notes && (
                        <div className="mt-3">
                            <h5>Notes:</h5>
                            <p className="text-muted">{prescription.notes}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="card">
                <div className="card-header">
                    <h4>Medications</h4>
                </div>
                <div className="card-body">
                    <div className="table-responsive">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Medication</th>
                                    <th>Quantity</th>
                                    <th>Dosage</th>
                                    <th>Frequency</th>
                                    <th>Timing</th>
                                    <th>Duration</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prescription.items?.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.medicalItem?.name || 'Unknown'}</td>
                                        <td>{item.quantity}</td>
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
        </div>
    );
};

export default PrescriptionView;