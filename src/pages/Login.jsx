import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, LockKeyhole, Eye, EyeOff } from "lucide-react";
import Button from "./../components/Button";
const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRegisterClick = () => {
    navigate("/register");
  };
  const handleLoginClick = () => {
    navigate("/mobil"); 
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
          <div className="p-10 rounded-2xl md:w-1/2">
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
                <div className="flex items-center border-1 border-white py-1 px-2 outline-none rounded-lg">
                  <Mail className="text-white" />
                  <input
                    required
                    type="email"
                    placeholder="NIP"
                    className="text-sm text-white px-2 w-full outline-none bg-transparent"
                  />
                </div>

                <div className="flex items-center border-1 border-white py-1 px-2 outline-none rounded-lg">
                  <LockKeyhole className="text-white" />
                  <input
                    required
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="text-sm text-white px-2 w-full outline-none bg-transparent"
                  />
                  <button
                    onClick={togglePasswordVisibility}
                    className="text-gray-400 focus:outline-none hover:cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="text-white" />
                    ) : (
                      <Eye className="text-white" />
                    )}
                  </button>
                </div>
                <div className="flex gap-1">
                  <a href="#" className="text-sm text-white underline">
                    Lupa Password
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center text-center py-4 gap-3 w-full">
              <Button
                text={"Login"}
                bgColor={"bg-[#1f4f27]"}
                onClick={handleLoginClick}
                disabled={""}
                icon={null}
                shadow={"shadow-md"}
                customWidth={"w-full"}
              />
              <Button
                text={"Daftar"}
                bgColor={""}
                onClick={handleRegisterClick}
                disabled={""}
                icon={null}
                shadow={"shadow-md"}
                border={"border-1"}
                customWidth={"w-full"}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;
