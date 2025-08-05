import React, { useEffect, useState } from 'react'
import { listappointments } from './CommonUrl'
import { useNavigate } from 'react-router-dom'
import { getCurrentRole } from './Auth'
const Listappointments = () => {

    const [appointments, setAppointments] = useState([])
    const navigator2 = useNavigate();
    const role = getCurrentRole();

    useEffect(() => {
        listappointments()
            .then((response) => {
                setAppointments(response.data);
            })
            .catch((error) => {
                console.error('Error Fetching appointments', error);
            })
    }, [])
    function AddAppointmentPath() {
        navigator2('/add-appointment');
    }
    // const handleDelete = (id) => {
    //     if (window.confirm("Are you sure you want to delete this appointment?")) {
    //       api.delete(`/Aapi/${id}`)
    //         .then(() => setAppointments(appointments.filter(appt => appt.id !== id)))
    //         .catch((error) => console.error("Delete failed", error));
    //     }
    //   };

    return (
        <div className='container'>
            <h2>List Of Appointments</h2>
            {(role ==='SUPER_ADMIN' || role === 'ADMIN') &&
            (<button className='btn btn-primary mb-2' onClick={AddAppointmentPath}>Add Appointment</button>)}
            <table className='table table-striped table-bordered'>
                <thead>
                    <tr>
                        <th>Appointment id</th>
                        <th>Appointment Time</th>
                        <th>Doctor id</th>
                        <th>Patient id</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        appointments.map(
                            appointment =>
                                <tr key={appointment.id}>
                                    <td>{appointment.id}</td>
                                    <td>{appointment.appointmentTime}</td>
                                    <td>{appointment.doctorId || "N/A"}</td>
                                    <td>{appointment.patientId || "N/A"}</td>
                                    <td>
                                        {(role === 'SUPER_ADMIN' || role === 'ADMIN') && (
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => navigator2(`/edit-appointment/${appointment.id}`)}
                                            >
                                                Edit 
                                            </button>
                                        )}
                                        {role === 'SUPER_ADMIN' && (
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => navigator2(`/delete-appointment/${appointment.id}`)}
                                            >
                                                Delete
                                            </button>
                                        )}
                                    </td>


                                </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}

export default Listappointments