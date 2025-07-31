// Komponen Reusable untuk satu bagian formulir (misalnya, "Data Mobil" atau "Data STNK")
const FormKendaraan = ({ title, fields, formData, handleChange }) => (
  <div className="flex flex-col gap-2 px-4 py-2 border-2 border-gray-400 rounded-xl">
    <div>
      <p className="text-xs text-gray-400">{title}</p>
    </div>
    <div className="flex flex-col md:flex-row gap-5 justify-between mb-3">
      {/* Loop melalui setiap kolom data (kiri dan kanan) */}
      {fields.map((column, colIndex) => (
        <div key={colIndex} className="flex gap-5 w-full md:w-1/2">
          {/* Kolom untuk semua Label */}
          <div className="flex flex-col gap-3.5 text-md text-white w-2/5">
            {column.map(field => (
              <label key={field.id} htmlFor={field.id}>{field.label}</label>
            ))}
          </div>
          {/* Kolom untuk semua Input */}
          <div className="flex flex-col gap-3 text-xs text-white w-3/5">
            {column.map(field => (
              <input
                key={field.id}
                type="text"
                id={field.id}
                name={field.id}
                value={formData[field.id] || ''}
                onChange={handleChange}
                className="bg-transparent text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full"
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default FormKendaraan;