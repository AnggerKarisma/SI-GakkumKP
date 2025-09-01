import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button";
import DataAkun from "../dummy/akun";
import FieldAkun from "../components/FieldAkun";
// Data untuk field formulir "Data Mobil"
const akunFields = [
  { id: "nama", label: "Nama" },
  { id: "nip", label: "NIP" },
  { id: "jabatan", label: "Jabatan" },
  {
    id: "unit_kerja",
    label: "Unit Kerja",
    type: "select",
    options: ["Balai", "Seksi Wilayah 1", "Seksi Wilayah 2", "Seksi Wilayah 3"],
  },
  {
    id: "lokasi",
    label: "Lokasi",
    type: "select",
    options: ["Samarinda", "Palangkaraya", "Pontianak"],
  },
  { id: "password", label: "Password", type: "password" },
  { id: "konfirmasi_password", label: "Konfirmasi Password", type: "password" },
  {
    id: "level",
    label: "Level",
    type: "select",
    options: ["Admin", "User"],
  },
];

const DetailAkun = ({ isSidebarOpen }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    const data = DataAkun.find((akun) => akun.id === id);

    if (data) {
      setDetailData(data);
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/akun/edit/${id}`);
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
            <p className="text-white font-semibold text-2xl">Manajemen Akun</p>
          </header>
          <div className="flex flex-col gap-4 h-fit p-4 md:p-6 bg-[#171717] rounded-lg md:rounded-2xl">
            {/* Header dengan judul dan tombol aksi */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <p className="text-white font-semibold text-xl">
                Detail Akun - {detailData.nama}
              </p>
              <div className="flex gap-3 w-full md:w-auto">
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
              <FieldAkun
                title="Data Mobil"
                fields={akunFields}
                data={detailData}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailAkun;
