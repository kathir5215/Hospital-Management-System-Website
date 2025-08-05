import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteAppointment } from './CommonUrl';

const DeleteAppointment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isDeleted = useRef(false); // Prevent multiple deletions

  useEffect(() => {
    if (isDeleted.current) return; // Prevent re-entry
    isDeleted.current = true;

    const confirmAndDelete = async () => {
      if (window.confirm('Are you sure you want to delete this appointment?')) {
        try {
          await deleteAppointment(id);
          navigate('/appointments');
        } catch (err) {
          alert('Failed to delete appointment');
          navigate('/appointments');
        }
      } else {
        navigate('/appointments');
      }
    };

    confirmAndDelete();
  }, [id, navigate]);

  return <div>Deleting appointment...</div>;
};

export default DeleteAppointment;
