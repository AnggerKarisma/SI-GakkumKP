import React, { useState } from "react";
import Button from "./Button";
import { X, Calendar } from "lucide-react";

const ExportReportModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
    const [dateRange, setDateRange] = useState({
        startDate: "",
        endDate: "",
    });

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setDateRange((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(dateRange);
    };

    return (
        <div
            className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4"
            onClick={onClose}
        >
            <div
                className="bg-[#242424] rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-lg text-white border-2 border-gray-700 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-bold">
                            Generate Laporan Peminjaman
                        </h3>
                        <X
                            className="w-6 h-6 cursor-pointer"
                            onClick={onClose}
                        />
                    </div>

                    <p className="mb-6 text-gray-300">
                        Pilih rentang tanggal untuk laporan yang ingin Anda
                        ekspor. Laporan akan dihasilkan dalam format PDF.
                    </p>

                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex flex-col gap-2 w-full">
                            <label
                                htmlFor="startDate"
                                className="text-sm font-medium"
                            >
                                Tanggal Mulai
                            </label>
                            <div className="flex items-center border border-gray-600 rounded-lg p-2">
                                <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                                <input
                                    type="date"
                                    id="startDate"
                                    name="startDate"
                                    required
                                    value={dateRange.startDate}
                                    onChange={handleChange}
                                    className="w-full bg-transparent outline-none"
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 w-full">
                            <label
                                htmlFor="endDate"
                                className="text-sm font-medium"
                            >
                                Tanggal Selesai
                            </label>
                            <div className="flex items-center border border-gray-600 rounded-lg p-2">
                                <Calendar className="w-5 h-5 mr-3 text-gray-400" />
                                <input
                                    type="date"
                                    id="endDate"
                                    name="endDate"
                                    required
                                    value={dateRange.endDate}
                                    onChange={handleChange}
                                    className="w-full bg-transparent outline-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 mt-8">
                        <Button
                            text="Batal"
                            onClick={onClose}
                            type="button"
                            bgColor="bg-gray-600"
                            disabled={isLoading}
                        />
                        <Button
                            text={isLoading ? "Memproses..." : "Export PDF"}
                            type="submit"
                            bgColor="bg-[#1f4f27]"
                            disabled={isLoading}
                        />
                    </div>
                </form>
            </div>
            <style>{`
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in { animation: scale-in 0.2s ease-out forwards; }
            `}</style>
        </div>
    );
};

export default ExportReportModal;
