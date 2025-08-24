import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Button from "../components/Button";
import FormKendaraan from "../components/FormKendaraan";
import DataKendaraan from "../dummy/kendaraan";

// Data untuk field formulir "Data Mobil"
const dataMotorFields = [
  { id: "nama_kendaraan", label: "Nama Motor" },
  { id: "plat", label: "Plat" },
  { id: "nama_pemilik", label: "Nama Pemilik" },
  { id: "merk_tipe", label: "Merk / Tipe" },
  { id: "jenis", label: "Jenis" },
  { id: "kondisi", label: "Kondisi" },
  { id: "penanggung_jawab", label: "Penanggungjawab" },
  {
    id: "unit_kerja",
    label: "Unit Kerja",
    type: "select",
    options: ["Balai", "Seksi Wilayah 1", "Seksi Wilayah 2", "Seksi Wilayah 3"],
  },
  {
    id: "lokasi",
    label: "Lokasi Barang",
    type: "select",
    options: ["Samarinda", "Palangkaraya", "Pontianak"],
  },
  { id: "nup", label: "NUP" },
];

// Data untuk field formulir "Data STNK"
const dataStnkFields = [
  { id: "alamat_stnk", label: "Alamat STNK" },
  { id: "tahun_pembuatan", label: "Tahun Pembuatan" },
  { id: "isi_silinder", label: "Isi Silinder" },
  { id: "warna_kb", label: "Warna KB" },
  { id: "bahan_bakar", label: "Bahan Bakar" },
  { id: "tahun_registrasi", label: "Tahun Registrasi" },
  { id: "no_rangka", label: "Nomor Rangka" },
  { id: "no_mesin", label: "Nomor Mesin" },
  { id: "no_bpkb", label: "Nomor BPKB" },
  { id: "warna_tnkb", label: "Warna TNKB" },
  { id: "berlaku_sampai", label: "Berlaku Sampai" },
  { id: "biaya", label: "Biaya Pajak" },
];

const DetailMotor = ({ isSidebarOpen, isFormDisabled }) => {
  const { id } = useParams();
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const dataToEdit = DataKendaraan.find(
      (kendaraan) => kendaraan.id_kendaraan === id,
    );

    if (dataToEdit) {
      setFormData(dataToEdit);
    }
  }, [id]);

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
        className={`bg-[#242424] mt-16 p-4 w-full min-h-screen transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}
      >
        <div className="flex flex-col h-full">
          <header className="mb-4">
            <p className="text-white font-semibold text-2xl">Manajemen Motor</p>
          </header>
          <form
            className="flex flex-col gap-4 h-fit p-4 md:p-6 bg-[#171717] rounded-lg md:rounded-2xl"
            onSubmit={handleSubmit}
          >
            {isFormDisabled ? (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <p className="text-white font-semibold text-xl">Detail Motor</p>
                <div className="flex gap-3 w-full md:w-auto">
                  <Button
                    text={"Pinjam"}
                    bgColor={"bg-[#1f4f27]"}
                    additionalClasses="w-full md:w-auto"
                    onClick={handleReset}
                    type={"button"}
                  />
                  <Button
                    text={"Hapus"}
                    bgColor={"bg-red-800"}
                    additionalClasses="w-full md:w-auto"
                    type={"button"}
                  />
                  <Button
                    text={"Edit"}
                    bgColor={"bg-yellow-600"}
                    additionalClasses="w-full md:w-auto"
                    type={"button"}
                  />
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <p className="text-white font-semibold text-xl">Edit Motor</p>
                <div className="flex gap-3 w-full md:w-auto">
                  <Button
                    text={"Reset"}
                    bgColor={"bg-red-800"}
                    additionalClasses="w-full md:w-auto"
                    onClick={handleReset}
                    type={"button"}
                  />
                  <Button
                    text={"Simpan"}
                    bgColor={"bg-[#1f4f27]"}
                    additionalClasses="w-full md:w-auto"
                    type={"submit"}
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col gap-6 h-full mt-2">
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

export default DetailMotor;
