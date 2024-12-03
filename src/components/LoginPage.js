import React, { useState } from 'react';
import axios from 'axios';
import { TextField, Button, Box, Typography, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post('https://habackend.onrender.com/api/auth/login', { 
                email, 
                password 
            });
            setMessage(`Welcome, ${response.data.user.name}`);
            localStorage.setItem('authToken', response.data.token);
            navigate('/'); // Redirect to the home page
        } catch (error) {
            console.error('Login error:', error);
            setMessage(error.response?.data?.message || 'Login failed. Please check your credentials.');
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
                Login
            </Typography>
            <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px' }}>
                <TextField
                    label="Email"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
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
                    Login
                </Button>
            </form>
            {message && (
                <Typography variant="body1" color="error" style={{ marginTop: '20px' }}>
                    {message}
                </Typography>
            )}
            
            {/* Register Link */}
            <Box sx={{ marginTop: '20px' }}>
                <Typography variant="body2">
                    Don't have an account?{' '}
                    <Link 
                        href="/register" 
                        underline="hover"
                        sx={{ cursor: 'pointer' }}
                    >
                        Register here
                    </Link>
                </Typography>
            </Box>
        </Box>
    );
};

export default LoginPage;
