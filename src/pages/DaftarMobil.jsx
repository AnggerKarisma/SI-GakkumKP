import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpDown, Search, Plus, RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../components/Button"; 
import DataTable from "../components/DataTable.jsx";
import Pagination from "../components/Pagination.jsx";

// --- DATA CONTOH ---
// Data diperbanyak menjadi 10 item
const mockData = [
  {
    no: 1,
    plat: "KT 4532 XC",
    merk: "Toyota Fortuner",
    jenis: "Mobil PPLH",
    penanggung_jawab: "Adi",
    lokasi: "Balikpapan",
    kondisi: "Baik",
    nup: "343432",
    status: "Ready",
  },
  {
    no: 2,
    plat: "KT 3210 CB",
    merk: "Toyota AE86",
    jenis: "Mobil PPLH",
    penanggung_jawab: "Eri",
    lokasi: "Samarinda",
    kondisi: "Rusak",
    nup: "23232",
    status: "Used",
  },
  {
    no: 3,
    plat: "KT 9052 BV",
    merk: "Nissan GTR",
    jenis: "Mobil PPLH",
    penanggung_jawab: "Kano",
    lokasi: "PPU",
    kondisi: "Baik",
    nup: "32323",
    status: "Unready",
  },
  {
    no: 4,
    plat: "KT 1111 AA",
    merk: "Honda Civic",
    jenis: "Sedan",
    penanggung_jawab: "Budi",
    lokasi: "Banjarmasin",
    kondisi: "Baik",
    nup: "454545",
    status: "Ready",
  },
  {
    no: 5,
    plat: "KT 2222 BB",
    merk: "Mitsubishi Pajero",
    jenis: "SUV",
    penanggung_jawab: "Citra",
    lokasi: "Balikpapan",
    kondisi: "Baik",
    nup: "565656",
    status: "Used",
  },
  {
    no: 6,
    plat: "KT 3333 CC",
    merk: "Suzuki Ertiga",
    jenis: "MPV",
    penanggung_jawab: "Dedi",
    lokasi: "Samarinda",
    kondisi: "Baik",
    nup: "676767",
    status: "Ready",
  },
  {
    no: 7,
    plat: "KT 4444 DD",
    merk: "Daihatsu Terios",
    jenis: "SUV",
    penanggung_jawab: "Fani",
    lokasi: "PPU",
    kondisi: "Rusak",
    nup: "787878",
    status: "Unready",
  },
  {
    no: 8,
    plat: "KT 5555 EE",
    merk: "Wuling Almaz",
    jenis: "SUV",
    penanggung_jawab: "Gita",
    lokasi: "Balikpapan",
    kondisi: "Baik",
    nup: "898989",
    status: "Ready",
  },
  {
    no: 9,
    plat: "KT 6666 FF",
    merk: "Hyundai Creta",
    jenis: "SUV",
    penanggung_jawab: "Hadi",
    lokasi: "Banjarmasin",
    kondisi: "Baik",
    nup: "909090",
    status: "Used",
  },
  {
    no: 10,
    plat: "KT 7777 GG",
    merk: "Mazda CX-5",
    jenis: "SUV",
    penanggung_jawab: "Ina",
    lokasi: "Samarinda",
    kondisi: "Baik",
    nup: "121212",
    status: "Ready",
  },
];

// --- KOMPONEN HALAMAN UTAMA ---
const DaftarMobil = ({ isSidebarOpen }) => {
  const navigate = useNavigate();
  const [mobilData] = useState(mockData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const handleTambahMobil = () => navigate("/mobil/tambah_mobil");
  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (number) => {
    setItemsPerPage(number);
    setCurrentPage(1); // Reset ke halaman pertama saat item per halaman berubah
  };

  // Logika untuk memotong data sesuai halaman saat ini
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return mobilData.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, itemsPerPage, mobilData]);

  const columns = [
    { header: "NO", accessor: "no", sortable: false },
    { header: "Plat", accessor: "plat", sortable: true },
    { header: "Merk", accessor: "merk", sortable: true },
    { header: "Jenis", accessor: "jenis", sortable: true },
    {
      header: "Penanggung Jawab",
      accessor: "penanggung_jawab",
      sortable: false,
    },
    { header: "Lokasi", accessor: "lokasi", sortable: true },
    { header: "Kondisi", accessor: "kondisi", sortable: true },
    { header: "NUP", accessor: "nup", sortable: true },
    { header: "Status", accessor: "status", sortable: true },
    {
      header: "Action",
      accessor: "action",
      sortable: false,
      cell: (row) => (
        <div className="flex justify-center gap-2">
          <button className="text-blue-400 hover:underline">Detail</button>
          {row.status === "Ready" && (
            <button className="text-green-400 hover:underline">Pinjam</button>
          )}
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
            <h1 className="text-white font-semibold text-3xl">Daftar Mobil</h1>
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
                text="Mobil"
                icon={<Plus className="w-4 h-4" />}
                bgColor="bg-[#1f4f27]"
                onClick={handleTambahMobil}
              />
            </div>
          </div>
          <div className="bg-[#171717] rounded-lg overflow-x-auto custom-scrollbar">
            <DataTable columns={columns} data={currentTableData} />
          </div>
          {/* Paginasi baru digunakan di sini */}
          <Pagination
            totalItems={mobilData.length}
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

export default DaftarMobil;
