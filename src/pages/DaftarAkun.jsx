import { useEffect, useState, useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus, RefreshCw, User } from "lucide-react";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import { getAllUsers } from "../services/userService.js";
import { getProfile } from "../services/authService.js";

// --- KOMPONEN HALAMAN UTAMA ---
const DaftarAkun = ({ isSidebarOpen }) => {
    const navigate = useNavigate();

    const [akunData, setAkunData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentUserRole, setCurrentUserRole] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "ascending",
    });

    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const sortedData = useMemo(() => {
        let sortableItems = [...akunData]; // Menggunakan akunData
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key]) {
                    return sortConfig.direction === "ascending" ? -1 : 1;
                }
                if (a[sortConfig.key] > b[sortConfig.key]) {
                    return sortConfig.direction === "ascending" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [akunData, sortConfig]);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setSortConfig({
            key: null,
            direction: "ascending",
        });
        try {
            const [profileResponse, usersResponse] = await Promise.all([
                getProfile(),
                getAllUsers(),
            ]);

            setCurrentUserRole(profileResponse.data.role);

            const usersArray = Array.isArray(usersResponse?.data)
                ? usersResponse.data
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
        fetchData();
    }, [fetchData]);

    const handleTambahAkun = () => navigate("/akun/tambah_akun");
    const handleMyAcc = () => navigate("/profile");
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
        return sortedData.slice(firstPageIndex, lastPageIndex); 
    }, [currentPage, itemsPerPage, sortedData]);

    const columns = [
        {
            header: "NO",
            accessor: "nomor",
            sortable: false,
            cell: (row, index) => {
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
            cell: (row) => {
                const unitKerjaData = row.unitKerja || "";
                const parts = unitKerjaData.split(" / ");
                return parts[0] || ""; 
            },
        },
        {
            header: "Lokasi",
            accessor: "lokasi", 
            sortable: false,
            cell: (row) => {
                const unitKerjaData = row.unitKerja || "";
                const parts = unitKerjaData.split(" / ");
                return parts[1] || "-";
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
                        <div className="flex gap-2">
                            <Button
                                text="Refresh"
                                icon={<RefreshCw className="w-4 h-4" />}
                                bgColor="bg-gray-600"
                                onClick={fetchData}
                                disabled={isLoading}
                            />
                            <Button
                                text="Akun Saya"
                                icon={<User className="w-4 h-4" />}
                                bgColor="bg-[#1f4f27]"
                                onClick={handleMyAcc}
                                disabled={isLoading}
                            />
                        </div>
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            {currentUserRole === "Super Admin" && (
                                <Button
                                    text="Akun"
                                    icon={<UserPlus className="w-4 h-4" />}
                                    bgColor="bg-[#1f4f27]"
                                    onClick={handleTambahAkun}
                                />
                            )}
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
                                    sortConfig={sortConfig} // Menambahkan prop sortConfig
                                    onSort={handleSort} // Menambahkan prop onSort
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
