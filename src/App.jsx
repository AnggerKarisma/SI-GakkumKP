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
import DaftarPajak from "./pages/DaftarPajak";
import DaftarPeminjaman from "./pages/DaftarPeminjaman";
import DaftarLaporan from "./pages/DaftarLaporan";
import DaftarAkun from "./pages/DaftarAkun";
import TambahAkun from "./pages/TambahAkun";
import DetailMobil from "./pages/DetailMobil";
import DetailMotor from "./pages/DetailMotor";

const App = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  // let role = null;
  let role = "admin";
  
  const excludedRoutes = ["/", "/login", "/register"];
  const showNavbar = !excludedRoutes.includes(location.pathname);
  const showFooter = showNavbar;


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
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          {/* peminjaman */}
          <Route path="/peminjaman" element={<DaftarPeminjaman isSidebarOpen={isSidebarOpen}/>} />
          {/* mobil */}
          <Route path="/mobil" element={<DaftarMobil isSidebarOpen={isSidebarOpen}/>} />
          <Route path="/mobil/tambah_mobil" element={<TambahMobil isSidebarOpen={isSidebarOpen}/>} />
          <Route path="/mobil/:id" element={<DetailMobil isSidebarOpen={isSidebarOpen} isFormDisabled={true}/>} />
          <Route path="/mobil/edit/:id" element={<DetailMobil isSidebarOpen={isSidebarOpen} isFormDisabled ={false}/>} />
          {/* motor */}
          <Route path="/motor" element={<DaftarMotor isSidebarOpen={isSidebarOpen}/>} />
          <Route path="/pajak" element={<DaftarPajak isSidebarOpen={isSidebarOpen}/>} />
          <Route path="/laporan" element={<DaftarLaporan isSidebarOpen={isSidebarOpen}/>} />
          <Route path="/akun" element={<DaftarAkun isSidebarOpen={isSidebarOpen}/>} />
          <Route path="/akun/tambah_akun" element={<TambahAkun isSidebarOpen={isSidebarOpen}/>} />
          <Route path="/motor/tambah_motor" element={<TambahMotor isSidebarOpen={isSidebarOpen}/>} />
          <Route path="/motor/:id" element={<DetailMotor isSidebarOpen={isSidebarOpen} isFormDisabled={true}/>} />
          <Route path="/motor/edit/:id" element={<DetailMotor isSidebarOpen={isSidebarOpen} isFormDisabled ={false}/>} />
        </Routes>
      </div>
    );
};

export default App;
