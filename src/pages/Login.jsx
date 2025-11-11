import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, LockKeyhole, Eye, EyeOff, XCircle } from "lucide-react"; // <-- PERUBAHAN 1
import Button from "../components/Button";

import { login } from "../services/authService.js";

const Login = () => {
    const [NIP, setNip] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRegisterClick = () => {
        navigate("/register");
    };

    const handleLogin = async (e) => {
        // Tambahkan e.preventDefault() agar form tidak submit secara default
        e.preventDefault();

        // Validasi sederhana
        if (!NIP || !password) {
            setError("NIP dan Password wajib diisi.");
            return;
        }

        setIsLoading(true); // Mulai proses loading
        setError(""); // Bersihkan error sebelumnya

        try {
            // Kirim kredensial ke service
            const credentials = { NIP, password };
            const data = await login(credentials);

            // Jika sukses:
            // console.log("Login berhasil:", data);
            localStorage.setItem("authToken", data.token); // Simpan token agar tetap login
            navigate("/dashboard"); // Arahkan ke halaman selanjutnya
        } catch (err) {
            // Jika gagal:
            // Ambil pesan error dari respons API, atau tampilkan pesan default
            const errorMessage =
                err.response?.data?.message || "NIP atau Password salah.";
            setError(errorMessage);
        } finally {
            // Apapun hasilnya, hentikan loading
            setIsLoading(false);
        }
    };

    return (
        <>
            <section className="min-h-screen flex items-center justify-center font-sans bg-[#171717] p-4">
                <div className="flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden sm:max-w-sm md:max-w-2xl w-full bg-[#242424]">
                    <div className="hidden md:flex md:flex-col w-full md:w-1/2 p-10 items-center justify-center">
                        <img
                            src="./../../Logo_Kehutanan_white.png"
                            alt="Logo Kementerian Kehutanan"
                            className="max-h-65"
                        />
                    </div>
                    <form
                        className="p-10 rounded-2xl md:w-1/2"
                        onSubmit={handleLogin} // <-- Ganti onClick di Button menjadi onSubmit di Form
                    >
                        <div className="flex flex-col gap-10 items-center text-center rounded-2xl">
                            <div className="flex md:hidden w-full justify-center">
                                <img
                                    src="./../../Logo_Kehutanan_white.png"
                                    alt="Logo Kementerian Kehutanan"
                                    className="max-h-25"
                                />
                            </div>
                            <h1 className="text-3xl text-white font-semibold">
                                Selamat Datang
                            </h1>

                            <div className="flex w-full flex-col gap-3">
                                {/* --- PERUBAHAN 2: Border Input NIP --- */}
                                <div
                                    className={`flex items-center border-1 py-1 px-2 outline-none rounded-lg ${error ? "border-red-500" : "border-white"} transition-colors duration-200`}
                                >
                                    <Mail className="text-white" />
                                    <input
                                        required
                                        minLength={18}
                                        maxLength={18}
                                        type="number"
                                        placeholder="NIP"
                                        className="text-sm text-white px-2 w-full outline-none bg-transparent"
                                        value={NIP}
                                        onChange={(e) => setNip(e.target.value)}
                                    />
                                </div>

                                {/* --- PERUBAHAN 3: Border Input Password --- */}
                                <div
                                    className={`flex items-center border-1 py-1 px-2 outline-none rounded-lg ${error ? "border-red-500" : "border-white"} transition-colors duration-200`}
                                >
                                    <LockKeyhole className="text-white" />
                                    <input
                                        required
                                        type={
                                            showPassword ? "text" : "password"
                                        }
                                        placeholder="Password"
                                        className="text-sm text-white px-2 w-full outline-none bg-transparent"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                    <div
                                        onClick={togglePasswordVisibility}
                                        className="text-gray-400 focus:outline-none hover:cursor-pointer"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="text-white" />
                                        ) : (
                                            <Eye className="text-white" />
                                        )}
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <a
                                        href="#"
                                        className="text-sm text-white underline"
                                    >
                                        Lupa Password
                                    </a>
                                </div>
                            </div>
                        </div>
                        {/* --- PERUBAHAN 4: Blok Error Baru --- */}
                        {error && (
                            <div className="flex w-full items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg mt-4">
                                <XCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm">{error}</p>
                            </div>
                        )}
                        <div className="flex flex-col items-center text-center py-4 gap-3 w-full">
                            <Button
                                type="submit" // <-- Tambahkan type="submit"
                                text={isLoading ? "Memproses..." : "Login"}
                                bgColor={"bg-[#1f4f27]"}
                                // Hapus onClick, karena sudah ditangani onSubmit form
                                disabled={isLoading}
                                icon={null}
                                shadow={"shadow-md"}
                                customWidth={"w-full"}
                            />
                            <Button
                                type="button" // <-- Tambahkan type="button"
                                text={"Daftar"}
                                bgColor={""}
                                onClick={handleRegisterClick}
                                disabled={isLoading} // Nonaktifkan juga saat login
                                icon={null}
                                shadow={"shadow-md"}
                                border={"border-1"}
                                customWidth={"w-full"}
                            />
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Login;
