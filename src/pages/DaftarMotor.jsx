import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, RefreshCw } from "lucide-react";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import SuccessModal from "../components/SuccessModal";
import BorrowModal from "../components/BorrowModal";

// Impor semua service yang dibutuhkan
import { getAllVehicles } from "../services/vehicleService";
import { getProfile } from "../services/authService";
import { createBorrow } from "../services/borrowService";

const DaftarMotor = ({ isSidebarOpen = false }) => {
    const navigate = useNavigate();

    const [allVehicles, setAllVehicles] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [currentUserRole, setCurrentUserRole] = useState(null);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "ascending",
    });

    // State untuk manajemen modal
    const [isBorrowModalOpen, setIsBorrowModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setSortConfig({
            key: null,
            direction: "ascending",
        });
        try {
            const [profileResponse, vehiclesResponse] = await Promise.all([
                getProfile(),
                getAllVehicles(),
            ]);
            setCurrentUserRole(profileResponse.data.role);
            const vehiclesArray = Array.isArray(vehiclesResponse?.data)
                ? vehiclesResponse.data
                : [];
            setAllVehicles(vehiclesArray);
        } catch (err) {
            setError("Gagal memuat data.");
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

    const handleTambahMotor = () => navigate("/motor/tambah_motor");
    const handleDetailClick = (id) => navigate(`/motor/${id}`);

    // Fungsi untuk membuka modal peminjaman
    const handlePinjamClick = (vehicle) => {
        setSelectedVehicle(vehicle);
        setIsBorrowModalOpen(true);
    };

    // Fungsi untuk mengirim data peminjaman dari modal
    const handleBorrowSubmit = async (borrowFormData) => {
        if (!selectedVehicle) return;
        setIsSubmitting(true);
        setError(null);
        try {
            // PERUBAHAN: Menyesuaikan nama field agar cocok dengan backend
            const payload = {
                kendaraanID: selectedVehicle.kendaraanID,
                keterangan: borrowFormData.keterangan,
                tglPinjam: borrowFormData.tanggal_pinjam, // Sesuaikan nama field
                tglJatuhTempo: borrowFormData.rencana_kembali, // Ubah 'rencana_kembali' menjadi 'tglJatuhTempo'
            };
            await createBorrow(payload);
            setIsBorrowModalOpen(false); // Tutup modal pinjam
            setIsSuccessModalOpen(true); // Buka modal sukses
            fetchData(); // Muat ulang data untuk update status kendaraan
        } catch (err) {
            alert(
                "Gagal memproses peminjaman: " +
                    (err.response?.data?.message || err.message),
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleSuccessModalClose = () => {
        setIsSuccessModalOpen(false);
        setSelectedVehicle(null);
    };

    const sortedAndFilteredData = useMemo(() => {
        // ... (logika sorting dan filtering tetap sama)
        let filteredItems = allVehicles.filter(
            (v) => v.jenisKendaraan === "motor",
        );
        if (sortConfig.key) {
            filteredItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key])
                    return sortConfig.direction === "ascending" ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key])
                    return sortConfig.direction === "ascending" ? 1 : -1;
                return 0;
            });
        }
        return filteredItems;
    }, [allVehicles, sortConfig]);

    const currentTableData = useMemo(() => {
        const first = (currentPage - 1) * itemsPerPage;
        return sortedAndFilteredData.slice(first, first + itemsPerPage);
    }, [currentPage, itemsPerPage, sortedAndFilteredData]);

    const columns = [
        // ... (definisi kolom lain tetap sama)
        {
            header: "NO",
            cell: (row, index) => (currentPage - 1) * itemsPerPage + index + 1,
        },
        { header: "Plat", accessor: "plat", sortable: true },
        { header: "Merk", accessor: "merk", sortable: true },
        {
            header: "Penanggung Jawab",
            accessor: "penanggungjawab",
            sortable: false,
        },
        {
            header: "Unit Kerja",
            accessor: "unitKerja",
            sortable: true,
            cell: (row) =>
                row.unitKerja ? row.unitKerja.split(" / ")[0] : "-",
        },
        { header: "Kondisi", accessor: "kondisi", sortable: true },
        { header: "NUP", accessor: "NUP", sortable: true },
        { header: "Status", accessor: "statKendaraan", sortable: true },
        {
            header: "Action",
            cell: (row) => (
                <div className="flex justify-center font-bold gap-2">
                    <button
                        onClick={() => handleDetailClick(row.kendaraanID)}
                        className="min-w-14 text-white bg-blue-500 px-2 py-1 rounded-xl cursor-pointer"
                    >
                        Detail
                    </button>
                    {/* 5. Update tombol pinjam untuk memanggil handlePinjamClick */}
                    <button
                        onClick={() => handlePinjamClick(row)}
                        disabled={row.statKendaraan !== "Stand by"}
                        className="min-w-14 text-white bg-green-500 px-2 py-1 rounded-xl cursor-pointer disabled:cursor-not-allowed disabled:bg-gray-600"
                    >
                        Pinjam
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
                            Daftar Motor
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
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            {(currentUserRole === "Admin" ||
                                currentUserRole === "Super Admin") && (
                                <Button
                                    text="Motor"
                                    icon={<Plus className="w-4 h-4" />}
                                    bgColor="bg-[#1f4f27]"
                                    onClick={handleTambahMotor}
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
                                    onSort={handleSort}
                                    sortConfig={sortConfig}
                                />
                            </div>
                            <Pagination
                                totalItems={sortedAndFilteredData.length}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                                onPageChange={setCurrentPage}
                                onItemsPerPageChange={setItemsPerPage}
                            />
                        </>
                    )}
                </div>
            </div>
            {/* 6. Render kedua modal di sini */}
            {selectedVehicle && (
                <BorrowModal
                    isOpen={isBorrowModalOpen}
                    onClose={() => setIsBorrowModalOpen(false)}
                    onSubmit={handleBorrowSubmit}
                    vehicle={selectedVehicle}
                    isLoading={isSubmitting}
                />
            )}
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleSuccessModalClose}
                title="Peminjaman Berhasil!"
                message={`Peminjaman untuk kendaraan ${selectedVehicle?.namaKendaraan} telah berhasil dicatat.`}
            />
        </div>
    );
};

export default DaftarMotor;
