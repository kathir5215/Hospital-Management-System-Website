import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './Login';
import ListPatients from './ListPatients';
import AddPatientComponent from './AddPatientComponent';
import 'bootstrap/dist/css/bootstrap.min.css';

import ListDoctors from './ListDoctors';
import AddDoctorComponent from './AddDoctorComponent';

import Listappointments from './Listappointments';
import AddAppointmentComponent from './AddAppointmentComponent';

import ProtectedRoute from './ProtectedRoute';
import HeaderComponent from './HeaderComponent';
import DeletePatient from './DeletePatient';
import DeleteAppointment from './DeleteAppointment';
import EditPatient from './EditPatient';
import EditDoctor from './EditDoctors';
import DeleteDoctor from './DeleteDoctor';
import EditAppointment from './EditAppointment';
import RoleCheck from './RoleCheck';
import UserManagement from './UserManagement';
import Signup from './Signup';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import MedicalInventory from './MedicalInventory';
import PrescriptionForm from './PrescriptionForm';
import PatientMedications from './PatientMedications';
import PrescriptionView from './PrescriptionView';
import PrescriptionList from './PrescriptionList'; // Add this import

function App() {
  const [, setToken] = useState(localStorage.getItem('token'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  const handleLogin = (token, role) => {
    setToken(token);
    setRole(role);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setToken(null);
    setRole(null);
  };

  return (
    <BrowserRouter>
      <HeaderComponent onLogout={handleLogout} role={role} />
      <Routes>
        {/* Public routes */}
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/rolecheck" element={<RoleCheck />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        <Route path="/" element={<Navigate to="/patient" replace />} />

        {/* Common authenticated routes */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'DOCTOR']} />}>
          <Route path="/doctors" element={<ListDoctors />} />
          <Route path="/appointments" element={<Listappointments />} />
        </Route>

        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'DOCTOR', 'PATIENT']} />}>
          <Route path="/patient" element={<ListPatients />} />
        </Route>

        {/* Admin/Super Admin routes */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN']} />}>
          <Route path="/add-patient" element={<AddPatientComponent />} />
          <Route path="/add-doctor" element={<AddDoctorComponent />} />
          <Route path="/add-appointment" element={<AddAppointmentComponent />} />
          <Route path="/edit-patient/:id" element={<EditPatient />} />
          <Route path="/edit-doctor/:id" element={<EditDoctor />} />
          <Route path="/edit-appointment/:id" element={<EditAppointment />} />
        </Route>

        {/* Super Admin only routes */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN']} />}>
          <Route path="/users" element={<UserManagement />} />
          <Route path="/delete-patient/:id" element={<DeletePatient />} />
          <Route path="/delete-doctor/:id" element={<DeleteDoctor />} />
          <Route path="/delete-appointment/:id" element={<DeleteAppointment />} />
          <Route path="/medical-inventory" element={<MedicalInventory />} />
        </Route>

        {/* Prescription routes */}
        <Route element={<ProtectedRoute allowedRoles={['SUPER_ADMIN', 'ADMIN', 'DOCTOR','PATIENT']} />}>
          <Route path="/prescriptions" element={<PrescriptionForm />} />
        </Route>
        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;