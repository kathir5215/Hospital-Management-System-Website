import React, { useEffect, useState } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';

const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/api/prescriptions')
      .then((response) => setPrescriptions(response.data))
      .catch((error) => console.error('Error fetching prescriptions:', error));
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Prescription List</h3>
        <button className="btn btn-primary" onClick={() => navigate('/prescriptions/new')}>
          + New Prescription
        </button>
      </div>
      <table className="table table-bordered table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Doctor</th>
            <th>Patient</th>
            <th>Date</th>
            <th>Item Count</th>
          </tr>
        </thead>
        <tbody>
          {prescriptions.map((prescription) => (
            <tr key={prescription.id}>
              <td>{prescription.id}</td>
              <td>{prescription.doctor?.name}</td>
              <td>{prescription.patient?.firstName} {prescription.patient?.lastName}</td>
              <td>{new Date(prescription.createdAt).toLocaleDateString()}</td>
              <td>{prescription.items?.length}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PrescriptionList;

