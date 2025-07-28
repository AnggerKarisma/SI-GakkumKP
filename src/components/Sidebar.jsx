import React from "react";
import { Link, useLocation } from "react-router-dom";

// Daftar menu dipisahkan untuk kemudahan pengelolaan di masa depan
const menuItems = [
  { path: "/tambah_mobil", icon: "ri-home-line", text: "Beranda" },
  { path: "/mobil", icon: "ri-car-line", text: "Mobil" },
  { path: "/motor", icon: "ri-motorbike-line", text: "Motor" },
  { path: "/pajak", icon: "ri-file-text-line", text: "Pajak" },
  { path: "/laporan", icon: "ri-file-chart-line", text: "Laporan" },
  { path: "/pengaturan-akun", icon: "ri-user-settings-line", text: "Pengaturan Akun",}
];

const Sidebar = () => {
  const location = useLocation();

  return (
    // Kontainer utama sidebar dengan lebar tetap
    <div className="fixed top-0 left-0 flex flex-col gap-3 h-full bg-[#242424] text-white w-64 p-5 z-10">
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
          {menuItems.map((item) => (
            <Link to={item.path} key={item.path}>
              <li
                className={`flex items-center my-1 p-2 rounded-3xl cursor-pointer transition-colors duration-200
                  ${
                    location.pathname === item.path
                      ? "bg-[#1f4f27] text-white shadow-lg" // Gaya untuk menu aktif
                      : "hover:bg-gray-700/50" // Gaya untuk menu saat disentuh (hover)
                  }`}
              >
                <i className={`${item.icon} text-xl`}></i>
                <span className="ml-4 font-medium">{item.text}</span>
              </li>
            </Link>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
