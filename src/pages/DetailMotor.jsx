import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import DetailKendaraan from "../components/DetailKendaraan";
import DataKendaraan from "../dummy/kendaraan";

// Data untuk field formulir "Data Motor"
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

const DetailMotor = ({ isSidebarOpen }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    const data = DataKendaraan.find(
      (kendaraan) => kendaraan.id_kendaraan === id,
    );

    if (data) {
      setDetailData(data);
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/motor/edit/${id}`);
  };

  if (!detailData) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#242424] text-white">
        Memuat data atau data tidak ditemukan...
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
            <p className="text-white font-semibold text-2xl">Manajemen Motor</p>
          </header>
          <div className="flex flex-col gap-4 h-fit p-4 md:p-6 bg-[#171717] rounded-lg md:rounded-2xl">
            {/* Header dengan judul dan tombol aksi */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <p className="text-white font-semibold text-xl">
                {detailData.nama_kendaraan} - {detailData.plat}
              </p>
              <div className="flex gap-3 w-full md:w-auto">
                <Button
                  text={"Pinjam"}
                  bgColor={"bg-[#1f4f27]"}
                  additionalClasses="w-full md:w-auto"
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
                  onClick={handleEdit}
                />
              </div>
            </div>
            {/* Konten detail menggunakan komponen DetailKendaraan */}
            <div className="flex flex-col gap-6 h-full mt-2">
              <DetailKendaraan
                title="Data Motor"
                fields={dataMotorFields}
                data={detailData}
              />
              <DetailKendaraan
                title="Data STNK"
                fields={dataStnkFields}
                data={detailData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailMotor;
