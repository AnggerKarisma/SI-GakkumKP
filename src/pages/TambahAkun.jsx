import React, { useState } from "react";
import Button from "../components/Button";
import FormAkun from "../components/FormAkun";
import { createUserByAdmin } from "../services/userService.js";
import { useNavigate } from "react-router-dom";
import SuccessModal from "../components/SuccessModal.jsx";

// Data untuk field formulir "Data Akun"
const akunFields = [
    { id: "nama", label: "Nama" },
    { id: "nip", label: "NIP" },
    { id: "jabatan", label: "Jabatan" },
    {
        id: "unitKerja",
        label: "Unit Kerja",
        type: "select",
        options: [
            "Balai",
            "Seksi Wilayah 1",
            "Seksi Wilayah 2",
            "Seksi Wilayah 3",
        ],
    },
    {
        id: "lokasi",
        label: "Lokasi",
        type: "select",
        options: ["Palangka Raya", "Samarinda", "Pontianak"],
    },
    { id: "password", label: "Password", type: "password" },
    {
        id: "konfirmasi_password",
        label: "Konfirmasi Password",
        type: "password",
    },
    {
        id: "role",
        label: "Level",
        type: "select",
        options: ["Admin", "User"],
    },
];

const TambahAkun = ({ isSidebarOpen }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({});
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
        if (name === "password" || name === "konfirmasi_password") {
            setError("");
        }
    };

    const handleReset = () => {
        setFormData({});
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.konfirmasi_password) {
            setError("Konfirmasi password tidak cocok dengan password.");
            return;
        }

        setIsLoading(true);
        try {
            let formattedUnitKerja;
            switch (formData.unitKerja) {
                case "Seksi Wilayah 1":
                    formattedUnitKerja = "Sekwil I";
                    break;
                case "Seksi Wilayah 2":
                    formattedUnitKerja = "Sekwil II";
                    break;
                case "Seksi Wilayah 3":
                    formattedUnitKerja = "Sekwil III";
                    break;
                default:
                    formattedUnitKerja = formData.unitKerja;
            }
            let finalUnitKerja;
            if (formData.unitKerja === "Balai") {
                finalUnitKerja = formattedUnitKerja;
            } else {
                finalUnitKerja = `${formattedUnitKerja} / ${formData.lokasi}`;
            }
            const payload = {
                nama: formData.nama,
                NIP: formData.nip,
                jabatan: formData.jabatan,
                unitKerja: finalUnitKerja,
                password: formData.password,
                role: formData.role,
            };

            await createUserByAdmin(payload);
            setIsSuccessModalOpen(true);
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                "Gagal membuat akun. Pastikan semua data terisi.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalClose = () => {
        setIsSuccessModalOpen(false);
        navigate("/akun"); // Arahkan setelah modal ditutup
    };

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
                    <form
                        className="flex flex-col gap-4 h-fit p-4 md:p-6 bg-[#171717] rounded-lg md:rounded-2xl"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <p className="text-white font-semibold text-xl">
                                Tambah Akun
                            </p>
                            <div className="flex gap-3 w-full md:w-auto">
                                <Button
                                    text={"Reset"}
                                    bgColor={"bg-red-800"}
                                    additionalClasses="w-full md:w-auto"
                                    onClick={handleReset}
                                    type={"button"}
                                    disabled={isLoading} // Nonaktifkan saat loading
                                />
                                <Button
                                    text={isLoading ? "Menyimpan..." : "Simpan"}
                                    bgColor={"bg-[#1f4f27]"}
                                    additionalClasses="w-full md:w-auto"
                                    type={"submit"}
                                    disabled={isLoading} // Nonaktifkan saat loading
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center -mt-2">
                                {error}
                            </p>
                        )}
                        <div className="flex flex-col gap-6 h-full mt-2">
                            <FormAkun
                                title="Data Akun"
                                fields={akunFields}
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
                title="Berhasil!"
                message="Akun baru telah berhasil dibuat dan disimpan."
            />
        </div>
    );
};

export default TambahAkun;
