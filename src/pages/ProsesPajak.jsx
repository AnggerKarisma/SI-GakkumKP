import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect, useCallback } from "react";
import Button from "../components/Button";
import FormKendaraan from "../components/FormKendaraan";
import SuccessModal from "../components/SuccessModal";

// 1. Impor fungsi service yang relevan
import { getTaxById, updateTax } from "../services/taxService";

// --- DEFINISI FIELD UNTUK FORMULIR ---
const dataKendaraanFields = [
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

const ProsesPajak = ({ isSidebarOpen }) => {
    const { id } = useParams(); // Ini adalah pajakID
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    // Fetch data awal (pajak + kendaraan)
    const fetchInitialData = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await getTaxById(id);
            // Gabungkan data pajak dan data kendaraan yang berelasi
            const combinedData = {
                ...response.data,
                ...response.data.kendaraan,
            };

            // Format tanggal agar bisa diterima oleh input type="date" (YYYY-MM-DD)
            if (combinedData.berlakuSampai) {
                combinedData.berlakuSampai = new Date(
                    combinedData.berlakuSampai,
                )
                    .toISOString()
                    .split("T")[0];
            }

            setFormData(combinedData);
        } catch (err) {
            setError("Gagal memuat data pajak untuk diproses.");
        } finally {
            setIsLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchInitialData();
    }, [fetchInitialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleBack = () => navigate(-1);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);
        try {
            // Siapkan payload hanya dengan data pajak yang boleh diubah
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
                berlakuSampai: formData.berlakuSampai,
                biaya: formData.biaya,
            };

            await updateTax(id, taxPayload);
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
        navigate("/pajak");
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
                            Manajemen Pajak
                        </p>
                    </header>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 h-fit p-4 md:p-6 bg-[#171717] rounded-lg md:rounded-2xl"
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <p className="text-white font-semibold text-xl">
                                Proses Pajak - {formData?.plat}
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
                        <div className="flex flex-col gap-6 h-full mt-2">
                            <FormKendaraan
                                title="Data Kendaraan"
                                fields={dataKendaraanFields}
                                formData={formData}
                                handleChange={() => {}}
                                disabled={true}
                            />
                            <FormKendaraan
                                title="Data Perpajakan"
                                fields={dataStnkFields}
                                formData={formData}
                                handleChange={handleChange}
                            />
                        </div>
                    </form>
                </div>
            </div>
            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleModalClose}
                title="Perubahan Disimpan!"
                message="Data pajak kendaraan telah berhasil diperbarui."
            />
        </div>
    );
};

export default ProsesPajak;
