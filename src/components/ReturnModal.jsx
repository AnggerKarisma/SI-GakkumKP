import React from "react";
import Button from "./Button.jsx";
import { X, CheckCircle } from "lucide-react";

const ReturnModal = ({ isOpen, onClose, onSubmit, borrowData, isLoading }) => {
    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(); // Tidak ada data form yang perlu dikirim
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
                            Konfirmasi Pengembalian
                        </h3>
                        <X
                            className="w-6 h-6 cursor-pointer"
                            onClick={onClose}
                        />
                    </div>

                    <div className="text-gray-300 space-y-2 mb-8">
                        <p>Anda akan mengembalikan kendaraan berikut:</p>
                        <p>
                            <span className="font-semibold w-32 inline-block">
                                Kendaraan
                            </span>
                            :{" "}
                            <span className="font-bold text-white">
                                {borrowData?.kendaraan?.namaKendaraan}
                            </span>
                        </p>
                        <p>
                            <span className="font-semibold w-32 inline-block">
                                Plat
                            </span>
                            :{" "}
                            <span className="font-bold text-white">
                                {borrowData?.kendaraan?.plat}
                            </span>
                        </p>
                        <p>
                            <span className="font-semibold w-32 inline-block">
                                Peminjam
                            </span>
                            :{" "}
                            <span className="font-bold text-white">
                                {borrowData?.user?.nama}
                            </span>
                        </p>
                        <p className="mt-4">
                            Tanggal kembali akan dicatat sebagai hari ini.
                            Apakah Anda yakin ingin melanjutkan?
                        </p>
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
                            text={isLoading ? "Memproses..." : "Ya, Kembalikan"}
                            type="submit"
                            bgColor="bg-blue-600"
                            disabled={isLoading}
                            icon={<CheckCircle className="w-4 h-4" />}
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

export default ReturnModal;
