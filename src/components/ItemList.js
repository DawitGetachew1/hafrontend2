import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, 
    TablePagination, Paper, IconButton, Box, Button, Modal, TextField, Grid 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';

const ItemList = () => {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [openModal, setOpenModal] = useState(false);
    const [editModal, setEditModal] = useState(false); // Edit modal state
    const [newItem, setNewItem] = useState({ name: '', quantity: '', price: '' });
    const [selectedItem, setSelectedItem] = useState(null); // Item being edited
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('https://habackend.onrender.com/api/items')
            .then(response => setItems(response.data))
            .catch(error => console.error(error));
    }, []);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDelete = (id) => {
        axios.delete(`https://habackend.onrender.com/api/items/${id}`)
            .then(() => {
                setItems(items.filter(item => item._id !== id));
            })
            .catch(error => console.error(error));
    };

    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleOpenEditModal = (item) => {
        setSelectedItem(item); // Set the selected item for editing
        setNewItem({ name: item.name, quantity: item.quantity, price: item.price });
        setEditModal(true); // Open edit modal
    };

    const handleCloseEditModal = () => setEditModal(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewItem({ ...newItem, [name]: value });
    };

    const handleSubmitAdd = (event) => {
        event.preventDefault();
        axios.post('https://habackend.onrender.com/api/items', newItem)
            .then(response => {
                setItems([...items, response.data]);
                setNewItem({ name: '', quantity: '', price: '' });
                handleCloseModal();
            })
            .catch(error => console.error(error));
    };

    const handleSubmitEdit = (event) => {
        event.preventDefault();
        axios.put(`https://habackend.onrender.com/api/items/${selectedItem._id}`, newItem)
            .then(response => {
                setItems(items.map(item => item._id === selectedItem._id ? response.data : item));
                setSelectedItem(null); // Clear selected item
                setNewItem({ name: '', quantity: '', price: '' });
                handleCloseEditModal();
            })
            .catch(error => console.error(error));
    };

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Inventory Items</h2>

            {/* Navigation Menu */}
            <Box display="flex" justifyContent="space-between" marginBottom="20px">
                <Button variant="contained" color="primary" onClick={() => navigate('/')} >
                    Add Item
                </Button>
                <Button variant="contained" color="secondary" onClick={() => navigate('/sales')}>
                    Sales
                </Button>
                {/* Logout Button */}
                <Button variant="contained" color="error" onClick={handleLogout}>
                    Logout
                </Button>
            </Box>

            {/* Add Item Button */}
            <Box display="flex" justifyContent="flex-end" marginBottom="20px">
                <Button variant="contained" color="primary" onClick={handleOpenModal} startIcon={<AddIcon />}>
                    Add New Item
                </Button>
            </Box>

            {/* Table of Items */}
            <TableContainer component={Paper}>
                <Box sx={{ overflowX: 'auto' }}>
                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                        <TableHead>
                            <TableRow>
                                <TableCell>Name</TableCell>
                                <TableCell>Quantity</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell align="center">Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {items.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item) => (
                                <TableRow key={item._id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell>{item.quantity}</TableCell>
                                    <TableCell>{item.price} Birr</TableCell>
                                    <TableCell align="center">
                                        <IconButton onClick={() => handleDelete(item._id)}>
                                            <DeleteIcon color="error" />
                                        </IconButton>
                                        <IconButton onClick={() => handleOpenEditModal(item)}>
                                            <EditIcon color="primary" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Box>
            </TableContainer>

            {/* Table Pagination */}
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={items.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />

            {/* Modal for Adding Item */}
            <Modal
                open={openModal}
                onClose={handleCloseModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white', padding: '20px', width: '400px', borderRadius: '8px'
                }}>
                    <h2 id="modal-title" style={{ textAlign: 'center' }}>Add New Item</h2>
                    <form onSubmit={handleSubmitAdd}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Item Name"
                                    variant="outlined"
                                    fullWidth
                                    name="name"
                                    value={newItem.name}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Quantity"
                                    variant="outlined"
                                    fullWidth
                                    name="quantity"
                                    value={newItem.quantity}
                                    onChange={handleInputChange}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Price"
                                    variant="outlined"
                                    fullWidth
                                    name="price"
                                    value={newItem.price}
                                    onChange={handleInputChange}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="flex-end">
                                    <Button variant="contained" color="primary" type="submit">
                                        Add Item
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>

            {/* Modal for Editing Item */}
            <Modal
                open={editModal}
                onClose={handleCloseEditModal}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <Box sx={{
                    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                    backgroundColor: 'white', padding: '20px', width: '400px', borderRadius: '8px'
                }}>
                    <h2 id="modal-title" style={{ textAlign: 'center' }}>Edit Item</h2>
                    <form onSubmit={handleSubmitEdit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    label="Item Name"
                                    variant="outlined"
                                    fullWidth
                                    name="name"
                                    value={newItem.name}
                                    onChange={handleInputChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Quantity"
                                    variant="outlined"
                                    fullWidth
                                    name="quantity"
                                    value={newItem.quantity}
                                    onChange={handleInputChange}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    label="Price"
                                    variant="outlined"
                                    fullWidth
                                    name="price"
                                    value={newItem.price}
                                    onChange={handleInputChange}
                                    type="number"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Box display="flex" justifyContent="flex-end">
                                    <Button variant="contained" color="primary" type="submit">
                                        Update Item
                                    </Button>
                                </Box>
                            </Grid>
                        </Grid>
                    </form>
                </Box>
            </Modal>
        </div>
    );
};

export default ItemList;
