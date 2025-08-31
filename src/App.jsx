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
import EditAkun from "./pages/EditAkun";
import TambahAkun from "./pages/TambahAkun";
import DetailAkun from "./pages/DetailAkun";
import DetailMobil from "./pages/DetailMobil";
import DetailMotor from "./pages/DetailMotor";
import EditMobil from "./pages/EditMobil";
import EditMotor from "./pages/EditMotor";
import ProsesPajak from "./pages/ProsesPajak";

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
        {role && (
          <Sidebar
            toggleSidebar={toggleSidebar}
            isOpen={isSidebarOpen}
            role={role}
          />
        )}
        {role === "admin" && (
          <NavbarDashboard
            toggleSidebar={toggleSidebar}
            isSidebarOpen={isSidebarOpen}
          />
        )}
        <Routes>
          {/* auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/register" element={<Register />} />
          {/* akun */}
          <Route
            path="/akun"
            element={<DaftarAkun isSidebarOpen={isSidebarOpen} />}
          />
          <Route
            path="/akun/:id"
            element={<DetailAkun isSidebarOpen={isSidebarOpen} />}
          />
          <Route
            path="/akun/edit/:id"
            element={<EditAkun isSidebarOpen={isSidebarOpen} />}
          />
          {/* peminjaman */}
          <Route
            path="/peminjaman"
            element={<DaftarPeminjaman isSidebarOpen={isSidebarOpen} />}
          />
          {/* mobil */}
          <Route
            path="/mobil"
            element={<DaftarMobil isSidebarOpen={isSidebarOpen} />}
          />
          <Route
            path="/mobil/tambah_mobil"
            element={<TambahMobil isSidebarOpen={isSidebarOpen} />}
          />
          <Route
            path="/mobil/:id"
            element={<DetailMobil isSidebarOpen={isSidebarOpen} />}
          />
          <Route
            path="/mobil/edit/:id"
            element={<EditMobil isSidebarOpen={isSidebarOpen} />}
          />
          {/* motor */}
          <Route
            path="/motor"
            element={<DaftarMotor isSidebarOpen={isSidebarOpen} />}
          />
          <Route
            path="/motor/tambah_motor"
            element={<TambahMotor isSidebarOpen={isSidebarOpen} />}
          />
          <Route
            path="/motor/:id"
            element={<DetailMotor isSidebarOpen={isSidebarOpen} />}
          />
          <Route
            path="/motor/edit/:id"
            element={<EditMotor isSidebarOpen={isSidebarOpen} />}
          />
          {/* pajak */}
          <Route
            path="/pajak"
            element={<DaftarPajak isSidebarOpen={isSidebarOpen} />}
          />
          <Route
            path="/pajak/proses/:id"
            element={<ProsesPajak isSidebarOpen={isSidebarOpen} />}
          />
          <Route
            path="/laporan"
            element={<DaftarLaporan isSidebarOpen={isSidebarOpen} />}
          />
          <Route
            path="/akun/tambah_akun"
            element={<TambahAkun isSidebarOpen={isSidebarOpen} />}
          />
        </Routes>
      </div>
    );
};

export default App;
