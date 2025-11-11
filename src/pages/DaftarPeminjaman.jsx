import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, RefreshCw } from "lucide-react";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import ReturnModal from "../components/ReturnModal";
import SuccessModal from "../components/SuccessModal";

// 1. Impor getProfile bersama dengan service peminjaman
import { getAllBorrows, returnVehicle } from "../services/borrowService";
import { getProfile } from "../services/authService";

const DaftarPeminjaman = ({ isSidebarOpen = false }) => {
    const navigate = useNavigate();

    const [peminjamanData, setPeminjamanData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    // 2. State untuk menyimpan data pengguna yang login (untuk logika UI)
    const [currentUser, setCurrentUser] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "ascending",
    });

    const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [selectedBorrow, setSelectedBorrow] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // 3. Modifikasi fetchData untuk mengambil data profil dan peminjaman
    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Ambil data profil dan data peminjaman secara bersamaan
            const [profileResponse, borrowsResponse] = await Promise.all([
                getProfile(),
                getAllBorrows(),
            ]);

            setCurrentUser(profileResponse.data); // Simpan data profil
            const borrowArray = Array.isArray(borrowsResponse?.data)
                ? borrowsResponse.data
                : [];

            // Flatten data sesuai struktur response backend
            const flattenedData = borrowArray.map((item) => ({
                ...item,
                pinjamID: item.pinjamID,
                plat: item.kendaraan?.plat || "-",
                namaKendaraan: item.kendaraan?.namaKendaraan || "-",
                nama: item.user?.nama || "-",
                tglPinjam: item.tglPinjam,
                tglJatuhTempo: item.tglJatuhTempo,
                tglKembaliAktual: item.tglKembaliAktual,
                // Status ditentukan dari tglKembaliAktual
                is_returned: !!item.tglKembaliAktual,
                is_overdue:
                    !item.tglKembaliAktual &&
                    new Date(item.tglJatuhTempo) < new Date(),
                is_active:
                    !item.tglKembaliAktual &&
                    new Date(item.tglJatuhTempo) >= new Date(),
            }));

            setPeminjamanData(flattenedData);
        } catch (err) {
            setError("Gagal memuat data peminjaman.");
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleSort = (key) => {
        let direction = "ascending";
        if (sortConfig.key === key && sortConfig.direction === "ascending") {
            direction = "descending";
        }
        setSortConfig({ key, direction });
    };

    const handlePageChange = (page) => setCurrentPage(page);
    const handleItemsPerPageChange = (number) => {
        setItemsPerPage(number);
        setCurrentPage(1);
    };

    const handleKembalikanClick = (borrowRecord) => {
        setSelectedBorrow(borrowRecord);
        setIsReturnModalOpen(true);
    };

    const handleReturnSubmit = async () => {
        if (!selectedBorrow) return;
        setIsSubmitting(true);
        try {
            await returnVehicle(selectedBorrow.pinjamID);
            setIsReturnModalOpen(false);
            setIsSuccessModalOpen(true);
            fetchData();
        } catch (err) {
            setError(
                err.response?.data?.message || "Gagal mengembalikan kendaraan.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccessModalClose = () => {
        setIsSuccessModalOpen(false);
        setSelectedBorrow(null);
    };

    // 4. Logika sorting sekarang berjalan langsung pada data yang diterima
    const sortedData = useMemo(() => {
        let sortableItems = [...peminjamanData];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                const valA = a[sortConfig.key];
                const valB = b[sortConfig.key];

                if (valA < valB)
                    return sortConfig.direction === "ascending" ? -1 : 1;
                if (valA > valB)
                    return sortConfig.direction === "ascending" ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [peminjamanData, sortConfig]);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * itemsPerPage;
        const lastPageIndex = firstPageIndex + itemsPerPage;
        return sortedData.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, itemsPerPage, sortedData]);

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const columns = [
        {
            header: "NO",
            cell: (row, index) => (currentPage - 1) * itemsPerPage + index + 1,
        },
        {
            header: "Plat",
            accessor: "plat",
            sortable: true,
        },
        {
            header: "Nama Kendaraan",
            accessor: "namaKendaraan",
            sortable: true,
        },
        {
            header: "Peminjam",
            accessor: "nama",
            sortable: true,
        },
        {
            header: "Tanggal Pinjam",
            accessor: "tglPinjam",
            sortable: true,
            cell: (row) => formatDate(row.tglPinjam),
        },
        {
            header: "Jatuh Tempo",
            accessor: "tglJatuhTempo",
            sortable: true,
            cell: (row) => formatDate(row.tglJatuhTempo),
        },
        {
            header: "Tanggal Kembali",
            accessor: "tglKembaliAktual",
            sortable: true,
            cell: (row) => formatDate(row.tglKembaliAktual),
        },
        {
            header: "Status",
            accessor: "is_returned",
            sortable: true,
            cell: (row) => {
                if (row.is_returned) return "Dikembalikan";
                if (row.is_overdue) return "Terlambat";
                if (row.is_active) return "Dipinjam";
                return "Status Tidak Dikenal";
            },
        },
        {
            header: "Action",
            cell: (row) => {
                // 5. Logika tombol disesuaikan, hanya aktif jika user ID cocok
                const isOwner = currentUser?.userID === row.userID;
                const isReturned = row.is_returned;
                const isDisabled = isReturned || isSubmitting || !isOwner;

                return (
                    <div className="flex justify-center font-bold gap-2">
                        <button
                            onClick={() => handleKembalikanClick(row)}
                            disabled={isDisabled}
                            className="min-w-14 bg-blue-500 text-white px-2 py-1 rounded-xl cursor-pointer disabled:bg-gray-600 disabled:cursor-not-allowed"
                        >
                            Kembalikan
                        </button>
                    </div>
                );
            },
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
                            Data Peminjaman
                        </h1>
                    </header>
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <Button
                            text="Refresh"
                            icon={<RefreshCw className="w-4 h-4" />}
                            bgColor="bg-gray-600"
                            onClick={fetchData}
                            disabled={isLoading}
                        />
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
                                    sortConfig={sortConfig}
                                    onSort={handleSort}
                                />
                            </div>
                            <Pagination
                                totalItems={sortedData.length}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                onPageChange={handlePageChange}
                                onItemsPerPageChange={handleItemsPerPageChange}
                            />
                        </>
                    )}
                </div>
            </div>
            <ReturnModal
                isOpen={isReturnModalOpen}
                onClose={() => setIsReturnModalOpen(false)}
                onSubmit={handleReturnSubmit}
                borrowData={selectedBorrow}
                isLoading={isSubmitting}
            />
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleSuccessModalClose}
                title="Berhasil Dikembalikan!"
                message={`Kendaraan ${selectedBorrow?.kendaraan?.namaKendaraan} telah ditandai sebagai dikembalikan.`}
            />
        </div>
    );
};

export default DaftarPeminjaman;
