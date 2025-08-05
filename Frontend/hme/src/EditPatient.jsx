import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from './api';

const EditPatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [patient, setPatient] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    gender: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/Papi/${id}`)
      .then(res => setPatient(res.data))
      .catch(() => setError('Failed to fetch patient details'));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPatient(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.put(`/Papi/${id}`, patient)
      .then(() => navigate('/patients'))
      .catch(() => setError('Failed to update patient'));
  };

  return (
    <div className="container">
      <h2>Edit Patient</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label>First Name</label>
          <input type="text" name="firstName" value={patient.firstName} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Last Name</label>
          <input type="text" name="lastName" value={patient.lastName} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Phone</label>
          <input type="text" name="phone" value={patient.phone} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Address</label>
          <input type="text" name="address" value={patient.address} onChange={handleChange} className="form-control" required />
        </div>
        <div className="mb-3">
          <label>Gender</label>
          <select name="gender" value={patient.gender} onChange={handleChange} className="form-control" required>
            <option value="">Select</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <button type="submit" className="btn btn-primary">Update Patient</button>
      </form>
    </div>
  );
};

export default EditPatient;
