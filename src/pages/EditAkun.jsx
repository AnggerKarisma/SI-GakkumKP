import { useNavigate, useParams } from "react-router-dom";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Button from "../components/Button";
import FormAkun from "../components/FormAkun";
import SuccessModal from "../components/SuccessModal";

import { getUserById, updateUserDetail } from "../services/userService";
import { getProfile, updateProfile } from "../services/authService";

const EditAkun = ({ isSidebarOpen }) => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

    const allFields = [
        { id: "nama", label: "Nama" },
        { id: "NIP", label: "NIP" },
        { id: "jabatan", label: "Jabatan" },
        {
            id: "unitKerja",
            label: "Unit Kerja",
            type: "select",
            options: ["Balai", "Sekwil I", "Sekwil II", "Sekwil III"],
        },
        {
            id: "lokasi",
            label: "Lokasi",
            type: "select",
            options: ["Palangka Raya", "Samarinda", "Pontianak"],
        },
        {
            id: "password",
            label: "Password Baru (opsional)",
            type: "password",
            placeholder: "Isi untuk mengubah password",
        },
        {
            id: "konfirmasi_password",
            label: "Konfirmasi Password",
            type: "password",
        },
        {
            id: "role",
            label: "Level",
            type: "select",
            options: ["Admin", "User", "Super Admin"],
        },
    ];

    const fieldsToDisplay = useMemo(() => {
        if (id) {
            return allFields
                .filter(
                    (field) =>
                        field.id !== "password" &&
                        field.id !== "konfirmasi_password",
                )
                .map((field) =>
                    field.id === "nama" ? { ...field, disabled: true } : field,
                );
        }
        else {
            if (formData?.role === "Super Admin") {
                return allFields.map((field) => {
                    if (field.id === "NIP" || field.id === "role") {
                        return { ...field, disabled: true };
                    }
                    return field;
                });
            }
            else {
                return allFields.filter(
                    (field) =>
                        field.id === "nama" ||
                        field.id === "password" ||
                        field.id === "konfirmasi_password",
                );
            }
        }
    }, [id, formData]); 

    const fetchInitialData = useCallback(async () => {
        setIsLoading(true);
        setError("");
        try {
            const responseData = id
                ? await getUserById(id)
                : await getProfile();
            const userData = responseData.data;

            if (userData.unitKerja && userData.unitKerja.includes(" / ")) {
                const parts = userData.unitKerja.split(" / ");
                userData.unitKerja = parts[0].trim();
                userData.lokasi = parts[1].trim();
            }

            setFormData(userData);
        } catch (err) {
            setError("Gagal memuat data untuk diedit.");
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

        if (
            formData.password &&
            formData.password !== formData.konfirmasi_password
        ) {
            setError("Konfirmasi password tidak cocok.");
            return;
        }

        setIsLoading(true);
        try {
            let finalUnitKerja = formData.unitKerja;
            if (
                formData.unitKerja &&
                formData.unitKerja !== "Balai" &&
                formData.lokasi
            ) {
                finalUnitKerja = `${formData.unitKerja} / ${formData.lokasi}`;
            }

            const payload = {
                nama: formData.nama,
                NIP: formData.NIP,
                jabatan: formData.jabatan,
                unitKerja: finalUnitKerja,
                role: formData.role,
            };

            if (formData.password) {
                payload.password = formData.password;
            }

            if (id) {
                await updateUserDetail(id, payload);
            } else {
                await updateProfile(payload);
            }

            setIsSuccessModalOpen(true);
        } catch (err) {
            setError(
                err.response?.data?.message || "Gagal menyimpan perubahan.",
            );
        } finally {
            setIsLoading(false);
        }
    };

    const handleModalClose = () => {
        setIsSuccessModalOpen(false);
        navigate(id ? `/akun/${id}` : "/profile");
    };

    if (isLoading) {
        return (
            <div className="flex  items-center justify-center h-screen bg-[#242424] text-white">
                Memuat data...
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
                            Manajemen Akun
                        </p>
                    </header>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-4 h-fit p-4 md:p-6 bg-[#171717] rounded-lg md:rounded-2xl"
                    >
                        <div className="flex justify-between items-center">
                            <p className="text-white font-semibold text-xl">
                                Edit Akun
                            </p>
                            <div className="flex gap-3">
                                <Button
                                    text="Kembali"
                                    bgColor="bg-gray-600"
                                    onClick={handleBack}
                                    type="button"
                                />
                                <Button
                                    text={isLoading ? "Menyimpan..." : "Simpan"}
                                    bgColor="bg-[#1f4f27]"
                                    type="submit"
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {error && (
                            <p className="text-red-500 text-sm text-center mt-2">
                                {error}
                            </p>
                        )}

                        {formData && (
                            <div className="flex flex-col gap-6 h-full mt-2">
                                <FormAkun
                                    title="Data Akun"
                                    fields={fieldsToDisplay}
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
                message="Data akun telah berhasil diperbarui."
            />
        </div>
    );
};

export default EditAkun;
