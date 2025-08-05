import React, { useState } from 'react'
import { createPatients } from './CommonUrl'
import { useNavigate } from 'react-router-dom'

const AddPatientComponent = () => {
  const navigate = useNavigate()

  const [patient, setPatient] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    gender: ''
  });
  const [error, setError] = useState({})
  const HandleChanges = (e) => {
    const { name, value } = e.target
    setPatient(prev => ({
      ...prev, [name]: value

    }));
  }
  function savePatient(e) {
    e.preventDefault();
    if (validate()) {
      console.log("Submitting: ", patient);
      createPatients(patient)
        .then((response) => {
          console.log(response.data);
          navigate('/patient');

        })
        .catch(error =>
          console.error('Failed', error))
    }
  }
  const validate = () => {
    let throwable = {};
    if (!patient.firstName.trim()) throwable.firstName = "FirstName must not be empty";
    if (!patient.lastName.trim()) throwable.lastName = "LastName must not be empty";
    if (!patient.phone.trim()) throwable.phone = "Phone no must not be empty";
    if (!patient.address.trim()) throwable.address = "Address must not be empty";
    if (!patient.gender.trim()) throwable.gender = "Gender must not be empty";
    setError(throwable);
    return Object.keys(throwable).length === 0;
  }
  return (
    <div className='container'>
      <div className='row'>
        <div className='card col-md-6 offset-md-3 offset-md-3'>
          <h2 className='text-center'>Add Patient</h2>
          <div className='card-body'>
            <form onSubmit={savePatient}>
              <div className='form-group b-2'>
                <label className='form-label'>FirstName:</label>
                <input type="text" placeholder='Enter the FirstName'
                  name='firstName'
                  value={patient.firstName}
                  className={`form-control ${error.firstName ? 'is-invalid' : ''}`}
                  onChange={HandleChanges} />
                {error.firstName && <div className='text-danger'>{error.firstName}</div>}

                <label className='form-label'>lastName:</label>
                <input type="text" placeholder='Enter the LastName'
                  name='lastName'
                  value={patient.lastName}
                  className={`form-control ${error.lastName ? 'is-invalid' : ''}`}
                  onChange={HandleChanges} />
                {error.lastName && <div className='text-danger'>{error.lastName}</div>}

                <label className='form-label'>Phone no:</label>
                <input type="number" placeholder='Enter the Phone no'
                  name='phone'
                  value={patient.phone}
                  className={`form-control ${error.phone ? 'is-invalid' : ''}`}
                  onChange={HandleChanges} />
                {error.phone && <div className='text-danger'>{error.phone}</div>}

                <label className='form-label'>Address:</label>
                <input type="text" placeholder='Enter the Address'
                  name='address'
                  value={patient.address}
                  className={`form-control ${error.address ? 'is-invalid' : ''}`}
                  onChange={HandleChanges} />
                {error.address && <div className='text-danger'>{error.address}</div>}

                <label className='form-label'>Gender:</label>
                <input type="text" placeholder='Enter the Gender'
                  name='gender'
                  value={patient.gender}
                  className={`form-control ${error.gender ? 'is-invalid' : ''}`}
                  onChange={HandleChanges} />
                {error.gender && <div className='text-danger'>{error.gender}</div>}

              </div>
              <button className='btn btn-success' type='submit'> Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddPatientComponent