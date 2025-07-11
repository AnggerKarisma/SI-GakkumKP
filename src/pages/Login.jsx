import React from "react";
import {Mail, LockKeyhole} from 'lucide-react';

const Login = () =>{
  return (
    <>
      <section className="min-h-screen flex items-center 
      justify-center font-sans 
      bg-gradient-to-b from-[#B9FF9B] from-30%
      to-[#E6F6DE] to-100%
      ">
        <div className="flex shadow-2xl rounded-2xl">
          <div className="p-15 bg-[#d6efcb] rounded-2xl">
            <div className="flex flex-col gap-5 items-baseline text-center rounded-2xl">
              <h1 className="text-4xl font-semibold">Selamat Datang</h1>

              <div className="flex w-full flex-col text-md text-left gap-1">
                <span>Email</span>
                <div className="flex border-1 p-1 outline-none rounded-md bg-white">
                  <Mail />
                  <input type="email" placeholder="Email" className="text-sm px-2 w-full outline-none bg-white" />
                </div>
              
                <span>Password</span>
                <div className="flex border-1 p-1 outline-none rounded-md bg-white">
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
              bg-green-500 hover:bg-green-700
              text-white">Login</button>

              <p className="font-normal text-sm">Belum punya akun? <a href="#" className="text-blue-400 hover:underline">Daftar disini</a></p>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default Login
