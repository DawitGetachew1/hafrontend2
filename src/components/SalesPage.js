import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
    TextField, 
    Button, 
    Grid, 
    Box, 
    MenuItem, 
    Select, 
    InputLabel, 
    FormControl, 
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Link } from 'react-router-dom'; // For navigation links

const SalesPage = () => {
    const [items, setItems] = useState([]);
    const [selectedItem, setSelectedItem] = useState('');
    const [quantity, setQuantity] = useState('');
    const [message, setMessage] = useState('');
    const [sales, setSales] = useState([]);
    const [filteredSales, setFilteredSales] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        // Fetch all items and sales
        axios.get('https://habackend.onrender.com/api/items')
            .then((response) => setItems(response.data))
            .catch((error) => console.error(error));

        axios.get('https://habackend.onrender.com/api/items/sales')
            .then((response) => {
                setSales(response.data);
                setFilteredSales(response.data);
            })
            .catch((error) => console.error(error));
    }, []);

    const handleItemChange = (event) => setSelectedItem(event.target.value);
    const handleQuantityChange = (event) => setQuantity(event.target.value);

    const handleSaleSubmit = (event) => {
        event.preventDefault();

        if (!selectedItem || isNaN(quantity) || quantity <= 0) {
            setMessage('Please select an item and enter a valid quantity.');
            return;
        }

        axios.put(`https://habackend.onrender.com/api/items/sales/${selectedItem}`, { quantity: parseInt(quantity) })
            .then(({ data }) => {
                setMessage(`Sale successful! Sold ${data.sale.quantity} of ${data.sale.itemName}.`);
                setSales([data.sale, ...sales]);
                setFilteredSales([data.sale, ...sales]);
                setItems(items.map((item) =>
                    item._id === selectedItem ? { ...item, quantity: data.remainingStock } : item
                ));
                setSelectedItem('');
                setQuantity('');
            })
            .catch((error) => setMessage('Error processing the sale.'));
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
        if (date) {
            setFilteredSales(sales.filter((sale) => {
                const saleDate = new Date(sale.saleDate);
                return saleDate.toDateString() === date.toDateString();
            }));
        } else {
            setFilteredSales(sales);
        }
    };

    return (
        <div style={{ padding: '20px', maxWidth: '1200px', margin: 'auto' }}>
            {/* Menu Section */}
            <Box display="flex" justifyContent="space-between" marginBottom="20px">
                <Link to="/" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="primary">Add Item</Button>
                </Link>
                <Link to="/sales" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" color="secondary">Sales</Button>
                </Link>
            </Box>

            {/* Sales Form */}
            <Typography variant="h4" align="center" gutterBottom>Sales Page</Typography>
            <form onSubmit={handleSaleSubmit}>
                <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                        <FormControl fullWidth>
                            <InputLabel id="select-item-label">Item</InputLabel>
                            <Select
                                labelId="select-item-label"
                                value={selectedItem}
                                onChange={handleItemChange}
                                label="Item"
                                required
                            >
                                {items.map((item) => (
                                    <MenuItem key={item._id} value={item._id}>
                                        {item.name} - {item.quantity} in stock
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            label="Quantity Sold"
                            type="number"
                            fullWidth
                            value={quantity}
                            onChange={handleQuantityChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Box display="flex" justifyContent="center">
                            <Button variant="contained" color="primary" type="submit">Process Sale</Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
            {message && (
                <Box mt={3} textAlign="center">
                    <Typography variant="h6" color={message.includes('successful') ? 'success' : 'error'}>{message}</Typography>
                </Box>
            )}

            {/* Sales History */}
            <Box mt={5}>
                <Typography variant="h5" gutterBottom>Sales History</Typography>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                        label="Filter by Date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </LocalizationProvider>
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Item Name</TableCell>
                                <TableCell>Quantity Sold</TableCell>
                                <TableCell>Sale Date</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredSales.map((sale) => (
                                <TableRow key={sale._id}>
                                    <TableCell>{sale.itemName}</TableCell>
                                    <TableCell>{sale.quantity}</TableCell>
                                    <TableCell>{new Date(sale.saleDate).toLocaleString()}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </div>
    );
};

export default SalesPage;
