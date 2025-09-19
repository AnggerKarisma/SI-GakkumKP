import React, { useState, useMemo, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import { getAllTaxes } from "../services/taxService";

// --- KOMPONEN HALAMAN UTAMA ---
const DaftarPajak = ({ isSidebarOpen }) => {
    const navigate = useNavigate();

    const [pajakData, setPajakData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "ascending",
    });

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setSortConfig({
          key:null,
          direction:"ascending",
        })
        try {
            const response = await getAllTaxes();
            const taxesArray = Array.isArray(response?.data)
                ? response.data
                : [];
            setPajakData(taxesArray);
        } catch (err) {
            setError("Gagal memuat data pajak.");
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

    const sortedData = useMemo(() => {
        let sortableItems = [...pajakData];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                let valA, valB;

                if (sortConfig.key.includes(".")) {
                    valA = sortConfig.key
                        .split(".")
                        .reduce((o, i) => (o ? o[i] : ""), a);
                    valB = sortConfig.key
                        .split(".")
                        .reduce((o, i) => (o ? o[i] : ""), b);
                } else {
                    valA = a[sortConfig.key];
                    valB = b[sortConfig.key];
                }

                if (sortConfig.key === "biaya") {
                    valA = parseFloat(valA);
                    valB = parseFloat(valB);
                }

                if (valA < valB) {
                    return sortConfig.direction === "ascending" ? -1 : 1;
                }
                if (valA > valB) {
                    return sortConfig.direction === "ascending" ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [pajakData, sortConfig]);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * itemsPerPage;
        const lastPageIndex = firstPageIndex + itemsPerPage;
        return sortedData.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, itemsPerPage, sortedData]);

    const handleProsesClick = (id) => {
        navigate(`/pajak/proses/${id}`);
    };

    const columns = [
        {
            header: "NO",
            cell: (row, index) => (currentPage - 1) * itemsPerPage + index + 1,
        },
        {
            header: "Plat",
            accessor: "kendaraan.plat", 
            sortable: true,
            cell: (row) => row.kendaraan?.plat || "-",
        },
        {
            header: "Merk",
            accessor: "kendaraan.merk",
            sortable: true,
            cell: (row) => row.kendaraan?.merk || "-",
        },
        {
            header: "Jenis",
            accessor: "kendaraan.jenisKendaraan",
            sortable: true,
            cell: (row) => {
                const jenis = row.kendaraan?.jenisKendaraan;
                if (!jenis) return "-";
                return jenis.charAt(0).toUpperCase() + jenis.slice(1);
            },
        },
        {
            header: "Penanggung Jawab",
            accessor: "kendaraan.penanggungjawab",
            sortable: false,
            cell: (row) => row.kendaraan?.penanggungjawab || "-",
        },
        {
            header: "Tahun Registrasi",
            accessor: "tahunRegistrasi",
            sortable: true,
        },
        {
            header: "Berlaku Sampai",
            accessor: "berlakuSampai",
            sortable: true,
            cell: (row) => {
                if (!row.berlakuSampai) return "-"
                const date = new Date(row.berlakuSampai)
                return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
            },
        },
        {
            header: "Biaya",
            accessor: "biaya",
            sortable: true,
            cell: (row) => `Rp ${Number(row.biaya).toLocaleString("id-ID")}`,
        },
        {
            header: "Action",
            cell: (row) => (
                <div className="flex justify-center font-bold gap-2">
                    <button
                        className="min-w-14 bg-green-500 text-white px-2 py-1 rounded-xl cursor-pointer"
                        onClick={() => handleProsesClick(row.pajakID)}
                    >
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
                        <h1 className="text-white font-semibold text-3xl">
                            Daftar Pajak
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
                        </div>
                    </div>
                    {/* 5. Tampilkan UI berdasarkan status fetching */}
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
                                totalItems={pajakData.length}
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

export default DaftarPajak;
