const FormField = ({ id, label, value, onChange }) => (
  // Di layar kecil (mobile), item akan tersusun vertikal (flex-col)
  // Di layar medium ke atas, item akan tersusun horizontal (md:flex-row)
  <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
    <label htmlFor={id} className="text-sm text-gray-300 md:w-2/5">
      {label}
    </label>
    <input
      type="text"
      id={id}
      name={id}
      value={value || ""}
      onChange={onChange}
      className="bg-transparent text-white border-1 px-2 py-1 border-gray-400 rounded-md w-full md:w-3/5"
    />
  </div>
);

// Komponen Reusable untuk satu bagian formulir (misalnya, "Data Mobil")
const FormKendaraan = ({ title, fields, formData, handleChange }) => (
  <div className="flex flex-col gap-4 px-4 py-4 border-2 border-gray-600 rounded-xl">
    <p className="text-lg font-semibold text-white">{title}</p>
    {/* Menggunakan CSS Grid untuk layout 2 kolom di desktop */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
      {fields.map((field) => (
        <FormField
          key={field.id}
          id={field.id}
          label={field.label}
          value={formData[field.id]}
          onChange={handleChange}
        />
      ))}
    </div>
  </div>
);


export default FormKendaraan;