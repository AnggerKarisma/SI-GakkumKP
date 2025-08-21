import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpDown,
  Search,
  Plus,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "../components/Button.jsx";
import DataTable from "../components/DataTable.jsx";
import Pagination from "../components/Pagination.jsx";
import DataPajak from "../dummy/pajak.jsx";


// --- KOMPONEN HALAMAN UTAMA ---
const DaftarPajak = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const [pajakData] = useState(DataPajak);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (number) => {
    setItemsPerPage(number);
    setCurrentPage(1); // Reset ke halaman pertama saat item per halaman berubah
  };

  // Logika untuk memotong data sesuai halaman saat ini
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return pajakData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, itemsPerPage, pajakData]);

  const columns = [
    {
      header: "NO",
      accessor: "nomor",
      sortable: false,
      cell: (row, index) => {
        return (currentPage - 1) * itemsPerPage + index + 1;
      },
    },
    { header: "Plat", accessor: "plat", sortable: true },
    { header: "Merk", accessor: "merk", sortable: true },
    { header: "Jenis", accessor: "jenis", sortable: true },
    {
      header: "Penanggung Jawab",
      accessor: "penanggung_jawab",
      sortable: false,
    },
    {
      header: "Tahun Registrasi",
      accessor: "tahun_registrasi",
      sortable: true,
    },
    { header: "Berlaku Sampai", accessor: "berlaku_sampai", sortable: true },
    { header: "Biaya", accessor: "biaya", sortable: true },
    {
      header: "Action",
      accessor: "action",
      sortable: false,
      cell: (row) => (
        <div className="flex justify-center font-bold gap-2">
          {/* <button className="text-blue-400 hover:underline cursor-pointer">
            Detail
          </button> */}
          <button className="text-green-400 hover:underline disabled:text-gray-500 cursor-pointer disabled:cursor-not-allowed disabled:no-underline">
            Proses
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
            <h1 className="text-white font-semibold text-3xl">Daftar Pajak</h1>
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
            </div>
          </div>
          <div className="bg-[#171717] rounded-lg overflow-x-auto custom-scrollbar">
            {/* DataTable sekarang akan menerima index untuk rendering nomor */}
            <DataTable columns={columns} data={currentTableData} />
          </div>
          <Pagination
            totalItems={pajakData.length}
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

export default DaftarPajak;
