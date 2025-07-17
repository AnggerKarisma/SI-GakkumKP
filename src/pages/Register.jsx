import React, { useState } from "react";
import {Mail, LockKeyhole,UserPen,UsersRound,MapPinHouse, Eye, EyeOff} from 'lucide-react';
import Button from "../components/Button";

const Register = () =>{
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("");
  const [wilayah, setWilayah] = useState("");
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <>
      <section className="min-h-screen flex items-center justify-center font-sans bg-gradient-to-b from-[#B9FF9B] to-[#E6F6DE] p-4">
        <div className="flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden sm:max-w-sm md:max-w-3xl bg-[#d6efcb]">
          <div className="hidden md:flex md:flex-col w-full md:w-1/2  items-center justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Logo_Kementerian_Kehutanan.svg/1200px-Logo_Kementerian_Kehutanan.svg.png" alt="" className="max-h-65"/>
            <p className="md:text-2xl pt-2 text-green-600 text-center font-bold">Layanan Pinjam Pakai Transportasi Dinas</p>
          </div>
          <div className="p-10 bg-[#d6efcb] rounded-2xl md:w-1/2">
            <div className="flex flex-col gap-5 items-center text-center rounded-2xl">
              <div className="flex md:hidden w-full justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Logo_Kementerian_Kehutanan.svg/1200px-Logo_Kementerian_Kehutanan.svg.png" alt="" className="max-h-25" />
              </div>

              <h1 className="text-2xl font-semibold">Registrasi</h1>

              <div className="flex w-full flex-col text-md text-left gap-2">
    
                <div className="flex border-1 p-1.5 outline-none w-full rounded-md bg-white focus-within:border-green-600">
                  <UserPen className="text-gray-400 flex-shrink-0"/>
                  <input type="text" placeholder="Nama Lengkap" className="text-sm px-2 w-full outline-none bg-white" />
                </div>

                <div className="flex border-1 p-1.5 outline-none w-full rounded-md bg-white focus-within:border-green-600">
                  <Mail className="text-gray-400 flex-shrink-0"/>
                  <input type="email" placeholder="Email" className="text-sm px-2 w-full outline-none bg-white" />
                </div>

                <div className="flex border-1 p-1.5 outline-none w-full rounded-md bg-white focus-within:border-green-600">
                  <UsersRound className="text-gray-400 flex-shrink-0"/>
                  <select 
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className={`text-sm px-2 w-full outline-none bg-transparent ${role === "" ? 'text-gray-400' : 'text-black'}`}
                  >
                    <option value="" disabled selected>Pilih role</option>
                    <option value="balai" className="text-black">Balai</option>
                    <option value="wilayah" className="text-black">Wilayah</option>
                  </select>
                </div>

                <div className="flex border-1 p-1.5 outline-none w-full rounded-md bg-white focus-within:border-green-600">
                  <MapPinHouse className="text-gray-400 flex-shrink-0"/>
                  <select 
                    value={wilayah}
                    onChange={(e) => setWilayah(e.target.value)}
                    className={`text-sm px-2 w-full outline-none bg-transparent ${wilayah === "" ? 'text-gray-400' : 'text-black'}`}
                  >
                    <option value="" disabled selected>Pilih wilayah</option>
                    <option value="Palangkaraya" className="text-black">Palangkaraya</option>
                    <option value="Samarinda" className="text-black">Samarinda</option>
                    <option value="Pontianak" className="text-black">Pontianak</option>
                  </select>
                </div>

                <div className="flex items-center border-1 p-1.5 outline-none rounded-lg bg-white focus-within:border-green-600 w-full">
                  <LockKeyhole className="text-gray-400 flex-shrink-0" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="text-sm px-2 w-full outline-none bg-transparent" />
                  <button onClick={togglePasswordVisibility} className="text-gray-400 focus:outline-none hover:cursor-pointer">
                    {showPassword ? <EyeOff/> : <Eye/>}
                  </button>
                </div>

                <div className="flex items-center border-1 p-1.5 outline-none rounded-lg bg-white focus-within:border-green-600 w-full">
                  <LockKeyhole className="text-gray-400 flex-shrink-0" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Konfirmasi Password" className="text-sm px-2 w-full outline-none bg-transparent" />
                  <button onClick={togglePasswordVisibility} className="text-gray-400 focus:outline-none hover:cursor-pointer">
                    {showPassword ? <EyeOff/> : <Eye/>}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end text-center gap-2 py-3 bg-[#d6efcb] rounded 2xl">
              <Button text= {"Register"} bgColor={"bg-green-600"} onClick={""} disabled = {""} icon = {null} shadow={"shadow-md"}/>

              <p className="font-normal text-sm">Sudah punya akun? <a href="/login" className="text-blue-500 hover:underline font-semibold">Login disini</a></p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Register
