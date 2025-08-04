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

// --- DATA CONTOH ---
// Setiap item sekarang memiliki 'id' unik dan properti 'no' dihilangkan
const mockData = [
  {
    id: "pinjam-001",
    plat: "KT 4532 XC",
    merk: "Toyota Fortuner",
    tgl_pinjam: "01-08-2025",
    rencana_kembali: "08-08-2025",
    tgl_kembali: null, // Masih dipinjam
    peminjam: "Dodi",
    status: "Dipinjam",
  },
  {
    id: "pinjam-002",
    plat: "KT 3210 CB",
    merk: "Toyota AE86",
    tgl_pinjam: "15-07-2025",
    rencana_kembali: "20-07-2025",
    tgl_kembali: "20-07-2025",
    peminjam: "Bob",
    status: "Dikembalikan",
  },
  {
    id: "pinjam-003",
    plat: "KT 9052 BV",
    merk: "Nissan GTR",
    tgl_pinjam: "25-07-2025",
    rencana_kembali: "28-07-2025",
    tgl_kembali: null,
    peminjam: "Deni",
    status: "Terlambat",
  },
  {
    id: "pinjam-004",
    plat: "KT 1111 AA",
    merk: "Honda Civic",
    tgl_pinjam: "02-08-2025",
    rencana_kembali: "05-08-2025",
    tgl_kembali: null,
    peminjam: "Toni",
    status: "Dipinjam",
  },
  {
    id: "pinjam-005",
    plat: "KT 2222 BB",
    merk: "Mitsubishi Pajero",
    tgl_pinjam: "10-06-2025",
    rencana_kembali: "15-06-2025",
    tgl_kembali: "15-06-2025",
    peminjam: "Bob",
    status: "Dikembalikan",
  },
  {
    id: "pinjam-006",
    plat: "KT 3333 CC",
    merk: "Suzuki Ertiga",
    tgl_pinjam: "20-07-2025",
    rencana_kembali: "25-07-2025",
    tgl_kembali: "25-07-2025",
    peminjam: "Deni",
    status: "Dikembalikan",
  },
  {
    id: "pinjam-007",
    plat: "KT 4444 DD",
    merk: "Daihatsu Terios",
    tgl_pinjam: "28-07-2025",
    rencana_kembali: "01-08-2025",
    tgl_kembali: null,
    peminjam: "Joko",
    status: "Terlambat",
  },
  {
    id: "pinjam-008",
    plat: "KT 5555 EE",
    merk: "Wuling Almaz",
    tgl_pinjam: "03-08-2025",
    rencana_kembali: "10-08-2025",
    tgl_kembali: null,
    peminjam: "Yoga",
    status: "Dipinjam",
  },
  {
    id: "pinjam-009",
    plat: "KT 6666 FF",
    merk: "Hyundai Creta",
    tgl_pinjam: "11-07-2025",
    rencana_kembali: "14-07-2025",
    tgl_kembali: "14-07-2025",
    peminjam: "Toni",
    status: "Dikembalikan",
  },
  {
    id: "pinjam-010",
    plat: "KT 7777 GG",
    merk: "Mazda CX-5",
    tgl_pinjam: "01-08-2025",
    rencana_kembali: "07-08-2025",
    tgl_kembali: null,
    peminjam: "Yono",
    status: "Dipinjam",
  },
];

// --- KOMPONEN HALAMAN UTAMA ---
const DaftarPeminjaman = ({ isSidebarOpen=false }) => {
  const navigate = useNavigate();
  const [peminjamanData] = useState(mockData);
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
    return peminjamanData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, itemsPerPage, peminjamanData]);

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
    { header: "Plat", accessor: "plat", sortable: true },
    { header: "Merk", accessor: "merk", sortable: true },
    { header: "Peminjam", accessor: "peminjam", sortable: true },
    { header: "Tanggal Pinjam", accessor: "tgl_pinjam", sortable: true },
    {
      header: "Rencana Kembali",
      accessor: "rencana_kembali",
      sortable: true,
    },
    { header: "Tanggal Kembali", accessor: "tgl_kembali", sortable: true },
    { header: "Status", accessor: "status", sortable: true },
    {
      header: "Action",
      accessor: "action",
      sortable: false,
      cell: (row) => (
        <div className="flex justify-center font-bold gap-2">
          <button
            disabled={row.status === "Dikembalikan"}
            className="text-green-400 hover:underline disabled:text-gray-500 cursor-pointer disabled:cursor-not-allowed disabled:no-underline"
          >
            Kembalikan
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
            <h1 className="text-white font-semibold text-3xl">Daftar Peminjaman</h1>
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
          <div></div>
          <div className="bg-[#171717] rounded-lg overflow-x-auto custom-scrollbar">
            {/* DataTable sekarang akan menerima index untuk rendering nomor */}
            <DataTable columns={columns} data={currentTableData} />
          </div>
          <Pagination
            totalItems={peminjamanData.length}
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

export default DaftarPeminjaman;
