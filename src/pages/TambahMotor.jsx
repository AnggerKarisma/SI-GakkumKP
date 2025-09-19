import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import FormKendaraan from "../components/FormKendaraan";
import SuccessModal from "../components/SuccessModal";
import { createVehicle } from "../services/vehicleService";
import { createTax } from "../services/taxService";
import { getProfile } from "../services/authService";

const TambahMotor = ({ isSidebarOpen }) => {
    const [formData, setFormData] = useState({ jenisKendaraan: "Motor" });
    const [isPageLoading, setIsPageLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const navigate = useNavigate();

    const [motorFields, setMotorFields] = useState([
        { id: "namaKendaraan", label: "Nama Motor", required: true },
        { id: "plat", label: "Plat", required: true },
        { id: "pemilik", label: "Nama Pemilik", required: true },
        { id: "merk", label: "Merk / Tipe", required: true },
        {
            id: "jenisKendaraan",
            label: "Jenis",
            value: "Motor",
            disabled: true,
        },
        { id: "kondisi", label: "Kondisi", required: true },
        { id: "penanggungjawab", label: "Penanggung Jawab", required: true },
        {
            id: "unitKerja",
            label: "Unit Kerja",
            type: "select",
            options: ["Balai", "Sekwil I", "Sekwil II", "Sekwil III"],
            disabled: true,
            required: true,
        },
        {
            id: "lokasi",
            label: "Lokasi Barang",
            type: "select",
            options: ["Palangka Raya", "Samarinda", "Pontianak"],
            disabled: true,
        },
        { id: "NUP", label: "NUP", required: true },
    ]);

    const dataStnkFields = [
        { id: "alamat", label: "Alamat STNK", required: true },
        { id: "tahunPembuatan", label: "Tahun Pembuatan", required: true },
        { id: "silinder", label: "Isi Silinder", required: true },
        { id: "warnaKB", label: "Warna KB", required: true },
        {
            id: "bahanBakar",
            label: "Bahan Bakar",
            type: "select",
            options: ["Bensin", "Solar"],
            required: true,
        },
        { id: "tahunRegistrasi", label: "Tahun Registrasi", required: true },
        { id: "noRangka", label: "Nomor Rangka", required: true },
        { id: "noMesin", label: "Nomor Mesin", required: true },
        { id: "noBPKB", label: "Nomor BPKB", required: true },
        { id: "warnaTNKB", label: "Warna TNKB", required: true },
        {
            id: "berlakuSampai",
            label: "Berlaku Sampai",
            type: "date",
            required: true,
        },
        { id: "biaya", label: "Biaya Pajak (Rp)", required: true },
    ];

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const profileResponse = await getProfile();
                const userData = profileResponse.data;
                let unit = userData.unitKerja || "";
                let lok = "";
                if (unit.includes(" / ")) {
                    const parts = unit.split(" / ");
                    unit = parts[0]?.trim();
                    lok = parts[1]?.trim();
                }
                setFormData({
                    jenisKendaraan: "Motor",
                    unitKerja: unit,
                    lokasi: lok,
                });
            } catch (err) {
                setError("Gagal memuat data profil untuk form.");
            } finally {
                setIsPageLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleReset = () => {
        const preservedData = {
            jenisKendaraan: "Motor",
            unitKerja: formData.unitKerja,
            lokasi: formData.lokasi,
        };
        setFormData(preservedData);
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // --- VALIDASI DATA PAYLOAD ---
        const allFields = [...motorFields, ...dataStnkFields];
        for (const field of allFields) {
            // Periksa setiap field yang ditandai 'required'
            // Abaikan validasi untuk 'lokasi' jika unit kerja adalah 'Balai'
            if (field.required && !formData[field.id]) {
                if (field.id === "lokasi" && formData.unitKerja === "Balai") {
                    continue;
                }
                setError(`Kolom "${field.label}" wajib diisi.`);
                return; // Hentikan proses jika ada data yang kosong
            }
        }

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
                jenisKendaraan: "Motor", // Diubah menjadi huruf kecil sesuai migrasi
                penanggungjawab: formData.penanggungjawab,
                NUP: formData.NUP,
                unitKerja: finalUnitKerja,
                statKendaraan: "Stand by",
                kondisi: formData.kondisi,
            };

            const vehicleResponse = await createVehicle(vehiclePayload);
            const newVehicleId = vehicleResponse.data.kendaraanID;

            if (!newVehicleId) {
                throw new Error(
                    "Gagal mendapatkan ID kendaraan baru dari server.",
                );
            }

            const taxPayload = {
                kendaraanID: newVehicleId,
                alamat: formData.alamat,
                biaya: formData.biaya,
                tahunPembuatan: formData.tahunPembuatan,
                silinder: formData.silinder,
                warnaKB: formData.warnaKB,
                noRangka: formData.noRangka,
                noMesin: formData.noMesin,
                noBPKB: formData.noBPKB,
                warnaTNKB: formData.warnaTNKB,
                bahanBakar: formData.bahanBakar,
                tahunRegistrasi: formData.tahunRegistrasi,
                berlakuSampai: formData.berlakuSampai,
            };

            await createTax(taxPayload);
            setIsSuccessModalOpen(true);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                    "Gagal menambahkan data. Pastikan semua field terisi dengan benar.",
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleModalClose = () => {
        setIsSuccessModalOpen(false);
        navigate("/motor");
    };

    if (isPageLoading) {
        return (
            <div className="flex items-center justify-center h-screen bg-[#242424] text-white">
                Memuat form...
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
                                Tambah Motor
                            </p>
                            <div className="flex gap-3 w-full md:w-auto">
                                <Button
                                    text="Reset"
                                    bgColor="bg-red-800"
                                    onClick={handleReset}
                                    type="button"
                                    disabled={isSubmitting}
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

                        {error && (
                            <p className="text-red-500 text-sm text-center -mt-2">
                                {error}
                            </p>
                        )}

                        <div className="flex flex-col gap-6 h-full mt-2">
                            <FormKendaraan
                                title="Data Motor"
                                fields={motorFields}
                                formData={formData}
                                handleChange={handleChange}
                            />
                            <FormKendaraan
                                title="Data STNK"
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
                title="Berhasil Disimpan!"
                message="Data motor baru dan pajaknya telah berhasil ditambahkan."
            />
        </div>
    );
};

export default TambahMotor;
