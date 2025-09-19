import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SquareArrowOutUpLeft, RefreshCw } from "lucide-react";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Pagination from "../components/Pagination";
import ExportReportModal from "../components/ExportReportModal";

// Impor service yang relevan
import {
    getReports,
} from "../services/reportService";

import { generateBorrowReport } from "../services/borrowService";

const DaftarLaporan = ({ isSidebarOpen = false }) => {
    const navigate = useNavigate();

    const [laporanData, setLaporanData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "ascending",
    });

    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getReports();
            const reportArray = Array.isArray(response?.data)
                ? response.data
                : [];
            setLaporanData(reportArray);
        } catch (err) {
            setError("Gagal memuat data laporan.");
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

    const handleExportSubmit = async (dateRange) => {
        setIsSubmitting(true);
        try {
            const payload = {
                start_date: dateRange.startDate,
                end_date: dateRange.endDate,
            };
            const response = await generateBorrowReport(payload);

            const url = window.URL.createObjectURL(new Blob([response]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute(
                "download",
                `laporan-peminjaman-${dateRange.startDate}-sd-${dateRange.endDate}.pdf`,
            );
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);

            setIsExportModalOpen(false);
        } catch (err) {
            alert(
                "Gagal membuat laporan: " +
                    (err.response?.data?.message || err.message),
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const sortedData = useMemo(() => {
        let sortableItems = [...laporanData];
        if (sortConfig.key !== null) {
            sortableItems.sort((a, b) => {
                if (a[sortConfig.key] < b[sortConfig.key])
                    return sortConfig.direction === "ascending" ? -1 : 1;
                if (a[sortConfig.key] > b[sortConfig.key])
                    return sortConfig.direction === "ascending" ? 1 : -1;
                return 0;
            });
        }
        return sortableItems;
    }, [laporanData, sortConfig]);

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
            header: "Nama Kendaraan",
            accessor: "nama_kendaraan",
            sortable: true,
        },
        { header: "Plat", accessor: "plat", sortable: true },
        { header: "Unit Kerja", accessor: "unit_kerja", sortable: true },
        { header: "Peminjam", accessor: "peminjam", sortable: true },
        {
            header: "Tanggal Pinjam",
            accessor: "tgl_pinjam",
            sortable: true,
            cell: (row) => formatDate(row.tgl_pinjam),
        },
        {
            header: "Jatuh Tempo",
            accessor: "tgl_jatuh_tempo",
            sortable: true,
            cell: (row) => formatDate(row.tgl_jatuh_tempo),
        },
        {
            header: "Tanggal Kembali",
            accessor: "tgl_kembali",
            sortable: true,
            cell: (row) => formatDate(row.tgl_kembali),
        },
        { header: "Status", accessor: "status_pinjaman", sortable: true },
    ];

    return (
        <div className="flex">
            <div
                className={`bg-[#242424] min-h-screen pt-16 w-full transition-all duration-300 overflow-hidden ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}
            >
                <div className="flex flex-col gap-4 p-4">
                    <header>
                        <h1 className="text-white font-semibold text-3xl">
                            Laporan Peminjaman
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
                            <Button
                                text="Export"
                                icon={
                                    <SquareArrowOutUpLeft className="w-4 h-4" />
                                }
                                bgColor="bg-[#1f4f27]"
                                onClick={() => setIsExportModalOpen(true)}
                            />
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="text-white text-center py-10">
                            Memuat data...
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
            <ExportReportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                onSubmit={handleExportSubmit}
                isLoading={isSubmitting}
            />
        </div>
    );
};

export default DaftarLaporan;
