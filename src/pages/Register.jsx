import React from "react";
import {Mail, LockKeyhole} from 'lucide-react';

const Register = () =>{
  return (
    <>
      <section className="min-h-screen flex items-center justify-center font-sans bg-gradient-to-b from-[#B9FF9B] to-[#E6F6DE] p-4
      ">
        <div className="flex flex-col md:flex-row shadow-2xl rounded-2xl overflow-hidden sm: max-w-sm md:max-w-2xl w-full bg-[#d6efcb]">
          <div className="p-10 bg-[#d6efcb] rounded-2xl">
            <div className="flex flex-col gap-2 items-baseline text-center rounded-2xl">
              <div className="flex md:hidden w-full justify-center">
                <img src="https://www.kehutanan.go.id/s/uploads/medium_GAKKUM_1ba55b0808.png" alt="" className="max-h-25" />
              </div>
              <h1 className="text-3xl font-semibold">Silakan Isi Data</h1>

              <div className="flex w-full flex-col text-md text-left gap-1.5">
                <span>Email</span>
                <div className="flex border-1 p-1 outline-none rounded-md bg-white focus-within:border-green-600">
                  <Mail/>
                  <input type="email" placeholder="Email" className="text-sm px-2 w-full outline-none bg-white" />
                </div>
              
                <span>Password</span>
                <div className="flex border-1 p-1 outline-none rounded-md bg-white focus-within:border-green-600">
                  <LockKeyhole />
                  <input type="password" placeholder="Password" className="text-sm px-2 w-full outline-none bg-white" />
                </div>                
                <div className="flex gap-1  items-center">
                  <input type="checkbox"/>
                  <span className="text-sm">Lupa Password</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end text-center gap-2 bg-[#d6efcb] rounded 2xl">
              <button className="px-10 py-1 text-xl rounded-md 
              bg-green-500 hover:bg-green-700 hover:cursor-pointer
              text-white">Login</button>

              <p className="font-normal text-sm">Belum punya akun? <a href="#" className="text-blue-400 hover:underline">Daftar disini</a></p>
            </div>
          </div>
          <div className="hidden md:flex md:flex-col w-full md:w-1/2 p-10 items-center justify-center">
            <img src="https://www.kehutanan.go.id/s/uploads/medium_GAKKUM_1ba55b0808.png" alt="" className="max-h-50"/>
            <p className="md:text-2xl pt-2 text-center font-bold">LPPTD GAKKUMHUT KALIMANTAN</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default Register
