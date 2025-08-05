import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    listDoctors,
    listPatients,
    listMedicalItems,
    getPrescription,
    createPrescription,
    updatePrescription,
    deletePrescription,
    listPrescriptions,
    listPrescriptionItems,
    createPrescriptionItem,
    updatePrescriptionItem,
    deletePrescriptionItem
} from './CommonUrl';
import { getCurrentRole } from './Auth';

const PrescriptionForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const role = getCurrentRole();
    const isEditMode = Boolean(id);
    const [viewMode, setViewMode] = useState(!id);
    const [showDetails, setShowDetails] = useState(false);
    const [currentPrescription, setCurrentPrescription] = useState(null);

    const [formData, setFormData] = useState({
        patientId: '',
        doctorId: '',
        notes: '',
        items: []
    });

    const [newItem, setNewItem] = useState({
        medicalItemId: '',
        quantity: 1,
        dosage: '1 tablet',
        frequency: 'morning',
        timing: 'after meal',
        duration: '7 days'
    });

    const [patients, setPatients] = useState([]);
    const [doctors, setDoctors] = useState([]);
    const [medicalItems, setMedicalItems] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch all data
    useEffect(() => {
        // In your fetchData function, replace the Promise.all with this:
        const fetchData = async () => {
            try {
                setIsLoading(true);
                setError('');

                // First fetch all the basic data we need
                const [medicalItemsRes, doctorsRes, patientsRes] = await Promise.all([
                    listMedicalItems(),
                    listDoctors(),
                    listPatients()
                ]);
                console.log(medicalItemsRes, "ajayyyyy")
                setMedicalItems(medicalItemsRes.data);
                setDoctors(doctorsRes.data);
                setPatients(patientsRes.data);

                if (viewMode) {
                    const prescriptionsRes = await listPrescriptions();
                    console.log('Raw Prescriptions:', prescriptionsRes.data); // Add this for debugging

                    // In your fetchData function, update the enhancement:
                    const enhancedPrescriptions = prescriptionsRes.data.map(prescription => {
                        // Get IDs from either direct fields or nested objects
                        const doctorId = prescription.doctorId || (prescription.doctor?.id);
                        const patientId = prescription.patientId || (prescription.patient?.id);

                        const doctor = doctorsRes.data.find(d => d.id === doctorId);
                        const patient = patientsRes.data.find(p => p.id === patientId);

                        return {
                            ...prescription,
                            doctorId: doctorId, // Ensure ID is always set
                            patientId: patientId, // Ensure ID is always set
                            doctor: doctor || { name: 'N/A' },
                            patient: patient || { firstName: 'N/A', lastName: '' }
                        };
                    });
                    setPrescriptions(enhancedPrescriptions);
                }

                if (isEditMode) {
                    const [prescriptionRes, itemsRes] = await Promise.all([
                        getPrescription(id),
                        listPrescriptionItems(id)
                    ]);

                    setFormData({
                        ...prescriptionRes.data,
                        items: itemsRes.data.map(item => ({
                            ...item,
                            medicalItemName: medicalItemsRes.data.find(m => m.id === item.medicalItemId)?.name || 'Unknown',
                            medicalItem: medicalItemsRes.data.find(m => m.id === item.medicalItemId)
                        }))
                    });
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load data');
                console.error('Fetch error:', err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [id, isEditMode, viewMode]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleItemChange = (e) => {
        const { name, value } = e.target;
        setNewItem(prev => ({ ...prev, [name]: value }));
    };

    const handleAddItem = async () => {
        setError('');

        if (!newItem.medicalItemId) {
            setError('Please select a medication');
            return;
        }

        const selectedItem = medicalItems.find(item => item.id == newItem.medicalItemId);
        if (!selectedItem) {
            setError('Selected medication not found');
            return;
        }

        // Calculate total quantity already in prescription for this item
        const existingQuantity = formData.items
            .filter(item => item.medicalItemId == newItem.medicalItemId)
            .reduce((sum, item) => sum + item.quantity, 0);

        // Check available stock
        if (selectedItem.currentStock < (existingQuantity + newItem.quantity)) {
            setError(`Insufficient stock. Only ${selectedItem.currentStock} available`);
            return;
        }

        try {
            if (isEditMode && formData.id) {
                const itemDto = {
                    medicalItemId: newItem.medicalItemId,
                    quantity: newItem.quantity,
                    dosage: newItem.dosage,
                    frequency: newItem.frequency,
                    timing: newItem.timing,
                    duration: newItem.duration,
                    prescriptionId: formData.id
                };

                const response = await createPrescriptionItem(itemDto);

                setFormData(prev => ({
                    ...prev,
                    items: [
                        ...prev.items,
                        {
                            ...response.data,
                            medicalItemName: selectedItem.name,
                            medicalItem: selectedItem
                        }
                    ]
                }));
            } else {
                setFormData(prev => ({
                    ...prev,
                    items: [
                        ...prev.items,
                        {
                            ...newItem,
                            medicalItemName: selectedItem.name,
                            medicalItem: selectedItem
                        }
                    ]
                }));
            }

            setNewItem({
                medicalItemId: '',
                quantity: 1,
                dosage: '1 tablet',
                frequency: 'morning',
                timing: 'after meal',
                duration: '7 days'
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to add medication');
        }
    };

    const handleRemoveItem = async (index, itemId) => {
        try {
            if (isEditMode && itemId) {
                await deletePrescriptionItem(itemId);
            }

            setFormData(prev => {
                const newItems = [...prev.items];
                newItems.splice(index, 1);
                return { ...prev, items: newItems };
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to remove medication');
        }
    };

    const handleUpdateItem = async (index, itemId) => {
        try {
            const itemToUpdate = formData.items[index];
            const itemDto = {
                medicalItemId: itemToUpdate.medicalItemId,
                quantity: itemToUpdate.quantity,
                dosage: itemToUpdate.dosage,
                frequency: itemToUpdate.frequency,
                timing: itemToUpdate.timing,
                duration: itemToUpdate.duration
            };

            const response = await updatePrescriptionItem(itemId, itemDto);

            setFormData(prev => {
                const newItems = [...prev.items];
                const matchedItem = medicalItems.find(i => Number(i.id) === Number(response.data.medicalItemId));

                newItems[index] = {
                    ...response.data,
                    medicalItemName: matchedItem ? matchedItem.name : 'Unknown'
                };

                return { ...prev, items: newItems };
            });

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update medication');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!formData.doctorId || !formData.patientId) {
            setError('Please select both doctor and patient');
            return;
        }

        // Ensure items array exists even if empty
        const items = formData.items || [];

        if (items.length === 0) {
            setError('Please add at least one medication');
            return;
        }

        try {
            let response;
            if (isEditMode) {
                response = await updatePrescription(id, {
                    ...formData,
                    items: items
                });
                setSuccess('Prescription updated successfully!');
            } else {
                response = await createPrescription({
                    ...formData,
                    items: items
                });
                setSuccess('Prescription created successfully!');
            }

            const prescriptionsRes = await listPrescriptions();
            setPrescriptions(prescriptionsRes.data);
            setViewMode(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Operation failed');
            console.error('Submission error:', err);
        }
    };

    const handleDelete = async (prescriptionId) => {
        if (window.confirm('Are you sure you want to delete this prescription?')) {
            try {
                await deletePrescription(prescriptionId);
                setPrescriptions(prev => prev.filter(p => p.id !== prescriptionId));
                setSuccess('Prescription deleted successfully!');
            } catch (err) {
                setError(err.response?.data?.message || 'Delete failed');
            }
        }
    };

    const handleCreateNew = () => {
        setFormData({
            patientId: '',
            doctorId: '',
            notes: '',
            items: []
        });
        setViewMode(false);
    };

    const handleEdit = (prescriptionId) => {
        navigate(`/prescriptions/edit/${prescriptionId}`);
    };

    const viewPrescriptionDetails = async (prescriptionId) => {
        try {
            setIsLoading(true);
            setError('');

            const [prescriptionRes, itemsRes] = await Promise.all([
                getPrescription(prescriptionId),
                listPrescriptionItems(prescriptionId)
            ]);

            // Get IDs from either direct fields or nested objects
            const doctorId = prescriptionRes.data.doctorId || (prescriptionRes.data.doctor?.id);
            const patientId = prescriptionRes.data.patientId || (prescriptionRes.data.patient?.id);

            const itemsWithDetails = itemsRes.data.map(item => {
                const medicalItemId = item.medicalItemId || (item.medicalItem?.id);
                const medicalItem = medicalItems.find(m => m.id === medicalItemId);

                console.log(itemsRes.data, "itemsWithDetails");

                return {
                    ...item,
                    medicalItemId: medicalItemId,
                    medicalItemName: medicalItem?.name || 'Unknown',
                    medicalItem: medicalItem
                };
            });

            setCurrentPrescription({
                ...prescriptionRes.data,
                items: itemsWithDetails,
                doctor: doctors.find(d => d.id === doctorId) || { name: 'N/A' },
                patient: patients.find(p => p.id === patientId) || { firstName: 'N/A', lastName: '' }
            });

            setShowDetails(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load details');
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="container text-center my-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <h2 className="my-4">Prescription Management</h2>

            {error && (
                <div className="alert alert-danger alert-dismissible fade show">
                    {error}
                    <button type="button" className="btn-close" onClick={() => setError('')} />
                </div>
            )}

            {success && (
                <div className="alert alert-success alert-dismissible fade show">
                    {success}
                    <button type="button" className="btn-close" onClick={() => setSuccess('')} />
                </div>
            )}
            {showDetails && currentPrescription && (
                <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Prescription Details</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDetails(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <h6>Doctor: {currentPrescription.doctor?.name || 'N/A'}</h6>
                                    <h6>Patient: {currentPrescription.patient?.firstName || 'N/A'} {currentPrescription.patient?.lastName || ''}</h6>
                                    <p>Notes: {currentPrescription.notes || 'No notes'}</p>
                                    <p>Date: {new Date(currentPrescription.createdAt).toLocaleDateString()}</p>
                                </div>

                                <h5>Medications</h5>
                                <table className="table">
                                    <thead>
                                        <tr>
                                            <th>Medication</th>
                                            <th>Qty</th>
                                            <th>Dosage</th>
                                            <th>Frequency</th>
                                            <th>Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {currentPrescription.items.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.name || 'Unknown'}</td>
                                                <td>{item.quantity}</td>
                                                <td>{item.dosage}</td>
                                                <td>{item.frequency}</td>
                                                <td>{item.duration}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowDetails(false)}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            {viewMode ? (
                <>
                    <div className="d-flex justify-content-end mb-3">
                        {role === 'DOCTOR' && (
                            <button
                                className="btn btn-primary"
                                onClick={handleCreateNew}
                            >
                                Create New Prescription
                            </button>
                        )}
                    </div>

                    <div className="table-responsive">
                        <table className="table table-striped table-hover">
                            <thead className="table-dark">
                                <tr> 
                                    <th>ID</th>
                                    <th>Doctor</th>
                                    <th>Patient</th>
                                    <th>Date</th>
                                    <th>Items Count</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {prescriptions.map(prescription => (
                                    <tr key={prescription.id}>
                                        <td>{prescription.id}</td>
                                        <td>{prescription.doctor?.name || 'N/A'}</td>
                                        <td>{prescription.patient?.firstName || 'N/A'} {prescription.patient?.lastName || ''}</td>
                                        <td>
                                            {prescription.createdAt ?
                                                new Date(prescription.createdAt).toLocaleDateString() :
                                                'N/A'}
                                        </td>
                                        <td>{prescription.items?.length || 0}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-info me-2"
                                                onClick={() => viewPrescriptionDetails(prescription.id)}
                                            >
                                                View
                                            </button>
                                            {role === 'DOCTOR' && (
                                                <>
                                                    <button
                                                        className="btn btn-sm btn-warning me-2"
                                                        onClick={() => handleEdit(prescription.id)}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-danger"
                                                        onClick={() => handleDelete(prescription.id)}
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                <form onSubmit={handleSubmit}>
                    <h3 className="mb-4">{isEditMode ? 'Edit' : 'Create'} Prescription</h3>

                    <div className="row mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Doctor <span className="text-danger">*</span></label>
                            <select
                                name="doctorId"
                                value={formData.doctorId}
                                onChange={handleChange}
                                className="form-select"
                                required
                                disabled={isLoading}
                            >
                                <option value="">Select Doctor</option>
                                {doctors.map(doctor => (
                                    <option key={doctor.id} value={doctor.id}>
                                        {doctor.name} ({doctor.specialization || 'General'})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Patient <span className="text-danger">*</span></label>
                            <select
                                name="patientId"
                                value={formData.patientId}
                                onChange={handleChange}
                                className="form-select"
                                required
                                disabled={isLoading}
                            >
                                <option value="">Select Patient</option>
                                {patients.map(patient => (
                                    <option key={patient.id} value={patient.id}>
                                        {patient.firstName} {patient.lastName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Notes</label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            className="form-control"
                            rows="3"
                            disabled={isLoading}
                        />
                    </div>

                    <div className="card mb-4">
                        <div className="card-header bg-primary text-white">
                            <h4 className="mb-0">Medications <span className="text-danger">*</span></h4>
                        </div>
                        <div className="card-body">
                            <div className="row g-3 mb-3">
                                <div className="col-md-3">
                                    <label className="form-label">Medication</label>
                                    <select
                                        name="medicalItemId"
                                        value={newItem.medicalItemId}
                                        onChange={handleItemChange}
                                        className="form-select"
                                        disabled={isLoading}
                                    >
                                        <option value="">Select Medication</option>
                                        {medicalItems.map(item => (
                                            <option
                                                key={item.id}
                                                value={item.id}
                                                disabled={item.currentStock <= 0}
                                            >
                                                {item.name} ({item.currentStock} in stock)
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="col-md-1">
                                    <label className="form-label">Qty</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={newItem.quantity}
                                        onChange={handleItemChange}
                                        className="form-control"
                                        min="1"
                                        disabled={isLoading || !newItem.medicalItemId}
                                    />
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label">Dosage</label>
                                    <input
                                        type="text"
                                        name="dosage"
                                        value={newItem.dosage}
                                        onChange={handleItemChange}
                                        className="form-control"
                                        disabled={isLoading || !newItem.medicalItemId}
                                    />
                                </div>

                                <div className="col-md-2">
                                    <label className="form-label">Frequency</label>
                                    <select
                                        name="frequency"
                                        value={newItem.frequency}
                                        onChange={handleItemChange}
                                        className="form-select"
                                        disabled={isLoading || !newItem.medicalItemId}
                                    >
                                        <option value="morning">Morning</option>
                                        <option value="evening">Evening</option>
                                        <option value="both">Both</option>
                                    </select>
                                </div>
                                <div className="col-md-2">
                                    <label className="form-label">Duration</label>
                                    <select
                                        name="duration"
                                        value={newItem.duration}
                                        onChange={handleItemChange}
                                        className="form-select"
                                        disabled={isLoading || !newItem.medicalItemId}
                                    >
                                        <option value="1 day">1 day</option>
                                        <option value="3 days">3 days</option>
                                        <option value="5 days">5 days</option>
                                        <option value="7 days" selected>7 days</option>
                                        <option value="10 days">10 days</option>
                                        <option value="14 days">14 days</option>
                                        <option value="21 days">21 days</option>
                                        <option value="28 days">28 days</option>
                                        <option value="30 days">30 days</option>
                                        <option value="As needed">As needed</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="col-md-2 d-flex align-items-end">
                                    <button
                                        type="button"
                                        className="btn btn-primary w-100"
                                        onClick={handleAddItem}
                                        disabled={isLoading || !newItem.medicalItemId}
                                    >
                                        Add
                                    </button>
                                </div>
                            </div>

                            {formData.items.length > 0 && (
                                <div className="table-responsive">
                                    <table className="table table-striped table-hover">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>Medication</th>
                                                <th>Qty</th>
                                                <th>Dosage</th>
                                                <th>Frequency</th>
                                                <th>Duration</th>
                                                <th>Action</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {formData.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td>{item.medicalItemName}</td>
                                                    <td>{item.quantity}</td>
                                                    <td>{item.dosage}</td>
                                                    <td>{item.frequency}</td>
                                                    <td>{item.duration}</td>
                                                    <td>
                                                        <button
                                                            type="button"
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={() => handleRemoveItem(index, item.id)}
                                                            disabled={isLoading}
                                                        >
                                                            Remove
                                                        </button>
                                                        {isEditMode && item.id && (
                                                            <button
                                                                type="button"
                                                                className="btn btn-sm btn-outline-primary ms-2"
                                                                onClick={() => handleUpdateItem(index, item.id)}
                                                                disabled={isLoading}
                                                            >
                                                                Update
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="d-flex justify-content-between">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setViewMode(true)}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={isLoading || formData.items.length === 0}
                        >
                            {isLoading ? (
                                <span className="spinner-border spinner-border-sm me-2" role="status" />
                            ) : null}
                            {isEditMode ? 'Update' : 'Create'} Prescription
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default PrescriptionForm;