import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';

const App = () => {
    // const location = useLocation();

    return(
        <div className='App'>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
        </div>
    );
};

export default App;