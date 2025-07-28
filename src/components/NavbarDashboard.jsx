import React from "react";
import { Menu } from "lucide-react";

const NavbarDashboard = ({ toggleSidebar, isSidebarOpen = true }) => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-[#242424] h-16 flex items-center justify-between z-5 shadow-lg px-4">
      <div
        className={`flex items-center transition-all duration-300 ease-in-out ${isSidebarOpen ? "ml-65" : "ml-5"}`}
      >
        <Menu
          className="text-white text-2xl cursor-pointer hover:text-gray-300"
          onClick={toggleSidebar}
        />
      </div>

      <div className="flex items-center gap-4">
        <div className="flex flex-col text-right">
          <span className="text-white font-semibold text-sm">
            Balai Penegakan Hukum Kehutanan
          </span>
          <span className="text-white text-xs">Wilayah Kalimantan</span>
        </div>
        <img
          src="./../../public/Logo_Kehutanan_white.png"
          alt="GAKKUMHUT"
          className="w-10 h-10 rounded-full"
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
