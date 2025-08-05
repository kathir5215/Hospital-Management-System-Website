import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';

const RoleCheck = () => {
    const [redirect, setRedirect] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setRedirect(true);
        }, 2000); 
        return () => clearTimeout(timer);
    }, []);

    if (redirect) {
        return <Navigate to="/login" />;
    }

    return (
        <div style={{ padding: "20px", textAlign: "center", color: "red" }}>
            <h3>You are not allowed to perform this action.</h3>
            <p>Redirecting to login...</p>
        </div>
    );
};

export default RoleCheck;
