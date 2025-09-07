import { useEffect, useState } from "react";
import {
    Bike,
    CarFront,
    ReceiptText,
    Users,
    FileChartLine,
    Home,
    BookUser,
    SquarePen,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { getProfile } from "../services/authService";

// Daftar menu dipisahkan untuk kemudahan pengelolaan di masa depan
const menuItems = [
    { path: "/dashboard", icon: <Home />, text: "Dashboard" },
    { path: "/peminjaman", icon: <BookUser />, text: "Data Peminjaman" },
    { path: "/mobil", icon: <CarFront />, text: "Mobil" },
    { path: "/motor", icon: <Bike />, text: "Motor" },
    { path: "/pajak", icon: <ReceiptText />, text: "Pajak" },
    { path: "/laporan", icon: <FileChartLine />, text: "Laporan" },
    { path: "/akun", icon: <Users />, text: "Daftar Akun" },
];

const Sidebar = ({ toggleSidebar, isOpen, role }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [profileName, setProfileName] = useState("Memuat...");
    const [profileUnit, setProfileUnit] = useState("...");

    const handleProfileEdit = () => {
        navigate("/profile");
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();
                // Asumsi data pengguna ada di dalam `response.data`
                const userData = response.data;

                // Ambil nama
                setProfileName(userData.nama || "Tanpa Nama");

                // Proses unitKerja sesuai logika
                let unitKerjaDisplay = userData.unitKerja || "Tidak ada unit";
                if (unitKerjaDisplay.includes("Sekwil")) {
                    // Ambil bagian sebelum "/"
                    unitKerjaDisplay = unitKerjaDisplay.split("/")[0].trim();
                }
                setProfileUnit(unitKerjaDisplay);
            } catch (error) {
                console.error("Gagal mengambil data profil:", error);
                setProfileName("Gagal Memuat");
                setProfileUnit("Error");
            }
        };

        fetchProfile();
    }, []);
    return (
        // Kontainer utama sidebar dengan lebar tetap

        <div className="flex">
            <div
                className={`fixed flex flex-col gap-3 h-full bg-[#171717] text-white w-64  p-4 z-10 transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            >
                {/* Bagian Header Judul */}
                <div className="text-center">
                    <h1 className="text-2xl font-bold tracking-wider">
                        STATE ASSETS
                    </h1>
                    <p className="text-sm text-gray-400">Management</p>
                </div>

                {/* Bagian Profil Pengguna */}
                <div className="flex flex-col gap-2 items-center">
                    <img
                        src="/Logo_Kehutanan_white.png" // Placeholder untuk gambar profil
                        alt="User Profile"
                        className="w-24 h-24 object-center"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src =
                                "https://placehold.co/100x100/EFEFEF/AAAAAA?text=Error";
                        }}
                    />
                    <h2 className="flex gap-0.5 text-xl text-center font-semibold">
                        {profileName}
                        <SquarePen
                            onClick={handleProfileEdit}
                            className="cursor-pointer w-4 h-4"
                        />
                    </h2>
                    <p className="text-sm text-gray-400">{profileUnit}</p>
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
                                        <span className="ml-4 font-medium">
                                            {item.text}
                                        </span>
                                    </li>
                                </Link>
                            );
                        })}
                    </ul>
                </nav>
            </div>
            <div
                onClick={toggleSidebar}
                className={`${isOpen ? "fixed" : "hidden"} md:hidden ml-64 h-full w-full z-15 text-white`}
            ></div>
        </div>
    );
};

export default Sidebar;
