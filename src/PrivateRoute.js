import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthProvider';
import {Spinner} from "react-bootstrap";

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return <Spinner animation="border" variant="primary" />
    }

    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;