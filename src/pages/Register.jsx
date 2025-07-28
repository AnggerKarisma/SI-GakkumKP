import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  LockKeyhole,
  UserPen,
  UsersRound,
  MapPinHouse,
  Eye,
  EyeOff,
} from "lucide-react";
import Button from "../components/Button";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("");
  const [wilayah, setWilayah] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const handleLoginClick = () => {
    navigate("/login");
  };

  const roleOption = [
    { value: "balai", label: "Balai" },
    { value: "wilayah", label: "Wilayah" },
  ];

  const wilayahOption = [{ value: "Palangkaraya" }];
  return (
      <section className="min-h-screen flex items-center justify-center font-sans bg-[#171717] p-4">
        <div className="flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden sm:max-w-sm md:min-w-3xl bg-[#242424]">
          <div className="hidden md:flex md:flex-col w-full md:w-1/2  items-center justify-center">
            <img
              src="./../../Logo_Kehutanan_white.png"
              alt=""
              className="max-h-65"
            />
          </div>
          <div className="p-10 bg-[#242424] rounded-2xl md:w-1/2">
            <div className="flex flex-col gap-6 items-center text-center rounded-2xl">
              <div className="flex md:hidden w-full justify-center">
                <img
                  src="./../../Logo_Kehutanan_white.png"
                  alt=""
                  className="max-h-25"
                />
              </div>

              <h1 className="text-2xl font-semibold text-white">Registrasi</h1>

              <div className="flex w-full flex-col text-left gap-2">
                <div className="flex border-1 border-white px-2 py-1 outline-none w-full rounded-md ">
                  <UserPen className="text-white flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Nama Lengkap"
                    className="text-sm text-white px-2 w-full outline-none"
                  />
                </div>

                <div className="flex border-1 border-white px-2 py-1 outline-none w-full rounded-md">
                  <Mail className="text-white flex-shrink-0" />
                  <input
                    type="email"
                    placeholder="Email"
                    className="text-sm text-white px-2 w-full outline-none "
                  />
                </div>

                <div className="flex border-1 border-white px-2 py-1 outline-none w-full rounded-md">
                  <UsersRound className="text-white flex-shrink-0" />
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={`text-sm px-2 w-full outline-none bg-transparent ${role === "" ? "text-gray-400" : "text-white"}`}
                  >
                    <option value="" disabled selected>
                      Pilih role
                    </option>
                    <option value="balai" className="text-black">
                      Balai
                    </option>
                    <option value="wilayah" className="text-black">
                      Wilayah
                    </option>
                  </select>
                </div>

                <div className="flex border-1 border-white p-1.5 outline-none w-full rounded-md">
                  <MapPinHouse className="text-white flex-shrink-0" />
                  <select
                    value={wilayah}
                    onChange={(e) => setWilayah(e.target.value)}
                    className={`text-sm px-2 w-full outline-none bg-transparent ${wilayah === "" ? "text-gray-400" : "text-white"}`}
                  >
                    <option value="" disabled selected>
                      Pilih wilayah
                    </option>
                    <option value="Palangkaraya" className="text-black">
                      Palangkaraya
                    </option>
                    <option value="Samarinda" className="text-black">
                      Samarinda
                    </option>
                    <option value="Pontianak" className="text-black">
                      Pontianak
                    </option>
                  </select>
                </div>

                <div className="flex items-center border-1 border-white px-2 py-1 outline-none rounded-lg ">
                  <LockKeyhole className="text-white flex-shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="text-sm text-white px-2 w-full outline-none bg-transparent"
                  />
                  <button
                    onClick={togglePasswordVisibility}
                    className="text-white focus:outline-none hover:cursor-pointer"
                  >
                    {showPassword ? (
                      <EyeOff className="text-white" />
                    ) : (
                      <Eye className="text-white" />
                    )}
                  </button>
                </div>

                <div className="flex items-center border-1 border-white px-2 py-1 outline-none rounded-lg  ">
                  <LockKeyhole className="text-white flex-shrink-0" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Konfirmasi Password"
                    className="text-sm text-white px-2 w-full outline-none bg-transparent"
                  />
                  <button
                    onClick={toggleConfirmPasswordVisibility}
                    className="text-white focus:outline-none hover:cursor-pointer"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="text-white" />
                    ) : (
                      <Eye className="text-white" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end text-center gap-2 py-3 rounded 2xl">
              <Button
                text={"Register"}
                bgColor={"bg-[#1f4f27]"}
                onClick={""}
                disabled={""}
                icon={null}
                shadow={"shadow-md"}
                customWidth={"w-full"}
              />
              <Button
                text={"Login"}
                bgColor={""}
                onClick={handleLoginClick}
                disabled={""}
                icon={null}
                shadow={"shadow-md"}
                border={"border-1"}
                customWidth="w-full"
              />
            </div>
          </div>
        </div>
      </section>
  );
};

export default Register;
