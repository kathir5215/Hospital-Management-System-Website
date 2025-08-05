import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deletePatient } from './CommonUrl';

const DeletePatient = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isDeleted = useRef(false);

  useEffect(() => {
    if (isDeleted.current) return;
    isDeleted.current = true;

    const confirmAndDelete = async () => {
      if (window.confirm('Are you sure you want to delete this patient?')) {
        try {
          await deletePatient(id);
          navigate('/patients')
        } catch (err) {
          alert('Failed to delete patient');
        } finally {
          navigate('/patients');
        }
      } else {
        navigate('/patients');
      }
    };

    confirmAndDelete();
  }, [id, navigate]);

  return <div>Deleting patient...</div>;
};

export default DeletePatient;
