import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import FormKendaraan from "../components/FormKendaraan";
import { DataKendaraan } from "../dummy/kendaraan";

// --- DEFINISI FIELD UNTUK FORMULIR ---
// Ini mendefinisikan field mana yang akan ditampilkan di formulir
const dataMobilFields = [
  { id: "nama_kendaraan", label: "Nama Mobil" },
  { id: "plat", label: "Plat" },
  { id: "nama_pemilik", label: "Nama Pemilik" },
  { id: "merk_tipe", label: "Merk / Tipe" },
  { id: "jenis", label: "Jenis" },
  { id: "kondisi", label: "Kondisi" },
  { id: "penanggung_jawab", label: "Penanggung Jawab" },
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

// --- KOMPONEN HALAMAN EDIT ---
const EditMobil = ({ isSidebarOpen }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State untuk menyimpan data yang sedang diedit
  const [formData, setFormData] = useState(null);
  // State untuk menyimpan data asli (untuk fungsi batal)
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    // Cari data kendaraan berdasarkan ID dari URL
    const dataToEdit = DataKendaraan.find(
      (kendaraan) => kendaraan.id_kendaraan === id,
    );
    if (dataToEdit) {
      setFormData(dataToEdit);
      setOriginalData(dataToEdit); // Simpan data asli
    }
  }, [id]);

  // Fungsi untuk menangani perubahan pada input form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData(originalData);
  };

  const handleBack = () => {
    navigate(-1); n
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data yang diperbarui:", formData);
    navigate(`/mobil/${id}`); 
  };

  // Tampilkan pesan loading jika data belum siap
  if (!formData) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#242424] text-white">
        Memuat data...
      </div>
    );
  }

  return (
    <div className="transition-all flex duration-300">
      <div
        className={`bg-[#242424] mt-16 p-4 w-full min-h-screen transition-all duration-300 ${isSidebarOpen ? "md:ml-64" : "ml-0"}`}
      >
        <div className="flex flex-col h-full">
          <header className="mb-4">
            <p className="text-white font-semibold text-2xl">Manajemen Mobil</p>
          </header>
          <form
            className="flex flex-col gap-4 h-fit p-4 md:p-6 bg-[#171717] rounded-lg md:rounded-2xl"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <p className="text-white font-semibold text-xl">Edit Mobil</p>
              <div className="flex gap-3 w-full md:w-auto">
                <Button
                  text={"Kembali"}
                  bgColor={"bg-gray-600"}
                  additionalClasses="w-full md:w-auto"
                  onClick={handleBack}
                  type={"button"}
                />
                <Button
                  text={"Batal"}
                  bgColor={"bg-red-800"}
                  additionalClasses="w-full md:w-auto"
                  onClick={handleCancel}
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
            <div className="flex flex-col gap-6 h-full mt-2">
              <FormKendaraan
                title="Data Mobil"
                fields={dataMobilFields}
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

export default EditMobil;
