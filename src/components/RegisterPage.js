import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://habackend.onrender.com/api/auth/register', {
                name,
                email,
                password
            });
            setMessage('Registration successful!');
            localStorage.setItem('authToken', response.data.token);
            // Redirect or handle successful registration
            navigate('/'); // Redirect to home or another page after successful registration
        } catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
        >
            <Typography variant="h4" gutterBottom>
                Register
            </Typography>
            <form onSubmit={handleRegister} style={{ width: '100%', maxWidth: '400px' }}>
                <TextField
                    label="Name"
                    fullWidth
                    margin="normal"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    type="email"
                />
                <TextField
                    label="Password"
                    type="password"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <Button variant="contained" color="primary" type="submit" fullWidth>
                    Register
                </Button>
            </form>
            {message && (
                <Typography 
                    variant="body1" 
                    color={message.includes('successful') ? 'success' : 'error'} 
                    style={{ marginTop: '20px' }}
                >
                    {message}
                </Typography>
            )}
            
            {/* Login Link */}
            <Box sx={{ marginTop: '20px' }}>
                <Typography variant="body2">
                    Already have an account?{' '}
                    <Link 
                        href="/login" 
                        underline="hover"
                        sx={{ cursor: 'pointer' }}
                    >
                        Login here
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default RegisterPage;
