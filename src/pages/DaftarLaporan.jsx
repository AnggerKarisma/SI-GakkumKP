import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowUpDown,
  Search,
  SquareArrowOutUpLeft,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Button from "../components/Button.jsx";
import DataTable from "../components/DataTable.jsx";
import Pagination from "../components/Pagination.jsx";
import DataLaporan from "../dummy/laporan.jsx";

// --- KOMPONEN HALAMAN UTAMA ---
const DaftarLaporan = ({ isSidebarOpen=false }) => {
  const navigate = useNavigate();
  const [laporanData] = useState(DataLaporan);
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
    return laporanData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, itemsPerPage, laporanData]);

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
    { header: "Nama Mobil", accessor: "nama_mobil", sortable: true },
    { header: "Plat", accessor: "plat", sortable: true },
    { header: "Merk", accessor: "merk", sortable: true },
    { header: "Lokasi Barang", accessor: "lokasi_barang", sortable: true },
    { header: "Unit Kerja", accessor: "unit_kerja", sortable: true },
    { header: "Penanggung Jawab", accessor: "penanggung_jawab", sortable: true },
    { header: "Peminjam", accessor: "peminjam", sortable: true },
    { header: "Tanggal Pinjam", accessor: "tgl_pinjam", sortable: true },
    { header: "Rencana Kembali",accessor: "rencana_kembali",sortable: true,},
    { header: "Tanggal Kembali", accessor: "tgl_kembali", sortable: true },
    { header: "Kondisi", accessor: "kondisi", sortable: true },
    { header: "Status", accessor: "status", sortable: true },
  ];

  return (
    <div className="flex">
      <div
        className={`bg-[#242424] min-h-screen pt-16 w-full transition-all duration-300 overflow-hidden ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}
      >
        <div className="flex flex-col gap-4 p-4">
          <header>
            <h1 className="text-white font-semibold text-3xl">
              Laporan
            </h1>
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
                text="Export"
                icon={<SquareArrowOutUpLeft className="w-4 h-4" />}
                bgColor="bg-[#1f4f27]"
              />
            </div>
          </div>
          <div></div>
          <div className="bg-[#171717] rounded-lg overflow-x-auto custom-scrollbar">
            {/* DataTable sekarang akan menerima index untuk rendering nomor */}
            <DataTable columns={columns} data={currentTableData} />
          </div>
          <Pagination
            totalItems={laporanData.length}
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

export default DaftarLaporan;
