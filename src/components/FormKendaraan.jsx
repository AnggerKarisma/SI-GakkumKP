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
const FormKendaraan = ({ title, fields, formData, handleChange }) => {
  const middleIndex = Math.ceil(fields.length / 2);
  const firstColumnFields = fields.slice(0, middleIndex);
  const secondColumnFields = fields.slice(middleIndex);

  return (
    <div className="flex flex-col gap-4 px-4 py-4 border-2 border-gray-600 rounded-xl">
      <p className="text-lg font-semibold text-white">{title}</p>
      {/* Menggunakan CSS Grid untuk layout 2 kolom di desktop */}
      <div className="flex flex-col md:flex-row gap-x-8">
        <div className="flex flex-col gap-y-4 w-full md:w-1/2">
        {firstColumnFields.map((field) => (
          <FormField
            key={field.id}
            id={field.id}
            label={field.label}
            value={formData[field.id]}
            onChange={handleChange}
          />
        ))}
        </div>
        <div className="flex flex-col gap-y-4 w-full md:w-1/2">
        {secondColumnFields.map((field) => (
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
    </div>
  );};


export default FormKendaraan;