import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import DetailKendaraan from "../components/DetailKendaraan.jsx";
import ConfirmationModal from "../components/ConfirmationModal.jsx";
import SuccessModal from "../components/SuccessModal.jsx";

import { getVehicleById, deleteVehicle } from "../services/vehicleService.js";
import { getTaxesByVehicleId } from "../services/taxService.js";
import { getProfile } from "../services/authService.js";

const dataMobilFields = [
    { id: "namaKendaraan", label: "Nama Kendaraan" },
    { id: "plat", label: "Plat" },
    { id: "pemilik", label: "Nama Pemilik" },
    { id: "merk", label: "Merk" },
    { id: "jenisKendaraan", label: "Jenis" },
    { id: "kondisi", label: "Kondisi" },
    { id: "penanggungjawab", label: "Penanggung Jawab" },
    { id: "unitKerja", label: "Unit Kerja" },
    { id: "NUP", label: "NUP" },
];

const dataStnkFields = [
    { id: "alamat", label: "Alamat STNK" },
    { id: "tahunPembuatan", label: "Tahun Pembuatan" },
    { id: "silinder", label: "Isi Silinder" },
    { id: "warnaKB", label: "Warna KB" },
    { id: "bahanBakar", label: "Bahan Bakar" },
    { id: "tahunRegistrasi", label: "Tahun Registrasi" },
    { id: "noRangka", label: "Nomor Rangka" },
    { id: "noMesin", label: "Nomor Mesin" },
    { id: "noBPKB", label: "Nomor BPKB" },
    { id: "warnaTNKB", label: "Warna TNKB" },
    { id: "berlakuSampai", label: "Berlaku Sampai" },
    { id: "biaya", label: "Biaya Pajak", isCurrency: true },
];

const DetailMobil = ({ isSidebarOpen }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [detailData, setDetailData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [currentUserRole, setCurrentUserRole] = useState(null);

    const fetchData = useCallback(async () => {
        if (!id) return;
        setIsLoading(true);
        setError(null);
        try {
            const [vehicleResponse, taxResponse, profileResponse] =
                await Promise.all([
                    getVehicleById(id),
                    getTaxesByVehicleId(id),
                    getProfile(), 
                ]);

            setCurrentUserRole(profileResponse.data.role);

            const vehicleData = vehicleResponse.data;
            const taxData = taxResponse.data || {};
            let combinedData = { ...vehicleData, ...taxData };
            if (combinedData.jenisKendaraan) {
                combinedData.jenisKendaraan =
                    combinedData.jenisKendaraan.charAt(0).toUpperCase() +
                    combinedData.jenisKendaraan.slice(1);
            }

            if (combinedData.berlakuSampai) {
                const date = new Date(combinedData.berlakuSampai);
                combinedData.berlakuSampai = date.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                });
            }
            setDetailData(combinedData);
        } catch (err) {
            setError("Gagal memuat detail kendaraan.");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleEdit = () => navigate(`/mobil/edit/${id}`);

    const handleDeleteConfirm = async () => {
        setIsConfirmModalOpen(false);
        setIsLoading(true);
        try {
            await deleteVehicle(id);
            setIsSuccessModalOpen(true);
        } catch (err) {
            setError("Gagal menghapus kendaraan.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuccessModalClose = () => {
        setIsSuccessModalOpen(false);
        navigate("/mobil");
    };

    if (isLoading && !detailData) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#242424] text-white">
                Memuat data...
            </div>
        );
    }
    if (error) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#242424] text-red-500">
                {error}
            </div>
        );
    }
    if (!detailData) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#242424] text-white">
                Data tidak ditemukan.
            </div>
        );
    }

    return (
        <div className="transition-all flex duration-300">
            <div
                className={`bg-[#242424] mt-16 p-4 w-full min-h-screen ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}
            >
                <div className="flex flex-col h-full">
                    <header className="mb-4">
                        <p className="text-white font-semibold text-2xl">
                            Manajemen Mobil
                        </p>
                    </header>
                    <div className="flex flex-col gap-4 h-fit p-4 md:p-6 bg-[#171717] rounded-lg md:rounded-2xl">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <p className="text-white font-semibold text-xl">
                                {detailData.namaKendaraan} - {detailData.plat}
                            </p>
                            <div className="flex gap-3 w-full md:w-auto">
                                {/* <Button
                                    text="Pinjam"
                                    bgColor="bg-[#1f4f27]"
                                    type="button"
                                /> */}
                                {(currentUserRole === "Admin" ||
                                    currentUserRole === "Super Admin") && (
                                    <>
                                        <Button
                                            text="Hapus"
                                            bgColor="bg-red-800"
                                            type="button"
                                            onClick={() =>
                                                setIsConfirmModalOpen(true)
                                            }
                                        />
                                        <Button
                                            text="Edit"
                                            bgColor="bg-yellow-600"
                                            type="button"
                                            onClick={handleEdit}
                                        />
                                    </>
                                )}
                            </div>
                        </div>
                        {isLoading && (
                            <div className="absolute inset-0 bg-black/50 flex justify-center items-center z-20">
                                <p className="text-white text-lg">
                                    Memproses...
                                </p>
                            </div>
                        )}
                        <div className="flex flex-col gap-6 h-full mt-2">
                            <DetailKendaraan
                                title="Data Mobil"
                                fields={dataMobilFields}
                                data={detailData}
                            />
                            <DetailKendaraan
                                title="Data STNK"
                                fields={dataStnkFields}
                                data={detailData}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <ConfirmationModal
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                title="Konfirmasi Hapus"
                message={`Apakah Anda yakin ingin menghapus data kendaraan ${detailData.namaKendaraan}? Data pajak terkait juga akan dihapus.`}
            />
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleSuccessModalClose}
                title="Berhasil Dihapus!"
                message={`Data kendaraan ${detailData.namaKendaraan} telah berhasil dihapus dari sistem.`}
            />
        </div>
    );
};

export default DetailMobil;
