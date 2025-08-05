import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from './api';
import { listDoctors, listPatients } from './CommonUrl';
const EditAppointment = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [appointment, setAppointment] = useState({
        appointmentTime: '',
        doctorId: '',
        patientId: '',
    });
    const [doctors, setDoctors] = useState([]);
    const [patients, setPatients] = useState([]);
    const [error, setError] = useState('');

    useEffect(() => {
        // Fetch doctors and patients
        listDoctors()
            .then(res => setDoctors(res.data))
            .catch(() => setDoctors([]));

        listPatients()
            .then(res => setPatients(res.data))
            .catch(() => setPatients([]));

        // Fetch appointment details
        api.get(`/Aapi/${id}`)  // Changed from /Aapi to /appointments (verify correct endpoint)
            .then(res => {
                setAppointment({
                    appointmentTime: res.data.appointmentTime,
                    doctorId: res.data.doctor?.id || res.data.doctorId, // Handle both nested and flat structures
                    patientId: res.data.patient?.id || res.data.patientId,
                });
            })
            .catch(err => {
                console.error('Error fetching appointment:', err); // Add this for debugging
                setError('Failed to fetch appointment details');
            });
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointment(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        api.put(`/Aapi/${id}`, appointment)
            .then(() => {
                // Optional: show success message
                navigate('/appointments'); // Redirect to appointments list
            })
            .catch((error) => {
                console.error('Update error:', error);
                setError('Failed to update appointment');
            });
    };

    return (
        <div className="container">
            <h2>Edit Appointment</h2>
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Appointment Time</label>
                    <input
                        type="datetime-local"
                        name="appointmentTime"
                        value={appointment.appointmentTime}
                        onChange={handleChange}
                        className="form-control"
                        required
                    />
                </div>

                <div className="mb-3">
                    <label>Doctor</label>
                    <select
                        name="doctorId"
                        value={appointment.doctorId}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        <option value="">Select Doctor</option>
                        {doctors
                            .filter(doctor => doctor.available === 'Yes')
                            .map(doc => (
                                <option key={doc.id} value={doc.id}>
                                    {doc.name} (Available)
                                </option>
                            ))}
                        {doctors
                            .filter(doctor => doctor.available !== 'Yes')
                            .map(doc => (
                                <option key={doc.id} value={doc.id} disabled>
                                    {doc.name} (Not Available)
                                </option>
                            ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label>Patient</label>
                    <select
                        name="patientId"
                        value={appointment.patientId}
                        onChange={handleChange}
                        className="form-select"
                        required
                    >
                        <option value="">Select Patient</option>
                        {patients.map(pat => (
                            <option key={pat.id} value={pat.id}>{pat.firstName} {pat.lastName}</option>
                        ))}
                    </select>
                </div>

                <button type="submit" className="btn btn-primary">Update Appointment</button>
            </form>
        </div>
    );
};

export default EditAppointment;
