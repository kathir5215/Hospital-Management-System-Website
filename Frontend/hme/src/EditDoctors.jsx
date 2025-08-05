import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from './api';

const EditDoctor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [doctor, setDoctor] = useState({
        name: '',
        phone: '',
        gender: '',
        available: ''
    });
    const [error, setError] = useState('');

    useEffect(() => {
        api.get(`/Dapi/${id}`)
            .then(res => setDoctor(res.data))
            .catch(() => setError('Failed to fetch doctor details'));
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDoctor(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        api.put(`/Dapi/${id}`, doctor)
            .then(() => navigate('/doctors'))
            .catch(() => setError('Failed to update doctor'));
    };

    return (
        <div className="container">
            <h2>Edit Doctor</h2>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label>Name</label>
                    <input type="text" name="name" value={doctor.name} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                    <label>Phone</label>
                    <input type="text" name="phone" value={doctor.phone} onChange={handleChange} className="form-control" required />
                </div>
                <div className="mb-3">
                    <label>Gender</label>
                    <select name="gender" value={doctor.gender} onChange={handleChange} className="form-control" required>
                        <option value="">Select</option>
                        <option value="MALE">Male</option>
                        <option value="FEMALE">Female</option>
                        <option value="OTHER">Other</option>
                    </select>
                </div>
                <div className="mb-3">
                    <label>Available</label>
                    <select name="available" value={doctor.available} onChange={handleChange} className="form-control" required>
                        <option value="">Select</option>
                        <option value="Yes">Yes</option>
                        <option value="No">No</option>
                    </select>
                </div>
                <button type="submit" className="btn btn-primary">Update Doctor</button>
            </form>
        </div>
    );
};

export default EditDoctor;
