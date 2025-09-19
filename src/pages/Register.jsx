import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  BookUser,
  LockKeyhole,
  UserPen,
  UsersRound,
  Briefcase,
  MapPin,
  Eye,
  EyeOff,
} from "lucide-react";
import Button from "../components/Button";
import { register } from "../services/authService";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        nama: "",
        NIP: "",
        jabatan: "",
        unitKerja: "",
        wilayah: "",
        password: "",
        konfirmasi_password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };
    const handleLoginClick = () => {
        navigate("/login");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError(""); // Hapus error saat pengguna mulai mengetik
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (formData.password !== formData.konfirmasi_password) {
            setError("Konfirmasi password tidak cocok.");
            return;
        }

        setIsLoading(true);
        try {
            let finalUnitKerja;

            if (formData.unitKerja === "Balai") {
                finalUnitKerja = "Balai";
            } else {
                // Konversi wilayah menjadi format yang benar
                let sekwil;
                switch (formData.wilayah) {
                    case "Palangka Raya":
                        sekwil = "Sekwil I";
                        break;
                    case "Samarinda":
                        sekwil = "Sekwil II";
                        break;
                    case "Pontianak":
                        sekwil = "Sekwil III";
                        break;
                    default:
                        sekwil = "Wilayah Tidak Dikenal";
                }
                finalUnitKerja = `${sekwil} / ${formData.wilayah}`;
            }

            // 5. Siapkan payload untuk dikirim ke API
            const payload = {
                nama: formData.nama,
                NIP: formData.NIP,
                password: formData.password,
                jabatan: formData.jabatan,
                unitKerja: finalUnitKerja,
            };

            await register(payload);
            // Jika berhasil, arahkan ke halaman login
            navigate("/login");
        } catch (err) {
            const errorMessage =
                err.response?.data?.message ||
                "Registrasi gagal. Silakan coba lagi.";
            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <section className="min-h-screen flex items-center justify-center font-sans bg-[#171717] p-4">
            <form
                className="flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden sm:max-w-sm md:min-w-3xl bg-[#242424]"
                onSubmit={handleSubmit} // Gunakan onSubmit pada form
            >
                <div className="hidden md:flex md:flex-col w-full md:w-1/2 items-center justify-center">
                    <img
                        src="./../../Logo_Kehutanan_white.png"
                        alt="Logo Gakkum"
                        className="max-h-65"
                    />
                </div>
                <div className="p-10 bg-[#242424] rounded-2xl md:w-1/2">
                    <div className="flex flex-col gap-6 items-center text-center rounded-2xl">
                        <div className="flex md:hidden w-full justify-center">
                            <img
                                src="./../../Logo_Kehutanan_white.png"
                                alt="Logo Gakkum"
                                className="max-h-25"
                            />
                        </div>
                        <h1 className="text-2xl font-semibold text-white">
                            Registrasi
                        </h1>
                        <div className="flex w-full flex-col text-left gap-2">
                            {/* Input Nama, NIP, Jabatan */}
                            <InputField
                                icon={<UserPen />}
                                name="nama"
                                placeholder="Nama Lengkap"
                                value={formData.nama}
                                onChange={handleChange}
                            />
                            <InputField
                                icon={<BookUser />}
                                name="NIP"
                                placeholder="NIP"
                                value={formData.NIP}
                                onChange={handleChange}
                            />
                            <InputField
                                icon={<Briefcase />}
                                name="jabatan"
                                placeholder="Jabatan"
                                value={formData.jabatan}
                                onChange={handleChange}
                            />

                            {/* Select Role & Wilayah */}
                            <SelectField
                                icon={<UsersRound />}
                                name="unitKerja"
                                value={formData.unitKerja}
                                onChange={handleChange}
                                defaultOption="Pilih Unit Kerja"
                                options={["Balai", "Wilayah"]}
                            />
                            {formData.unitKerja === "Wilayah" && (
                                <SelectField
                                    icon={<MapPin />}
                                    name="wilayah"
                                    value={formData.wilayah}
                                    onChange={handleChange}
                                    defaultOption="Pilih Lokasi Wilayah"
                                    options={[
                                        "Palangka Raya",
                                        "Samarinda",
                                        "Pontianak",
                                    ]}
                                />
                            )}

                            {/* Input Password */}
                            <PasswordField
                                icon={<LockKeyhole />}
                                name="password"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                                show={showPassword}
                                toggle={togglePasswordVisibility}
                            />
                            <PasswordField
                                icon={<LockKeyhole />}
                                name="konfirmasi_password"
                                placeholder="Konfirmasi Password"
                                value={formData.konfirmasi_password}
                                onChange={handleChange}
                                show={showConfirmPassword}
                                toggle={toggleConfirmPasswordVisibility}
                            />
                        </div>
                    </div>
                    {error && (
                        <p className="text-red-500 text-sm text-center mt-4">
                            {error}
                        </p>
                    )}
                    <div className="flex flex-col items-end text-center gap-2 py-3 rounded 2xl">
                        <Button
                            text={isLoading ? "Memproses..." : "Register"}
                            bgColor={"bg-[#1f4f27]"}
                            type="submit" // Tombol Register adalah tipe submit
                            disabled={isLoading}
                            shadow={"shadow-md"}
                            customWidth={"w-full"}
                        />
                        <div className="text-sm text-white">
                            Sudah Punya Akun?{" "}
                            <button
                                className="underline cursor-pointer"
                                type="button"
                                onClick={handleLoginClick}
                            >
                                Login disini
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </section>
    );
};

// --- Komponen kecil untuk merapikan JSX ---
const InputField = ({ icon, ...props }) => (
    <div className="flex items-center border-1 border-white px-2 py-1 outline-none w-full rounded-md">
        {React.cloneElement(icon, { className: "text-white flex-shrink-0" })}
        <input
            {...props}
            className="text-sm text-white px-2 w-full outline-none bg-transparent"
        />
    </div>
);

const SelectField = ({
    icon,
    name,
    value,
    onChange,
    defaultOption,
    options,
}) => (
    <div className="flex items-center border-1 border-white px-2 py-1 outline-none w-full rounded-md">
        {React.cloneElement(icon, { className: "text-white flex-shrink-0" })}
        <select
            name={name}
            value={value}
            onChange={onChange}
            required
            className={`text-sm px-2 w-full outline-none bg-transparent ${value === "" ? "text-gray-400" : "text-white"}`}
        >
            <option value="" disabled>
                {defaultOption}
            </option>
            {options.map((opt) => (
                <option key={opt} value={opt} className="text-black">
                    {opt}
                </option>
            ))}
        </select>
    </div>
);

const PasswordField = ({ icon, show, toggle, ...props }) => (
    <div className="flex items-center border-1 border-white px-2 py-1 outline-none rounded-lg">
        {React.cloneElement(icon, { className: "text-white flex-shrink-0" })}
        <input
            {...props}
            type={show ? "text" : "password"}
            className="text-sm text-white px-2 w-full outline-none bg-transparent"
        />
        <div
            type="button"
            onClick={toggle}
            className="text-white focus:outline-none hover:cursor-pointer"
        >
            {show ? <EyeOff /> : <Eye />}
        </div>
    </div>
);

export default Register;
