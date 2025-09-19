import React, { useState, useEffect, useCallback } from "react";
import { getDashboardData } from "../services/dashboardService.js";

// Komponen Card Status Sederhana (untuk kolom kanan)
const StatusCard = ({ title, total, color }) => (
    <div className={`p-4 rounded-lg shadow-md text-white ${color}`}>
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <div className="flex justify-between items-center border-t border-white/20 pt-2">
            <span className="text-sm">Total</span>
            <span className="text-3xl font-bold">{total || 0}</span>
        </div>
    </div>
);

const Dashboard = ({ isSidebarOpen }) => {
    const [dashboardData, setDashboardData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await getDashboardData();
            setDashboardData(response.data);
        } catch (err) {
            setError("Gagal memuat data dashboard.");
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading) {
        return (
            <div
                className={`flex items-center justify-center h-screen bg-[#242424] text-white transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}
            >
                Memuat dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div
                className={`flex items-center justify-center h-screen bg-[#242424] text-red-500 transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}
            >
                {error}
            </div>
        );
    }

    const { status_counts = {}, expiring_taxes = [] } = dashboardData || {};

    return (
        <div
            className={`bg-[#242424] min-h-screen pt-16 transition-all duration-300 overflow-hidden ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}
        >
            <div className="p-4 md:p-6">
                <h1 className="text-3xl font-bold text-white mb-6">
                    Dashboard
                </h1>

                {/* --- Grid Utama untuk Tata Letak --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* --- Kolom Kiri (mengambil 2 bagian di layar besar) --- */}
                    <div className="lg:col-span-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            {/* Kartu Tabel Pajak (mengambil 2 bagian dari kolom kiri) */}
                            <div className="md:col-span-2 p-4 bg-[#171717] rounded-lg">
                                <h3 className="font-bold text-white mb-4 text-lg">
                                    Pajak Akan Datang (
                                    {new Date().getFullYear()})
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm text-left text-gray-300">
                                        <thead className="bg-[#1f4f27] text-white">
                                            <tr>
                                                <th className="p-2 rounded-tl-lg">
                                                    No
                                                </th>
                                                <th className="p-2">Merk</th>
                                                <th className="p-2">Plat</th>
                                                <th className="p-2 rounded-tr-lg">
                                                    Tanggal
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {expiring_taxes.length > 0 ? (
                                                expiring_taxes.map(
                                                    (tax, index) => (
                                                        <tr
                                                            key={
                                                                tax.kendaraanID
                                                            }
                                                            className="border-b border-gray-700"
                                                        >
                                                            <td className="p-2">
                                                                {index + 1}
                                                            </td>
                                                            <td className="p-2">
                                                                {
                                                                    tax
                                                                        .kendaraan
                                                                        ?.merk
                                                                }
                                                            </td>
                                                            <td className="p-2">
                                                                {
                                                                    tax
                                                                        .kendaraan
                                                                        ?.plat
                                                                }
                                                            </td>
                                                            <td className="p-2">
                                                                {new Date(
                                                                    tax.berlakuSampai,
                                                                ).toLocaleDateString(
                                                                    "id-ID",
                                                                    {
                                                                        day: "2-digit",
                                                                        month: "2-digit",
                                                                        year: "numeric",
                                                                    },
                                                                )}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )
                                            ) : (
                                                <tr>
                                                    <td
                                                        colSpan="4"
                                                        className="text-center p-4 text-gray-400"
                                                    >
                                                        Tidak ada pajak jatuh
                                                        tempo.
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* --- Kolom Kanan (mengambil 1 bagian di layar besar) --- */}
                    <div className="lg:col-span-1 space-y-4">
                        <StatusCard
                            title="Mobil Tersedia"
                            total={status_counts.mobil?.["Stand by"]}
                            color="bg-green-600"
                        />
                        <StatusCard
                            title="Mobil Dipinjam"
                            total={status_counts.mobil?.["Not Available"]}
                            color="bg-yellow-600"
                        />
                        <StatusCard
                            title="Mobil Rusak"
                            total={status_counts.mobil?.["Maintenance"]}
                            color="bg-red-600"
                        />
                        <StatusCard
                            title="Motor Tersedia"
                            total={status_counts.motor?.["Stand by"]}
                            color="bg-green-600"
                        />
                        <StatusCard
                            title="Motor Dipinjam"
                            total={status_counts.motor?.["Not Available"]}
                            color="bg-yellow-600"
                        />
                        <StatusCard
                            title="Motor Rusak"
                            total={status_counts.motor?.["Maintenance"]}
                            color="bg-red-600"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
