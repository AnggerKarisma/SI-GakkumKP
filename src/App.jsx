import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import TambahMobil from "./pages/TambahMobil";

const App = () => {
  // const location = useLocation();

  return (
    <div className="App">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/tambah_mobil" element={<TambahMobil />}/>
      </Routes>
    </div>
  );
};

export default App;
