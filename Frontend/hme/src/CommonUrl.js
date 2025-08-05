import api from './api';

export const listPatients = () => api.get('/Papi/patient');
export const createPatients = (patient) => api.post('/Papi/patient', patient);
export const deletePatient = (id) => api.delete(`/Papi/${id}`);

export const listDoctors = () => api.get('/Dapi/doctor');
export const createDoctors = (doctor) => api.post('/Dapi/doctor', doctor);
export const deleteDoctor = (id) => api.delete(`/Dapi/${id}`);

export const listappointments = () => api.get('/Aapi/appointments');
export const createAppointments = (appointment) => api.post('/Aapi/appointments', appointment);
export const deleteAppointment = (id) => api.delete(`/Aapi/${id}`);

export const listMedicalItems = () => api.get('/Mapi/medical-items');
export const listPrescriptions = () => api.get('/api/prescriptions');
export const getPrescription = (id) => api.get(`/api/prescriptions/${id}`);
export const createPrescription = (prescription) => api.post('/api/prescriptions', prescription);
export const updatePrescription = (id, prescription) => api.put(`/api/prescriptions/${id}`, prescription);
export const deletePrescription = (id) => api.delete(`/api/prescriptions/${id}`);

// CommonUrl.js
export const listPrescriptionItems = (prescriptionId) => 
    api.get(`/api/prescription-items/prescription/${prescriptionId}`);
  
  export const getPrescriptionItem = (id) => 
    api.get(`/api/prescription-items/${id}`);
  
  export const createPrescriptionItem = (data) => 
    api.post('/api/prescription-items', data);
  
  export const updatePrescriptionItem = (id, data) => 
    api.put(`/api/prescription-items/${id}`, data);
  
  export const deletePrescriptionItem = (id) => 
    api.delete(`/api/prescription-items/${id}`);