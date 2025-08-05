import React, { useState } from 'react'
import { createDoctors } from './CommonUrl'
import { useNavigate } from 'react-router-dom'

const AddDoctorComponent = () => {


    const navigate = useNavigate();

    const [doctor, setDoctor] = useState({
        name: '',
        phone: '',
        gender: '',
        available: ''
    });
    const [errors, setErrors] = useState({});
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setDoctor(prev => ({
            ...prev,
            [name]: value
        }));
    }
    function saveDoctor(e) {
        e.preventDefault();

        if (validate()) {
            console.log("Submitting: ", doctor);
            createDoctors(doctor)
                .then(response => {
                    console.log(response.data);
                    navigate('/doctors');
                })
                .catch(error => console.error('Save failed', error));
        }
    }


    const validate = () => {
        let tempErrors = {};

        if (!doctor.name.trim()) tempErrors.name = "Name must not be empty";
        if (!doctor.phone.trim()) tempErrors.phone = "Phone No must not be empty";
        if (!doctor.gender.trim()) tempErrors.gender = "Gender must not be empty";
        if (!doctor.available.trim()) tempErrors.available = "Available must not be empty";

        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    return (
        <div className='container'>
            <div className='row'>
                <div className='card col-md-6 offset-md-3 offset-md-3'>
                    <h2 className='text-center'>Add Doctor</h2>
                    <div className='card-body'>
                        <form onSubmit={saveDoctor}>
                            <div className="form-group">
                                <label className="form-label">Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={doctor.name}
                                    onChange={handleInputChange}
                                    className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                                    placeholder="Enter Name"
                                />
                                {errors.name && <div className="text-danger">{errors.name}</div>}

                                <label className="form-label">Phone no:</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={doctor.phone}
                                    onChange={handleInputChange}
                                    className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                                    placeholder="Enter Phone No"
                                />
                                {errors.phone && <div className="text-danger">{errors.phone}</div>}

                                <label className="form-label">Gender:</label>
                                <input
                                    type="text"
                                    name="gender"
                                    value={doctor.gender}
                                    onChange={handleInputChange}
                                    className={`form-control ${errors.gender ? 'is-invalid' : ''}`}
                                    placeholder="Enter Gender"
                                />
                                {errors.gender && <div className="text-danger">{errors.gender}</div>}

                                <label className="form-label">Available:</label>
                                <input
                                    type="text"
                                    name="available"
                                    value={doctor.available}
                                    onChange={handleInputChange}
                                    className={`form-control ${errors.available ? 'is-invalid' : ''}`}
                                    placeholder="Enter Available"
                                />
                                {errors.available && <div className="text-danger">{errors.available}</div>}
                            </div>

                            <button type="submit" className="btn btn-success mt-3">Submit</button>
                        </form>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddDoctorComponent