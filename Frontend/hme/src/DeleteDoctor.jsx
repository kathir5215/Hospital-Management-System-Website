import React, { useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { deleteDoctor } from './CommonUrl';

const DeleteDoctor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isDeleted = useRef(false); // ✅ avoid multiple deletions

  useEffect(() => {
    if (isDeleted.current) return; // ✅ Prevent re-entry
    isDeleted.current = true;

    const confirmAndDelete = async () => {
      if (window.confirm('Are you sure you want to delete this doctor?')) {
        try {
          await deleteDoctor(id);
          navigate('/doctors')
        } catch (err) {
          alert('Failed to delete doctor');
        } finally {
          navigate('/doctors');
        }
      } else {
        navigate('/doctors');
      }
    };

    confirmAndDelete();
  }, [id, navigate]);

  return <div>Deleting doctor...</div>;
};

export default DeleteDoctor;
