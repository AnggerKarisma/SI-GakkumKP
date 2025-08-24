const FormField = ({
  id,
  label,
  type = "text",
  options = [],
  value = "",
  onChange,
  disabled
}) => {
  const renderInput = () => {
    switch (type) {
      case "select":
        return (
          <select
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`bg-transparent text-sm outline-none pr-2 py-1 w-full ${value === "" ? "text-gray-400" : "text-white"}`}
          >
            <option value="" disabled className="bg-[#242424]">
              Pilih...
            </option>
            {options.map((option) => (
              <option key={option} value={option} className="bg-[#242424]">
                {option}
              </option>
            ))}
          </select>
        );
      default: // 'text' dan lainnya
        return (
          <input
            type="text"
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            disabled={id === "jenis" || disabled}
            className="bg-transparent outline-none text-white pr-2 py-1 w-full"
          />
        );
    }
  };
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
      <label htmlFor={id} className="text-sm text-gray-300 md:w-2/5">
        {label}
      </label>
      <div className={`flex text-sm px-2 py-1 outline-none md:w-3/5 rounded-md ${disabled? "border-none" : "border-1 border-gray-400"}`}>
        {renderInput()}
      </div>
    </div>
  );
};

// Komponen Reusable untuk satu bagian formulir (misalnya, "Data Mobil")
const FormKendaraan = ({ title, fields, formData, handleChange, disabled }) => {
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
              type={field.type}
              options={field.options}
              value={formData[field.id] || ""}
              onChange={handleChange}
              disabled={disabled}
            />
          ))}
        </div>
        <div className="flex flex-col gap-y-4 w-full md:w-1/2">
          {secondColumnFields.map((field) => (
            <FormField
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              options={field.options}
              value={formData[field.id] || ""}
              onChange={handleChange}
              disabled={disabled}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormKendaraan;
