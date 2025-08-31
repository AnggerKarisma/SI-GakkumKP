import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpDown,
  Search,
  UserPlus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "../components/Button.jsx";
import DataTable from "../components/DataTable.jsx";
import Pagination from "../components/Pagination.jsx";
import DataAkun from "../dummy/akun.jsx";

// --- KOMPONEN HALAMAN UTAMA ---
const DaftarAkun = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const [akunData] = useState(DataAkun);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleTambahMotor = () => navigate("/akun/tambah_akun");
  const handleDetailClick = (id) => navigate(`/akun/${id}`)
  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (number) => {
    setItemsPerPage(number);
    setCurrentPage(1); // Reset ke halaman pertama saat item per halaman berubah
  };

  // Logika untuk memotong data sesuai halaman saat ini
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return akunData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, itemsPerPage, akunData]);

  const columns = [
    {
      header: "NO",
      accessor: "nomor", // Accessor bisa apa saja, karena kita akan render custom
      sortable: false,
      // FIX: Gunakan 'cell' untuk merender nomor urut secara dinamis
      cell: (row, index) => {
        // Hitung nomor urut berdasarkan halaman saat ini dan indeks baris
        return (currentPage - 1) * itemsPerPage + index + 1;
      },
    },
    { header: "Nama", accessor: "nama", sortable: true },
    { header: "NIP", accessor: "nip", sortable: false },
    { header: "Jabatan", accessor: "jabatan", sortable: true },
    { header: "Unit Kerja", accessor: "unit_kerja", sortable: true },
    { header: "Lokasi", accessor: "lokasi", sortable: true },
    { header: "Username", accessor: "username", sortable: true },
    { header: "Level", accessor: "level", sortable: true },
    {
      header: "Action",
      accessor: "action",
      sortable: false,
      cell: (row) => (
        <div className="flex justify-center font-bold gap-2">
          <button
            onClick={() => handleDetailClick(row.id)}
            className="min-w-14 text-white bg-blue-500 px-2 py-1 rounded-xl cursor-pointer"
          >
            Detail
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex">
      <div
        className={`bg-[#242424] min-h-screen pt-16 w-full transition-all duration-300 overflow-hidden ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}
      >
        <div className="flex flex-col gap-4 p-4">
          <header>
            <h1 className="text-white font-semibold text-3xl">Daftar Akun</h1>
          </header>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Button
              text="Refresh"
              icon={<RefreshCw className="w-4 h-4" />}
              bgColor="bg-gray-600"
            />
            <div className="flex items-center gap-2 w-full md:w-auto">
              <div className="relative w-full md:w-64">
                <input
                  type="text"
                  placeholder="Cari..."
                  className="bg-[#171717] text-white border-2 border-gray-600 rounded-lg py-2 pl-4 pr-10 w-full focus:outline-none focus:border-green-700"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              <Button
                text="Akun"
                icon={<UserPlus className="w-4 h-4" />}
                bgColor="bg-[#1f4f27]"
                onClick={handleTambahMotor}
              />
            </div>
          </div>
          <div className="bg-[#171717] rounded-lg overflow-x-auto custom-scrollbar">
            <DataTable columns={columns} data={currentTableData} />
          </div>
          {/* Paginasi baru digunakan di sini */}
          <Pagination
            totalItems={akunData.length}
            itemsPerPage={itemsPerPage}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </div>
    </div>
  );
};

export default DaftarAkun;
