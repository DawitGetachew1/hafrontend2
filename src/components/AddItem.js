import React, { useState } from 'react';
import axios from 'axios';

const AddItem = () => {
    const [name, setName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [price, setPrice] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newItem = { name, quantity, price };
        try {
            await axios.post('https://habackend.onrender.com/api/items', newItem);
            alert('Item added!');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <input placeholder="Name" onChange={(e) => setName(e.target.value)} />
            <input placeholder="Quantity" onChange={(e) => setQuantity(e.target.value)} />
            <input placeholder="Price" onChange={(e) => setPrice(e.target.value)} />
            <button type="submit">Add Item</button>
        </form>
    );
};

export default AddItem;
