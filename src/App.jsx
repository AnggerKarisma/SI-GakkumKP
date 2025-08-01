import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";

import NavbarDashboard from "./components/NavbarDashboard";
import Sidebar from "./components/Sidebar";
import DaftarMobil from "./pages/DaftarMobil";
import DaftarMotor from "./pages/DaftarMotor";
import TambahMobil from "./pages/TambahMobil";
import TambahMotor from "./pages/TambahMotor";

const App = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  const excludedRoutes = ["/", "/login", "/register"];
  const showNavbar = !excludedRoutes.includes(location.pathname);
  const showFooter = showNavbar;

  let role = "admin";

  if (location.pathname.match)
    return (
      <div className="App">
        {showNavbar && <NavbarDashboard />}

        {/* Conditionally render Sidebar and Navbar based on the role */}
        {role && <Sidebar isOpen={isSidebarOpen} role={role} />}
        {role === "admin" && (
          <NavbarDashboard
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
        )}
        {/* {role === "mitra-hotel" && (
          <NavbarDashboard
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
        )}
        {role === "mitra-pesawat" && (
          <NavbarMitraPenerbangan
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
        )} */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mobil" element={<DaftarMobil isSidebarOpen={isSidebarOpen}/>} />
          <Route path="/motor" element={<DaftarMotor isSidebarOpen={isSidebarOpen}/>} />
          <Route path="/mobil/tambah_mobil" element={<TambahMobil isSidebarOpen={isSidebarOpen}/>} />
          <Route path="/motor/tambah_motor" element={<TambahMotor isSidebarOpen={isSidebarOpen}/>} />
        </Routes>
      </div>
    );
};

export default App;
