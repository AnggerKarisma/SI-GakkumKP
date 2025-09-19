import React from "react";
import Button from "./Button"; // Perbaikan: Menghapus ekstensi .jsx
import { CheckCircle2 } from "lucide-react";

const SuccessModal = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
            onClick={onClose}
        >
            {/* Konten Modal */}
            <div
                className="bg-[#242424] rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-md text-white border-2 border-gray-700 transform transition-transform duration-300 scale-95 animate-scale-in"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-green-800/20 rounded-full mb-4">
                        <CheckCircle2 className="w-12 h-12 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{title}</h3>
                    <p className="text-gray-300 mb-8">{message}</p>
                </div>

                {/* Tombol Aksi */}
                <div className="flex justify-center">
                    <Button
                        text="Lanjutkan"
                        onClick={onClose}
                        bgColor="bg-[#1f4f27]"
                        additionalClasses="w-full md:w-auto"
                    />
                </div>
            </div>
            {/* CSS untuk animasi sederhana */}
            <style>{`
                @keyframes scale-in {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.2s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default SuccessModal;
