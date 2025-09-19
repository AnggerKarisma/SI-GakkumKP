import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import Button from "../components/Button.jsx";
import { getUserById, deleteUser } from "../services/userService.js";
import { getProfile } from "../services/authService.js";
import FieldAkun from "../components/FieldAkun.jsx";
import ConfirmationModal from "../components/ConfirmationModal";

const akunFields = [
    { id: "nama", label: "Nama" },
    { id: "NIP", label: "NIP" },
    { id: "jabatan", label: "Jabatan" },
    { id: "unitKerja", label: "Unit Kerja" },
    { id: "lokasi", label: "Lokasi" },
    { id: "role", label: "Level" },
];

const DetailAkun = ({ isSidebarOpen }) => {
    const { id } = useParams(); // Akan 'undefined' jika tidak ada ID di URL
    const navigate = useNavigate();
    const location = useLocation();

    const initialData = location.state?.user;

    const [detailData, setDetailData] = useState(initialData || null);
    const [isLoading, setIsLoading] = useState(!initialData);
    const [error, setError] = useState(null);
    const [isMyProfile, setIsMyProfile] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const fetchDetailAkun = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            let responseData;
            if (id) {
                responseData = await getUserById(id);
                setIsMyProfile(false);
            } else {
                responseData = await getProfile();
                setIsMyProfile(true);
            }

            if (responseData && responseData.data) {
                const fetchedData = responseData.data;
                let processedData = { ...fetchedData };

                if (
                    fetchedData.unitKerja &&
                    fetchedData.unitKerja.includes("/")
                ) {
                    const parts = fetchedData.unitKerja.split("/");
                    processedData.unitKerja = parts[0] ? parts[0].trim() : "";
                    processedData.lokasi = parts[1] ? parts[1].trim() : "";
                } else {
                    processedData.lokasi = fetchedData.lokasi || "";
                }

                setDetailData(processedData);
            } else {
                setError("Format data tidak sesuai.");
            }
        } catch (err) {
            setError("Gagal memuat data akun atau akun tidak ditemukan.");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchDetailAkun();
    }, [fetchDetailAkun]);

    const handleEdit = () => {
        // Arahkan ke halaman edit yang sesuai
        const editPath = id ? `/akun/edit/${id}` : "/profile/edit";
        navigate(editPath);
    };

    const handleDeleteConfirm = async () => {
        setIsModalOpen(false); // Tutup modal dulu
        setIsLoading(true);
        try {
            await deleteUser(id);
            navigate("/akun");
        } catch (err) {
            setError("Gagal menghapus akun.");
            console.error("Error saat menghapus:", err);
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div
                className={`flex items-center justify-center h-screen bg-[#242424] text-white`}
            >
                <span className={`${isSidebarOpen ? "md:ml-64" : "ml-0"}`}>
                    Memuat data...
                </span>
            </div>
        );
    }

    if (error || !detailData) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#242424] text-white">
                <span className={`${isSidebarOpen ? "md:ml-64" : "ml-0"}`}>
                    {error || "Data tidak ditemukan."}
                </span>
            </div>
        );
    }

    return (
        <div className="transition-all flex duration-300">
            <div
                className={`bg-[#242424] mt-16 p-4 w-full min-h-screen transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}
            >
                <div className="flex flex-col h-full">
                    <header className="mb-4">
                        <p className="text-white font-semibold text-2xl">
                            Manajemen Akun
                        </p>
                    </header>
                    <div className="flex flex-col gap-4 h-fit p-4 md:p-6 bg-[#171717] rounded-lg md:rounded-2xl">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <p className="text-white font-semibold text-xl">
                                {/* Judul dinamis berdasarkan halaman */}
                                {isMyProfile
                                    ? "Profil Saya"
                                    : `Detail Akun - ${detailData.nama}`}
                            </p>
                            <div className="flex gap-3 w-full md:w-auto">
                                {/* Tombol Hapus hanya muncul jika melihat profil orang lain */}
                                {!isMyProfile && (
                                    <Button
                                        text={"Hapus"}
                                        bgColor={"bg-red-800"}
                                        additionalClasses="w-full md:w-auto"
                                        type={"button"}
                                        onClick={() => setIsModalOpen(true)}
                                    />
                                )}
                                <Button
                                    text={"Edit"}
                                    bgColor={"bg-yellow-600"}
                                    additionalClasses="w-full md:w-auto"
                                    type={"button"}
                                    onClick={handleEdit}
                                />
                            </div>
                        </div>
                        <div className="flex flex-col gap-6 h-full mt-2">
                            <FieldAkun
                                title="Data Akun"
                                fields={akunFields}
                                data={detailData}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmationModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Konfirmasi Hapus Akun"
                message={`Apakah Anda yakin ingin menghapus akun milik ${detailData?.nama}? Tindakan ini tidak dapat dibatalkan.`}
            />
        </div>
    );
};

export default DetailAkun;
