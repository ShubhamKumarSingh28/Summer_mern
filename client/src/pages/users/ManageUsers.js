import IconButton from '@mui/material/IconButton';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { serverEndpoint } from "../../config/config";
import { Modal } from 'react-bootstrap';

const USER_ROLES = ['viewer', 'developer'];

function ManageUsers() {
    const [errors, setErrors] = useState({});
    const [usersData, setUsersData] = useState([]);
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        role: ''
    });
    const [showModal, setShowModal] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formLoading, setFormLoading] = useState(false);

    const handleModalShow = (isEdit, data = {}) => {
        if (isEdit) {
            setFormData({
                id: data._id,
                email: data.email,
                role: data.role,
                name: data.name
            });
        } else {
            setFormData({
                email: '',
                role: '',
                name: ''
            });
        }
        setIsEdit(isEdit);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDeleteModalShow = (userId) => {
        setFormData({
            id: userId
        });
        setShowDeleteModal(true);
    };

    const handleDeleteModalClose = () => {
        setShowDeleteModal(false);
    };

    const handleDeleteSubmit = async () => {
        try {
            setFormLoading(true);
            await axios.delete(
                `${serverEndpoint}/users/${formData.id}`,
                { withCredentials: true });
            setFormData({
                email: '',
                role: '',
                name: ''
            });
            fetchUsers();
        } catch (error) {
            setErrors({ message: 'Something went wrong, please try again' });
        } finally {
            handleDeleteModalClose();
            setFormLoading(false);
        }
    };

    const handleChange = (event) => {
        const name = event.target.name;
        const value = event.target.value;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    const validate = () => {
        let newErrors = {};
        let isValid = true;
        if (formData.email.length === 0) {
            newErrors.email = "Email is mandatory";
            isValid = false;
        }

        if (formData.role.length === 0) {
            newErrors.role = "Role is mandatory";
            isValid = false;
        }

        if (formData.name.length === 0) {
            newErrors.name = "Name is mandatory";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    }

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (validate()) {
            setFormLoading(true);
            const body = {
                email: formData.email,
                name: formData.name,
                role: formData.role
            };
            const configuration = {
                withCredentials: true
            };
            try {
                if (isEdit) {
                    await axios.put(
                        `${serverEndpoint}/users/${formData.id}`,
                        body, configuration);
                } else {
                    await axios.post(
                        `${serverEndpoint}/users`,
                        body, configuration);
                }

                setFormData({
                    email: '',
                    name: '',
                    role: ''
                });
                fetchUsers();
            } catch (error) {
                setErrors({ message: 'Something went wrong, please try again' });
            } finally {
                handleModalClose();
                setFormLoading(false);
            }
        }
    };

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${serverEndpoint}/users`, {
                withCredentials: true
            });
            setUsersData(response.data);
        } catch (error) {
            console.log(error);
            setErrors({ message: 'Unable to fetch users at the moment, please try again' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const columns = [
        { field: 'email', headerName: 'Email', flex: 2 },
        { field: 'name', headerName: 'Name', flex: 2 },
        { field: 'role', headerName: 'Role', flex: 2 },
        {
            field: 'action', headerName: 'Action', flex: 1, renderCell: (params) => (
                <>
                    <IconButton>
                        <EditIcon onClick={() => handleModalShow(true, params.row)} />
                    </IconButton>
                    <IconButton>
                        <DeleteIcon onClick={() => handleDeleteModalShow(params.row._id)} />
                    </IconButton>
                </>
            )
        },
    ];

    return (
        <div className="container" style={{ padding: '2.5rem 0', maxWidth: 1100 }}>
            {/* Dashboard Header & Actions */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
                <h2 style={{ margin: 0, color: 'var(--primary-dark)', fontWeight: 800, fontSize: '2.1rem', letterSpacing: '-1px' }}>
                    Manage Users
                </h2>
                <button className="cta-btn" onClick={() => handleModalShow(false)}>
                    + Add User
                </button>
            </div>

            {/* Error Alert */}
            {errors.message && (
                <div style={{ background: '#fee2e2', color: '#991b1b', borderRadius: '8px', padding: '1em', marginBottom: '1.5em', fontWeight: 500, border: '1px solid #fecaca' }}>{errors.message}</div>
            )}

            {/* Data Table */}
            <div style={{ background: 'var(--card-bg)', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', padding: '2rem', border: '1px solid var(--border)' }}>
                <div style={{ height: 500, width: '100%' }}>
                    <DataGrid
                        getRowId={(row) => row._id}
                        rows={usersData}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: { pageSize: 20, page: 0 },
                            },
                        }}
                        pageSizeOptions={[20, 50, 100]}
                        disableRowSelectionOnClick
                        showToolbar
                        sx={{
                            fontFamily: 'inherit',
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--text)',
                            '.MuiDataGrid-columnHeaders': {
                                background: 'var(--background)',
                                color: 'var(--primary-dark)',
                                fontWeight: 700,
                                fontSize: '1.05rem',
                            },
                            '.MuiDataGrid-row': {
                                background: '#fff',
                            },
                            '.MuiDataGrid-cell': {
                                borderBottom: '1px solid var(--border)',
                            },
                            '.MuiDataGrid-footerContainer': {
                                background: 'var(--background)',
                            },
                        }}
                        loading={loading}
                    />
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal show={showModal} onHide={handleModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{isEdit ? (<>Edit User</>) : (<>Add User</>)}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: 18 }}>
                            <label htmlFor="email" style={{ display: 'block', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: 6 }}>Email</label>
                            <input
                                type="text"
                                name="email"
                                style={{ width: '100%', padding: '0.7em 1em', borderRadius: 'var(--radius)', border: errors.email ? '1.5px solid #ef4444' : '1.5px solid var(--border)', fontSize: '1rem', background: '#fff', color: 'var(--text)' }}
                                value={formData.email}
                                onChange={handleChange}
                            />
                            {errors.email && (
                                <div style={{ color: '#ef4444', fontSize: '0.97rem', marginTop: 4 }}>{errors.email}</div>
                            )}
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label htmlFor="name" style={{ display: 'block', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: 6 }}>Name</label>
                            <input
                                type="text"
                                name="name"
                                style={{ width: '100%', padding: '0.7em 1em', borderRadius: 'var(--radius)', border: errors.name ? '1.5px solid #ef4444' : '1.5px solid var(--border)', fontSize: '1rem', background: '#fff', color: 'var(--text)' }}
                                value={formData.name}
                                onChange={handleChange}
                            />
                            {errors.name && (
                                <div style={{ color: '#ef4444', fontSize: '0.97rem', marginTop: 4 }}>{errors.name}</div>
                            )}
                        </div>
                        <div style={{ marginBottom: 18 }}>
                            <label htmlFor="role" style={{ display: 'block', fontWeight: 600, color: 'var(--primary-dark)', marginBottom: 6 }}>Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                style={{ width: '100%', padding: '0.7em 1em', borderRadius: 'var(--radius)', border: errors.role ? '1.5px solid #ef4444' : '1.5px solid var(--border)', fontSize: '1rem', background: '#fff', color: 'var(--text)' }}
                            >
                                <option key="select" value="">Select</option>
                                {USER_ROLES.map((role) => (
                                    <option key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </option>
                                ))}
                            </select>
                            {errors.role && (
                                <div style={{ color: '#ef4444', fontSize: '0.97rem', marginTop: 4 }}>{errors.role}</div>
                            )}
                        </div>
                        <div style={{ marginBottom: 10 }}>
                            {formLoading ? (
                                <button className="cta-btn" type="button" disabled style={{ width: '100%', opacity: 0.7 }}>
                                    Loading...
                                </button>
                            ) : (
                                <button type="submit" className="cta-btn" style={{ width: '100%' }}>
                                    Submit
                                </button>
                            )}
                        </div>
                    </form>
                </Modal.Body>
            </Modal>

            {/* Delete Modal */}
            <Modal show={showDeleteModal} onHide={handleDeleteModalClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to delete this user?
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn" style={{ background: '#e5e7eb', color: 'var(--primary-dark)', borderRadius: 8, padding: '0.6em 1.4em', fontWeight: 600, fontSize: '1rem', border: 'none' }} onClick={handleDeleteModalClose}>
                        Cancel
                    </button>
                    {formLoading ? (
                        <button className="btn" style={{ background: '#ef4444', color: '#fff', borderRadius: 8, padding: '0.6em 1.4em', fontWeight: 600, fontSize: '1rem', border: 'none', opacity: 0.7 }} type="button" disabled>
                            Loading...
                        </button>
                    ) : (
                        <button className="btn" style={{ background: '#ef4444', color: '#fff', borderRadius: 8, padding: '0.6em 1.4em', fontWeight: 600, fontSize: '1rem', border: 'none' }} onClick={handleDeleteSubmit}>
                            Delete
                        </button>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
}

export default ManageUsers;