import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
    // const location = useLocation();

    return(
        <div className='App'>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/register" element={<Register/>}/>
            </Routes>
        </div>
    );
};

export default App;