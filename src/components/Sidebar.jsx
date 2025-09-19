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
    LogOut,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { getProfile, logout } from "../services/authService";

// Daftar menu dipisahkan untuk kemudahan pengelolaan di masa depan
const menuItems = [
    { path: "/dashboard", icon: <Home />, text: "Dashboard" },
    { path: "/peminjaman", icon: <BookUser />, text: "Data Peminjaman" },
    { path: "/mobil", icon: <CarFront />, text: "Mobil" },
    { path: "/motor", icon: <Bike />, text: "Motor" },
    { path: "/pajak", icon: <ReceiptText />, text: "Pajak" },
    { path: "/laporan", icon: <FileChartLine />, text: "Laporan", adminOnly:true},
    { path: "/akun", icon: <Users />, text: "Daftar Akun", adminOnly:true },
];

const Sidebar = ({ toggleSidebar, isOpen, role }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [profileName, setProfileName] = useState("Memuat...");
    const [profileUnit, setProfileUnit] = useState("...");
    const [profileRole, setProfileRole] = useState("User");

    const handleProfileEdit = () => {
        navigate("/profile");
    };

    const handleLogout = async () => {
        try {
            await logout();
            localStorage.removeItem("authToken");
            navigate("/login");
        } catch (error) {
            localStorage.removeItem("authToken");
            console.error("Logout gagal:", error);
        }
    };

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await getProfile();
                const userData = response.data;

                setProfileName(userData.nama || "Tanpa Nama");
                setProfileRole(userData.role);

                let unitKerjaDisplay = userData.unitKerja || "Tidak ada unit";
                if (unitKerjaDisplay.includes("Sekwil")) {
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

    const visibleMenuItems = menuItems.filter((item) => {
        // Jika item tidak ditandai 'adminOnly', selalu tampilkan
        if (!item.adminOnly) {
            return true;
        }
        // Jika item ditandai 'adminOnly', hanya tampilkan jika role BUKAN 'user'
        return profileRole !== "User";
    });
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
                        alt="GAKKUMHUT KALIMANTAN"
                        className="w-20 h-20 object-center"
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
                <nav className="flex-col mt-4 flex-grow overflow-y-auto custom-scrollbar">
                    <ul>
                        {visibleMenuItems.map((item) => {
                            const isActive = (() => {
                                if (item.path === "/dashboard") {
                                    return location.pathname === item.path;
                                }
                                if (item.path === "/akun") {
                                    return (
                                        location.pathname.startsWith(
                                            item.path,
                                        ) || location.pathname.startsWith("/profile")
                                    );
                                }
                                return location.pathname.startsWith(item.path);
                            })();
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
                <div className="mt-auto">
                    <div
                        onClick={handleLogout}
                        className="flex items-center my-1 px-3 py-2 rounded-3xl cursor-pointer transition-colors duration-200 hover:bg-red-800/50"
                    >
                        <LogOut />
                        <span className="ml-4 font-medium">Logout</span>
                    </div>
                </div>
            </div>
            <div
                onClick={toggleSidebar}
                className={`${isOpen ? "fixed" : "hidden"} md:hidden ml-64 h-full w-full z-15 text-white`}
            ></div>
        </div>
    );
};

export default Sidebar;
