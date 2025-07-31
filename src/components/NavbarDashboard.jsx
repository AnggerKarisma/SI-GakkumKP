import React from "react";
import { Menu } from "lucide-react";

const NavbarDashboard = ({ toggleSidebar, isSidebarOpen }) => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-[#171717] h-16 flex items-center justify-between z-5 shadow-md px-4">
      <div className={`flex items-center`}>
        <Menu
          className={`text-white text-2xl cursor-pointer hover:text-gray-300 transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-3"}`}
          onClick={toggleSidebar}
        />
      </div>

      <div className="flex items-center gap-4">
        <div
          className={`hidden md:flex flex-col text-right transition-opacity duration-50`}
        >
          <span className="text-white font-semibold text-sm">
            Balai Penegakan Hukum Kehutanan
          </span>
          <span className="text-white text-xs">Wilayah Kalimantan</span>
        </div>
        <img
          src="/Logo_Kehutanan_white.png"
          alt="GAKKUMHUT"
          className={`w-10 h-10 rounded-full transition-opacity duration-300 ${isSidebarOpen ? "opacity-0 md:opacity-100" : "opacity-100"}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src =
              "https://placehold.co/40x40/EFEFEF/AAAAAA?text=Error";
          }}
        />
      </div>
    </nav>
  );
};

export default NavbarDashboard;
