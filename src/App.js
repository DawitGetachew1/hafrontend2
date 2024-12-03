import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ItemList from './components/ItemList';
import AddItem from './components/AddItem';
import SalesPage from './components/SalesPage';
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
    return (
        <Router>
            <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected Routes */}
                <Route 
                    path="/" 
                    element={
                        <ProtectedRoute>
                            <ItemList />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/add-item" 
                    element={
                        <ProtectedRoute>
                            <AddItem />
                        </ProtectedRoute>
                    } 
                />
                <Route 
                    path="/sales" 
                    element={
                        <ProtectedRoute>
                            <SalesPage />
                        </ProtectedRoute>
                    } 
                />
            </Routes>
        </Router>
    );
};

export default App;
