import Button from "./Button";
import { AlertTriangle } from "lucide-react";

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 bg-black/70 z-50 flex justify-center items-center p-4 transition-opacity duration-300"
            onClick={onClose} // Memungkinkan menutup modal dengan mengklik latar belakang
        >
            {/* Konten Modal */}
            <div
                className="bg-[#242424] rounded-2xl shadow-xl p-6 md:p-8 w-full max-w-md text-white border-2 border-gray-700 transform transition-transform duration-300 scale-95 animate-scale-in"
                onClick={(e) => e.stopPropagation()} // Mencegah penutupan modal saat mengklik di dalam konten
            >
                <div className="flex flex-col items-center text-center">
                    <div className="p-3 bg-red-800/20 rounded-full mb-4">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">{title}</h3>
                    <p className="text-gray-300 mb-8">{message}</p>
                </div>

                {/* Tombol Aksi */}
                <div className="flex justify-center gap-4">
                    <Button
                        text="Batal"
                        onClick={onClose}
                        bgColor="bg-gray-600"
                        additionalClasses="w-full md:w-auto"
                    />
                    <Button
                        text="Ya, Hapus"
                        onClick={onConfirm}
                        bgColor="bg-red-800"
                        additionalClasses="w-full md:w-auto"
                    />
                </div>
            </div>
            {/* Menambahkan sedikit CSS untuk animasi sederhana */}
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

export default ConfirmationModal;
