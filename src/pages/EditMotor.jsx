import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import Button from "../components/Button";
import FormKendaraan from "../components/FormKendaraan";
import SuccessModal from "../components/SuccessModal";
import { getProfile } from "../services/authService";

// 1. Impor semua fungsi service yang dibutuhkan
import { getVehicleById, updateVehicle } from "../services/vehicleService";
import { getTaxesByVehicleId, updateTax } from "../services/taxService";

const EditMotor = ({ isSidebarOpen }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    const [formData, setFormData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    // --- DEFINISI FIELD UNTUK FORMULIR ---
    const dataMotorFields = [
        { id: "namaKendaraan", label: "Nama Motor" },
        { id: "plat", label: "Plat" },
        { id: "pemilik", label: "Nama Pemilik" },
        { id: "merk", label: "Merk / Tipe" },
        { id: "jenisKendaraan", label: "Jenis", disabled: true },
        { id: "kondisi", label: "Kondisi" },
        { id: "penanggungjawab", label: "Penanggung Jawab" },
        {
            id: "unitKerja",
            label: "Unit Kerja",
            type: "select",
            options: ["Balai", "Sekwil I", "Sekwil II", "Sekwil III"],
            disabled: user?.role === "Admin", // Disable if user is Admin
        },
        {
            id: "lokasi",
            label: "Lokasi Barang",
            type: "select",
            options: ["Palangka Raya", "Samarinda", "Pontianak"],
            disabled: user?.role === "Admin", // Disable if user is Admin
        },
        { id: "NUP", label: "NUP" },
    ];

    const dataStnkFields = [
        { id: "alamat", label: "Alamat STNK" },
        { id: "tahunPembuatan", label: "Tahun Pembuatan" },
        { id: "silinder", label: "Isi Silinder" },
        { id: "warnaKB", label: "Warna KB" },
        {
            id: "bahanBakar",
            label: "Bahan Bakar",
            type: "select",
            options: ["Bensin", "Solar"],
        },
        { id: "tahunRegistrasi", label: "Tahun Registrasi" },
        { id: "noRangka", label: "Nomor Rangka" },
        { id: "noMesin", label: "Nomor Mesin" },
        { id: "noBPKB", label: "Nomor BPKB" },
        { id: "warnaTNKB", label: "Warna TNKB" },
        { id: "berlakuSampai", label: "Berlaku Sampai", type: "date" },
        { id: "biaya", label: "Biaya Pajak" },
    ];

    // Fetch data awal saat komponen dimuat
    const fetchInitialData = useCallback(async () => {
        setIsLoading(true);
        try {
            const [vehicleResponse, taxResponse] = await Promise.all([
                getVehicleById(id),
                getTaxesByVehicleId(id),
            ]);

            const vehicleData = vehicleResponse.data;
            const taxData = taxResponse.data || {};
            let combinedData = { ...vehicleData, ...taxData };

            if (
                combinedData.unitKerja &&
                combinedData.unitKerja.includes(" / ")
            ) {
                const parts = combinedData.unitKerja.split(" / ");
                combinedData.unitKerja = parts[0]?.trim();
                combinedData.lokasi = parts[1]?.trim();
            }
            if (combinedData.berlakuSampai) {
                const date = new Date(combinedData.berlakuSampai);
                combinedData.berlakuSampai = date.toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                });
            }

            setFormData(combinedData);
        } catch (err) {
            setError("Gagal memuat data untuk diedit.");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const response = await getProfile();
                setUser(response.data);
            } catch (err) {
                console.error("Failed to fetch user profile:", err);
            }
        };
        
        fetchUserProfile();
        fetchInitialData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleBack = () => navigate(-1);

    const parseIndonesianDate = (dateString) => {
        const months = {
            Januari: "01",
            Februari: "02",
            Maret: "03",
            April: "04",
            Mei: "05",
            Juni: "06",
            Juli: "07",
            Agustus: "08",
            September: "09",
            Oktober: "10",
            November: "11",
            Desember: "12",
        };

        // Split the date string ("10 Juli 2025" -> ["10", "Juli", "2025"])
        const [day, month, year] = dateString.split(" ");

        // Convert to YYYY-MM-DD
        return `${year}-${months[month]}-${day.padStart(2, "0")}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            const finalUnitKerja =
                formData.unitKerja === "Balai"
                    ? "Balai"
                    : `${formData.unitKerja} / ${formData.lokasi}`;

            const vehiclePayload = {
                namaKendaraan: formData.namaKendaraan,
                plat: formData.plat,
                pemilik: formData.pemilik,
                merk: formData.merk,
                kondisi: formData.kondisi,
                penanggungjawab: formData.penanggungjawab,
                unitKerja: finalUnitKerja,
                NUP: formData.NUP,
            };

            const formattedDate = formData.berlakuSampai
                ? parseIndonesianDate(formData.berlakuSampai)
                : null;

            const taxPayload = {
                alamat: formData.alamat,
                tahunPembuatan: formData.tahunPembuatan,
                silinder: formData.silinder,
                warnaKB: formData.warnaKB,
                bahanBakar: formData.bahanBakar,
                tahunRegistrasi: formData.tahunRegistrasi,
                noRangka: formData.noRangka,
                noMesin: formData.noMesin,
                noBPKB: formData.noBPKB,
                warnaTNKB: formData.warnaTNKB,
                berlakuSampai: formattedDate,
                biaya: formData.biaya,
            };

            // Jalankan kedua update secara paralel
            await Promise.all([
                updateVehicle(id, vehiclePayload),
                updateTax(formData.pajakID, taxPayload), // Asumsi pajakID ada di formData
            ]);

            setIsSuccessModalOpen(true);
        } catch (err) {
            setError(
                err.response?.data?.message || "Gagal menyimpan perubahan.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalClose = () => {
        setIsSuccessModalOpen(false);
        navigate(`/motor/${id}`);
    };

    if (isLoading) {
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

    return (
        <div className="transition-all flex duration-300">
            <div
                className={`bg-[#242424] mt-16 p-4 w-full min-h-screen ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}
            >
                <div className="flex flex-col h-full">
                    <header className="mb-4">
                        <p className="text-white font-semibold text-2xl">
                            Manajemen Motor
                        </p>
                    </header>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 h-fit p-4 md:p-6 bg-[#171717] rounded-lg md:rounded-2xl"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <p className="text-white font-semibold text-xl">
                                Edit Motor
                            </p>
                            <div className="flex gap-3 w-full md:w-auto">
                                <Button
                                    text="Kembali"
                                    bgColor="bg-gray-600"
                                    onClick={handleBack}
                                    type="button"
                                />
                                <Button
                                    text={
                                        isSubmitting ? "Menyimpan..." : "Simpan"
                                    }
                                    bgColor="bg-[#1f4f27]"
                                    type="submit"
                                    disabled={isSubmitting}
                                />
                            </div>
                        </div>
                        {formData && (
                            <div className="flex flex-col gap-6 h-full mt-2">
                                <FormKendaraan
                                    title="Data Motor"
                                    fields={dataMotorFields}
                                    formData={formData}
                                    handleChange={handleChange}
                                />
                                <FormKendaraan
                                    title="Data Perpajakan"
                                    fields={dataStnkFields}
                                    formData={formData}
                                    handleChange={handleChange}
                                />
                            </div>
                        )}
                    </form>
                </div>
            </div>
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleModalClose}
                title="Perubahan Disimpan!"
                message="Data kendaraan telah berhasil diperbarui."
            />
        </div>
    );
};

export default EditMotor;
