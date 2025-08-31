import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import DataAkun from "../dummy/akun";
import FormAkun from "../components/FormAkun";

// --- DEFINISI FIELD UNTUK FORMULIR ---
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
  { id: "username", label: "Username" },
  { id: "password", label: "Password", type: "password" },
  { id: "konfirmasi_password", label: "Konfirmasi Password", type: "password" },
  {
    id: "level",
    label: "Level",
    type: "select",
    options: ["Admin", "User"],
  },
];

// --- KOMPONEN HALAMAN EDIT ---
const EditAkun = ({ isSidebarOpen }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State untuk menyimpan data yang sedang diedit
  const [formData, setFormData] = useState(null);
  // State untuk menyimpan data asli (untuk fungsi batal)
  const [originalData, setOriginalData] = useState(null);

  useEffect(() => {
    const dataToEdit = DataAkun.find((akun) => akun.id === id);
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

  const handleReset = () => {
    setFormData(originalData);
  };

  const handleBack = () => {
    navigate(-1);
    n;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Data yang diperbarui:", formData);
    navigate(`/akun/${id}`);
  };

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
            <p className="text-white font-semibold text-2xl">Manajemen Akun</p>
          </header>
          <form
            className="flex flex-col gap-4 h-fit p-4 md:p-6 bg-[#171717] rounded-lg md:rounded-2xl"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <p className="text-white font-semibold text-xl">Edit Akun</p>
              <div className="flex gap-3 w-full md:w-auto">
                <Button
                  text={"Kembali"}
                  bgColor={"bg-gray-600"}
                  additionalClasses="w-full md:w-auto"
                  onClick={handleBack}
                  type={"button"}
                />
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
            <div className="flex flex-col gap-6 h-full mt-2">
              <FormAkun
                title="Data Akun"
                fields={akunFields}
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

export default EditAkun;
