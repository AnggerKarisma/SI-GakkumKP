import Sidebar from "./../components/Sidebar";
import NavbarDashboard from "../components/NavbarDashboard";

const TambahMobil = ({ isSidebarOpen = true }) => {
  return (
    <div className="transition-all flex duration-300">
      <Sidebar isOpen={isSidebarOpen} role="admin" />
      <NavbarDashboard isSidebarOpen={isSidebarOpen} />
      <div
        className={`bg-[#171717] pt-20 h-screen transition-all duration-300 ${isSidebarOpen ? "ml-16 md:ml-64 w-[calc(100%-64px)] md:w-[calc(100%-256px)]" : "ml-0 w-full"}`}
      ></div>
    </div>
  );
};

export default TambahMobil;
