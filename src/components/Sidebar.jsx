import {
  Bike,
  CarFront,
  ReceiptText,
  Users,
  FileChartLine,
  Home,
  BookUser,
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";

// Daftar menu dipisahkan untuk kemudahan pengelolaan di masa depan
const menuItems = [
  { path: "/dashboard", icon: <Home />, text: "Dashboard" },
  { path: "/peminjaman", icon: <BookUser/>, text: "Data Peminjaman" },
  { path: "/mobil", icon: <CarFront />, text: "Mobil" },
  { path: "/motor", icon: <Bike />, text: "Motor" },
  { path: "/pajak", icon: <ReceiptText />, text: "Pajak" },
  { path: "/laporan", icon: <FileChartLine />, text: "Laporan" },
  { path: "/akun", icon: <Users />, text: "Daftar Akun" },
];

const Sidebar = ({ isOpen, role }) => {
  const location = useLocation();
  return (
    // Kontainer utama sidebar dengan lebar tetap
    <div
      className={`fixed flex flex-col gap-3 h-full bg-[#171717] text-white w-64  p-4 z-10 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
    >
      {/* Bagian Header Judul */}
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-wider">STATE ASSETS</h1>
        <p className="text-sm text-gray-400">Management</p>
      </div>

      {/* Bagian Profil Pengguna */}
      <div className="flex flex-col gap-2 items-center">
        <img
          src="https://placehold.co/100x100/818cf8/ffffff?text=JD" // Placeholder untuk gambar profil
          alt="User Profile"
          className="w-24 h-24 rounded-full border-2 border-gray-600 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/100x100/EFEFEF/AAAAAA?text=Error";
          }}
        />
        <h2 className="text-lg font-semibold">John Doe</h2>
        <p className="text-sm text-gray-400">Balai</p>
      </div>

      {/* Daftar Menu Navigasi */}
      <nav className="flex-col">
        <ul>
          {menuItems.map((item) => {
            const isActive =
              item.path === "/dashboard"
                ? location.pathname === item.path
                : location.pathname.startsWith(item.path);
            return (
              <Link to={item.path} key={item.path}>
                <li
                  className={`flex items-center my-1 px-3 py-2 rounded-3xl cursor-pointer transition-colors duration-200
                  ${
                    isActive
                      ? "bg-[#1f4f27] text-white shadow-lg" 
                      : "hover:bg-gray-700/50"
                  }`}
                >
                  {item.icon}
                  <span className="ml-4 font-medium">{item.text}</span>
                </li>
              </Link>
            );
          })}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
