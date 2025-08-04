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
    id: "pajak-001",
    plat: "KT 4532 XC",
    merk: "Toyota Fortuner",
    jenis: "Mobil PPLH",
    penanggung_jawab: "Adi",
    tahun_registrasi: "2020",
    berlaku_sampai: "25-08-2025",
    biaya: "Rp 4.500.000",  
    status_pembayaran: "Lunas",
  },
  {
    id: "pajak-002",
    plat: "KT 3210 CB",
    merk: "Toyota AE86",
    jenis: "Mobil PPLH",
    penanggung_jawab: "Eri",
    tahun_registrasi: "2018",
    berlaku_sampai: "10-03-2024",
    biaya: "Rp 3.200.000",
    status_pembayaran: "Belum Lunas",
  },
  {
    id: "pajak-003",
    plat: "KT 9052 BV",
    merk: "Nissan GTR",
    jenis: "Mobil PPLH",
    penanggung_jawab: "Kano",
    tahun_registrasi: "2022",
    berlaku_sampai: "15-11-2026",
    biaya: "Rp 15.000.000",
    status_pembayaran: "Lunas",
  },
  {
    id: "pajak-004",
    plat: "KT 1111 AA",
    merk: "Honda Civic",
    jenis: "Sedan",
    penanggung_jawab: "Budi",
    tahun_registrasi: "2021",
    berlaku_sampai: "01-01-2026",
    biaya: "Rp 3.800.000",
    status_pembayaran: "Lunas",
  },
  {
    id: "pajak-005",
    plat: "KT 2222 BB",
    merk: "Mitsubishi Pajero",
    jenis: "SUV",
    penanggung_jawab: "Citra",
    tahun_registrasi: "2019",
    berlaku_sampai: "20-07-2024",
    biaya: "Rp 5.500.000",
    status_pembayaran: "Belum Lunas",
  },
  {
    id: "pajak-006",
    plat: "KT 3333 CC",
    merk: "Suzuki Ertiga",
    jenis: "MPV",
    penanggung_jawab: "Dedi",
    tahun_registrasi: "2023",
    berlaku_sampai: "05-05-2028",
    biaya: "Rp 2.800.000",
    status_pembayaran: "Lunas",
  },
  {
    id: "pajak-007",
    plat: "KT 4444 DD",
    merk: "Daihatsu Terios",
    jenis: "SUV",
    penanggung_jawab: "Fani",
    tahun_registrasi: "2020",
    berlaku_sampai: "12-09-2025",
    biaya: "Rp 3.100.000",
    status_pembayaran: "Lunas",
  },
  {
    id: "pajak-008",
    plat: "KT 5555 EE",
    merk: "Wuling Almaz",
    jenis: "SUV",
    penanggung_jawab: "Gita",
    tahun_registrasi: "2022",
    berlaku_sampai: "30-06-2027",
    biaya: "Rp 4.200.000",
    status_pembayaran: "Lunas",
  },
  {
    id: "pajak-009",
    plat: "KT 6666 FF",
    merk: "Hyundai Creta",
    jenis: "SUV",
    penanggung_jawab: "Hadi",
    tahun_registrasi: "2023",
    berlaku_sampai: "18-02-2028",
    biaya: "Rp 4.000.000",
    status_pembayaran: "Lunas",
  },
  {
    id: "pajak-010",
    plat: "KT 7777 GG",
    merk: "Mazda CX-5",
    jenis: "SUV",
    penanggung_jawab: "Ina",
    tahun_registrasi: "2021",
    berlaku_sampai: "22-10-2026",
    biaya: "Rp 6.000.000",
    status_pembayaran: "Lunas",
  },
];

// --- KOMPONEN HALAMAN UTAMA ---
const DaftarPajak = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const [pajakData] = useState(mockData);
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
