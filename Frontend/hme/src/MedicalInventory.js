import React, { useState, useEffect } from 'react';
import api from './api';
import { useNavigate } from 'react-router-dom';
import { getCurrentRole } from './Auth';

const MedicalInventory = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        currentStock: 0,
        minimumStockLevel: 5
    });
    const [imageFile, setImageFile] = useState(null);
    const [showForm, setShowForm] = useState(false);
    const navigate = useNavigate();
    const role = getCurrentRole();

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const response = await api.get('/Mapi/medical-items');
                setItems(response.data);
            } catch (error) {
                setError('Failed to load medical items');
            } finally {
                setLoading(false);
            }
        };
        fetchItems();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'currentStock' || name === 'minimumStockLevel'
                ? parseInt(value) || 0
                : value
        }));
    };

    const handleFileChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('currentStock', formData.currentStock);
            formDataToSend.append('minimumStockLevel', formData.minimumStockLevel);
            if (imageFile) {
                formDataToSend.append('imageFile', imageFile);
            }

            await api.post('/Mapi/medical-items', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            // Refresh the list
            const response = await api.get('/Mapi/medical-items');
            setItems(response.data);
            setFormData({
                name: '',
                description: '',
                currentStock: 0,
                minimumStockLevel: 5
            });
            setImageFile(null);
            setShowForm(false);
        } catch (error) {
            setError('Failed to add medical item');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await api.delete(`/Mapi/medical-items/${id}`);
                setItems(items.filter(item => item.id !== id));
            } catch (error) {
                setError('Failed to delete medical item');
            }
        }
    };

    const getImageUrl = (imagePath) => {
        return `http://localhost:8082/api/images/${imagePath}`; // Match your backend port
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;

    return (
        <div className="container">
            <h2>Medical Inventory</h2>

            {role === 'SUPER_ADMIN' && (
                <button
                    className="btn btn-primary mb-3"
                    onClick={() => setShowForm(!showForm)}
                >
                    {showForm ? 'Cancel' : 'Add New Medical Item'}
                </button>
            )}

            {showForm && (
                <div className="card mb-4">
                    <div className="card-body">
                        <h4>Add Medical Item</h4>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Description</label>
                                <textarea
                                    className="form-control"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Image</label>
                                <input
                                    type="file"
                                    className="form-control"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Current Stock</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="currentStock"
                                    value={formData.currentStock}
                                    onChange={handleChange}
                                    min="0"
                                    required
                                />
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Minimum Stock Level</label>
                                <input
                                    type="number"
                                    className="form-control"
                                    name="minimumStockLevel"
                                    value={formData.minimumStockLevel}
                                    onChange={handleChange}
                                    min="1"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-success">Save</button>
                        </form>
                    </div>
                </div>
            )}

            <div className="table-responsive">
                <table className="table table-striped">
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Current Stock</th>
                            <th>Min Stock</th>
                            {role === 'SUPER_ADMIN' && <th>Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {items.map(item => (
                            <tr key={item.id} className={item.currentStock < item.minimumStockLevel ? 'table-warning' : ''}>
                                <td>
                                    {item.imagePath && (
                                        <>
                                            <img
                                                src={getImageUrl(item.imagePath)}
                                                alt={item.name}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                            />
                                        </>
                                    )}
                                </td>
                                <td>{item.name}</td>
                                <td>{item.description}</td>
                                <td>{item.currentStock}</td>
                                <td>{item.minimumStockLevel}</td>
                                {role === 'SUPER_ADMIN' && (
                                    <td>
                                        <button
                                            className="btn btn-sm btn-danger"
                                            onClick={() => handleDelete(item.id)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default MedicalInventory;