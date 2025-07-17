import React, { useState } from "react";
import { Mail, LockKeyhole, Eye, EyeOff } from 'lucide-react';
import Button from './../components/Button'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      <section className="min-h-screen flex items-center justify-center font-sans bg-gradient-to-b from-[#B9FF9B] to-[#E6F6DE] p-4">
        <div className="flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden sm:max-w-sm md:max-w-2xl w-full bg-[#d6efcb]">
          <div className="hidden md:flex md:flex-col w-full md:w-1/2 p-10 items-center justify-center">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Logo_Kementerian_Kehutanan.svg/1200px-Logo_Kementerian_Kehutanan.svg.png" alt="Logo Kementerian Kehutanan" className="max-h-65"/>
            <p className="md:text-2xl pt-2 text-center font-bold text-green-600">Layanan Pinjam Pakai Kendaraan Dinas</p>
          </div>
          <div className="p-10 bg-[#d6efcb] rounded-2xl md:w-1/2">
            <div className="flex flex-col gap-2 items-center text-center rounded-2xl">
              <div className="flex md:hidden w-full justify-center">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/0/01/Logo_Kementerian_Kehutanan.svg/1200px-Logo_Kementerian_Kehutanan.svg.png" alt="Logo Kementerian Kehutanan" className="max-h-25" />
              </div>
              <h1 className="text-3xl font-semibold">Selamat Datang</h1>

              <div className="flex w-full flex-col text-md text-left gap-2">
                <span>Email</span>
                <div className="flex items-center border-1 p-2 outline-none rounded-lg bg-white focus-within:border-green-600">
                  <Mail className="text-gray-400"/>
                  <input type="email" placeholder="Email" className="text-sm px-2 w-full outline-none bg-transparent" />
                </div>
              
                <span>Password</span>
                <div className="flex items-center border-1 p-2 outline-none rounded-lg bg-white focus-within:border-green-600">
                  <LockKeyhole className="text-gray-400" />
                  <input type={showPassword ? 'text' : 'password'} placeholder="Password" className="text-sm px-2 w-full outline-none bg-transparent" />
                  <button onClick={togglePasswordVisibility} className="text-gray-400 focus:outline-none hover:cursor-pointer">
                    {showPassword ? <EyeOff/> : <Eye/>}
                  </button>
                </div>                
                <div className="flex gap-1 items-center">
                  <a href="#" className="text-sm text-blue-500 hover:underline">Lupa Password</a>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end text-center py-4 gap-3">
              <Button text= {"Login"} bgColor={"bg-green-600"} onClick={""} disabled = {""} icon = {null} shadow={"shadow-md"}/>

              <p className="font-normal text-sm">Belum punya akun? <a href="/register" className="font-semibold text-blue-500 hover:underline">Daftar disini</a></p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login;
