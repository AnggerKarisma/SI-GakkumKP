import React, { useState } from "react";
import Button from "../components/Button";
import FormKendaraan from "../components/FormKendaraan";

// Data untuk field formulir "Data Motor"
const dataMotorFields = [
  // Kolom kiri
  [
    { id: "nama_motor", label: "Nama Motor" },
    { id: "plat", label: "Plat" },
    { id: "nama_pemilik", label: "Nama Pemilik" },
    { id: "merk_tipe", label: "Merk / Tipe" },
    { id: "jenis_model", label: "Jenis / Model" },
  ],
  // Kolom kanan
  [
    { id: "kondisi", label: "Kondisi" },
    { id: "penanggungjawab", label: "Penanggungjawab" },
    { id: "unit_kerja", label: "Unit Kerja" },
    { id: "nup", label: "NUP" },
    { id: "lokasi_barang", label: "Lokasi Barang" },
  ],
];

// Data untuk field formulir "Data STNK"
const dataStnkFields = [
  // Kolom kiri
  [
    { id: "alamat_stnk", label: "Alamat STNK" },
    { id: "tahun_pembuatan", label: "Tahun Pembuatan" },
    { id: "isi_silinder", label: "Isi Silinder" },
    { id: "warna_kb", label: "Warna KB" },
    { id: "bahan_bakar", label: "Bahan Bakar" },
    { id: "tahun_registrasi", label: "Tahun Registrasi" },
  ],
  // Kolom kanan
  [
    { id: "no_rangka", label: "Nomor Rangka" },
    { id: "no_mesin", label: "Nomor Mesin" },
    { id: "no_bpkb", label: "Nomor BPKB" },
    { id: "warna_tnkb", label: "Warna TNKB" },
    { id: "berlaku_sampai", label: "Berlaku Sampai" },
    { id: "biaya_pajak", label: "Biaya Pajak" },
  ],
];

const TambahMotor = ({ isSidebarOpen }) => {
  const [formData, setFormData] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data yang disimpan:", formData);
  };

  return (
    <div className="transition-all flex duration-300">
      <div
        className={`bg-[#242424] mt-16 p-2 w-full min-h-screen transition-all duration-300 ${isSidebarOpen ? "ml-0 z-2 md:ml-64" : "ml-0"}`}
      >
        <div className="flex flex-col px-3 py-2 h-full">
          <header>
            <p className="text-white font-semibold text-2xl">Manajemen Motor</p>
          </header>
          <form
            className="flex flex-col gap-3 h-fit p-5 mt-3 bg-[#171717] rounded-lg md:rounded-2xl"
            onSubmit={handleSubmit}
          >
            <div className="flex justify-between">
              <p className="text-white font-semibold text-xl">Tambah Motor</p>
              <div className="flex gap-2">
                <Button
                  text={"Reset"}
                  bgColor={"bg-red-800"}
                  customWidth={"w-30"}
                  onClick={handleReset}
                  type={"button"}
                />
                <Button
                  text={"Simpan"}
                  bgColor={"bg-[#1f4f27]"}
                  customWidth={"w-30"}
                  type={"submit"}
                />
              </div>
            </div>
            <div className="flex flex-col gap-5 h-full">
              <FormKendaraan
                title="Data Motor"
                fields={dataMotorFields}
                formData={formData}
                handleChange={handleChange}
              />
              <FormKendaraan
                title="Data STNK"
                fields={dataStnkFields}
                formData={formData}
                handleChange={handleChange}
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TambahMotor;
