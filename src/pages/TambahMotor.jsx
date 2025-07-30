import Button from "../components/Button";

const TambahMotor = ({ isSidebarOpen }) => {
  return (
    <div className="transition-all flex duration-300">
      <div
        className={`bg-[#242424] mt-16 p-2 w-full transition-all duration-300 ${isSidebarOpen ? "ml-0 z-2 md:ml-64" : "ml-0"}`}
      >
        <div className="flex flex-col px-3 py-2 h-full">
          <header>
            <p className="text-white font-semibold text-2xl">Manajemen Motor</p>
          </header>
          <form className="flex flex-col gap-3 h-fit p-5 mt-3 bg-[#171717] rounded-lg md:rounded-2xl">
            <div className="flex justify-between">
              <p className="text-white font-semibold text-xl">Tambah Motor</p>
              <div className="flex gap-2">
                <Button
                  text={"Reset"}
                  bgColor={"bg-red-800"}
                  customWidth={"w-30"}
                  disabled={false}
                  type={"reset"}
                />
                <Button
                  text={"Simpan"}
                  bgColor={"bg-[#1f4f27]"}
                  customWidth={"w-30"}
                  disabled={false}
                  type={"submit"}
                />
              </div>
            </div>
            <div className="flex flex-col gap-5 h-full">
              <div className="flex flex-col gap-2 px-4 py-2 border-2 border-gray-400 rounded-xl h-1/2">
                <div>
                  <p className="text-xs text-gray-400">Data Motor</p>
                </div>
                <div className="flex gap-5 justify-between mb-3">
                  <div className="flex flex-col gap-3.5 text-md text-white w-1/6">
                    <label htmlFor="nama_motor">Nama Motor </label>
                    <label htmlFor="plat">Plat </label>
                    <label htmlFor="nama_pemilik">Nama Pemilik </label>
                    <label htmlFor="merk_tipe">Merk / Tipe </label>
                    <label htmlFor="jenis_model">Jenis / Model </label>
                  </div>
                  <div className="flex flex-col gap-3 text-xs text-white w-1/3">
                    <input
                      type="text"
                      id="nama_motor"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                    <input
                      type="text"
                      id="plat"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                    <input
                      type="text"
                      id="nama_pemilik"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                    <input
                      type="text"
                      id="merk_tipe"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                    <input
                      type="text"
                      id="jenis_model"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-3.5 text-md text-white w-1/6">
                    <label htmlFor="kondisi">Kondisi </label>
                    <label htmlFor="penanggungjawab">Penanggungjawab </label>
                    <label htmlFor="unit_kerja">Unit Kerja </label>
                    <label htmlFor="nup">NUP </label>
                    <label htmlFor="lokasi_barang">Lokasi Barang </label>
                  </div>
                  <div className="flex flex-col gap-3 text-xs text-white w-1/3">
                    <input
                      type="text"
                      id="kondisi"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                    <input
                      type="text"
                      id="penanggungjawab"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                    <input
                      type="text"
                      id="unit_kerja"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                    <input
                      type="text"
                      id="nup"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                    <input
                      type="text"
                      id="lokasi_barang"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2 px-4 py-2 border-2 border-gray-400 rounded-xl h-1/2">
                <div>
                  <p className="text-xs text-gray-400">Data STNK</p>
                </div>
                <div className="flex gap-5 justify-between mb-3">
                  <div className="flex flex-col gap-3.5 text-md text-white w-1/6">
                    <label htmlFor="alamat_stnk">Alamat STNK </label>
                    <label htmlFor="tahun_pembuatan">Tahun Pembuatan </label>
                    <label htmlFor="isi_silinder">Isi Silinder </label>
                    <label htmlFor="warna_kb">Warna KB</label>
                    <label htmlFor="bahan_bakar">Bahan Bakar </label>
                    <label htmlFor="tahun_registrasi">Tahun Registrasi </label>
                  </div>
                  <div className="flex flex-col gap-3 text-xs text-white w-1/3">
                    <input
                      type="text"
                      id="nama_motor"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                    <input
                      type="text"
                      id="plat"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                    <input
                      type="text"
                      id="nama_pemilik"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                    <input
                      type="text"
                      id="merk_tipe"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                    <input
                      type="text"
                      id="jenis_model"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                    <input
                      type="text"
                      id="jenis_model"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                  </div>
                  <div className="flex flex-col gap-3.5 text-md text-white w-1/6">
                    <label htmlFor="no_rangka">Nomor Rangka </label>
                    <label htmlFor="no_mesin">Nomor Mesin </label>
                    <label htmlFor="no_bpkb">Nomor BPKB </label>
                    <label htmlFor="warna_tnkb">Warna TNKB </label>
                    <label htmlFor="berlaku_sampai">Berlaku Sampai </label>
                    <label htmlFor="biaya_pajak">Biaya Pajak </label>
                  </div>
                  <div className="flex flex-col gap-3 text-xs text-white w-1/3">
                    <input
                      type="text"
                      id="kondisi"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                    <input
                      type="text"
                      id="penanggungjawab"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                    <input
                      type="text"
                      id="unit_kerja"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                    <input
                      type="text"
                      id="null"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                    <input
                      type="text"
                      id="null"
                      className="text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
                    />
                    <input
                      type="text"
                      id="jenis_model"
                      className="text-white border-1 px-2 py-1 border-gray-400  rounded-md w-full"
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TambahMotor;
