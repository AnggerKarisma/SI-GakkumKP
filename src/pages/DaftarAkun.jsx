import React, { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowUpDown,
    Search,
    UserPlus,
    RefreshCw,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import DataAkun from "../dummy/akun.jsx";
import { getAllUsers } from "../services/userService.js";
// --- KOMPONEN HALAMAN UTAMA ---
const DaftarAkun = ({ isSidebarOpen }) => {
    const navigate = useNavigate();

    const [akunData, setAkunData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const fetchAkunData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const responseData = await getAllUsers();
            // PERUBAHAN 1: Mengambil array dari `responseData.data` sesuai struktur backend baru.
            const usersArray = Array.isArray(responseData?.data)
                ? responseData.data
                : [];
            setAkunData(usersArray);
        } catch (err) {
            const errorMessage =
                err.response?.data?.message || "Gagal memuat data akun.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAkunData();
    }, [fetchAkunData]);

    const handleTambahAkun = () => navigate("/akun/tambah_akun");
    const handleDetailClick = (row) => {
        navigate(`/akun/${row.userID}`, { state: { user: row } });
    };
    const handlePageChange = (page) => setCurrentPage(page);
    const handleItemsPerPageChange = (number) => {
        setItemsPerPage(number);
        setCurrentPage(1);
    };

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * itemsPerPage;
        const lastPageIndex = firstPageIndex + itemsPerPage;
        return akunData.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, itemsPerPage, akunData]);

    const columns = [
        {
            header: "NO",
            accessor: "nomor",
            sortable: false,
            // FIX: Gunakan 'cell' untuk merender nomor urut secara dinamis
            cell: (row, index) => {
                // Hitung nomor urut berdasarkan halaman saat ini dan indeks baris
                return (currentPage - 1) * itemsPerPage + index + 1;
            },
        },
        { header: "Nama", accessor: "nama", sortable: true },
        { header: "NIP", accessor: "NIP", sortable: false },
        { header: "Jabatan", accessor: "jabatan", sortable: true },
        {
            header: "Unit Kerja",
            accessor: "unitKerja",
            sortable: true,
            // Gunakan 'cell' untuk merender tampilan custom
            cell: (row) => {
                const unitKerjaData = row.unitKerja || "";
                const parts = unitKerjaData.split(" / ");
                return parts[0] || ""; // Menampilkan bagian sebelum " / "
            },
        },
        {
            header: "Lokasi",
            accessor: "lokasi", // Accessor buatan untuk kolom baru
            sortable: true,
            // Gunakan 'cell' untuk merender tampilan custom
            cell: (row) => {
                const unitKerjaData = row.unitKerja || "";
                const parts = unitKerjaData.split(" / ");
                return parts[1] || "-"; // Menampilkan bagian setelah " / "
            },
        },
        { header: "Level", accessor: "role", sortable: true },
        {
            header: "Action",
            accessor: "action",
            sortable: false,
            cell: (row) => (
                <div className="flex justify-center font-bold gap-2">
                    <button
                        onClick={() => handleDetailClick(row)}
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
                        <h1 className="text-white font-semibold text-3xl">
                            Daftar Akun
                        </h1>
                    </header>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <Button
                            text="Refresh"
                            icon={<RefreshCw className="w-4 h-4" />}
                            bgColor="bg-gray-600"
                            onClick={fetchAkunData}
                            disabled={isLoading}
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
                                onClick={handleTambahAkun}
                            />
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="text-white text-center py-10">
                            Memuat data...
                        </div>
                    ) : error ? (
                        <div className="text-red-500 text-center py-10">
                            {error}
                        </div>
                    ) : (
                        <>
                            <div className="bg-[#171717] rounded-lg overflow-x-auto custom-scrollbar">
                                <DataTable
                                    columns={columns}
                                    data={currentTableData}
                                />
                            </div>
                            {/* Paginasi baru digunakan di sini */}
                            <Pagination
                                totalItems={akunData.length}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                                onItemsPerPageChange={handleItemsPerPageChange}
                            />
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DaftarAkun;
