import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const FormField = ({
  id,
  label,
  type = "text",
  options = [],
  value ="",
  onChange,
  showPassword,
  togglePassword,
}) => {
  const renderInput = () => {
    switch (type) {
      case "password":
        return (
          <div className="flex items-center w-full">
            <input
              type={showPassword ? "text" : "password"}
              id={id}
              name={id}
              value={value}
              onChange={onChange}
              className="bg-transparent text-white pr-2 py-1 w-full outline-none"
            />
            <div
              type="button"
              onClick={togglePassword}
              className="flex text-gray-400 cursor-pointer"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </div>
          </div>
        );
      case "select":
        return (
          <select
            id={id}
            name={id}
            value={value}
            onChange={onChange}
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
            className="bg-transparent outline-none text-white pr-2 py-1 w-full"
          />
        );
    }
  };
  return (
    // Di layar kecil (mobile), item akan tersusun vertikal (flex-col)
    // Di layar medium ke atas, item akan tersusun horizontal (md:flex-row)
    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-4">
      <label htmlFor={id} className="text-sm text-gray-300 md:w-2/5">
        {label}
      </label>
      <div className="flex border-1 text-sm border-gray-400 px-2 py-1 outline-none md:w-3/5 rounded-md">
        {renderInput()}
      </div>
    </div>
  );
};

// Komponen Reusable untuk satu bagian formulir (misalnya, "Data Mobil")
const FormAkun = ({ title, fields, formData, handleChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const middleIndex = Math.ceil(fields.length / 2);
  const firstColumnFields = fields.slice(0, middleIndex);
  const secondColumnFields = fields.slice(middleIndex);

  return (
    <div className="flex flex-col gap-4 px-4 py-4 border-2 border-gray-600 rounded-xl">
      <p className="text-lg font-semibold text-white">{title}</p>
      {/* Menggunakan Flexbox untuk membuat dua kolom */}
      <div className="flex flex-col md:flex-row gap-x-8">
        {/* Kolom Pertama */}
        <div className="flex flex-col gap-y-4 w-full md:w-1/2">
          {firstColumnFields.map((field) => (
            <FormField
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              options={field.options}
              value={formData[field.id]}
              onChange={handleChange}
              showPassword={
                field.id === "password" ? showPassword : showConfirmPassword
              }
              togglePassword={
                field.id === "password"
                  ? () => setShowPassword((p) => !p)
                  : () => setShowConfirmPassword((p) => !p)
              }
            />
          ))}
        </div>
        {/* Kolom Kedua */}
        <div className="flex flex-col gap-y-4 w-full md:w-1/2">
          {secondColumnFields.map((field) => (
            <FormField
              key={field.id}
              id={field.id}
              label={field.label}
              type={field.type}
              options={field.options}
              value={formData[field.id]}
              onChange={handleChange}
              showPassword={
                field.id === "password" ? showPassword : showConfirmPassword
              }
              togglePassword={
                field.id === "password"
                  ? () => setShowPassword((p) => !p)
                  : () => setShowConfirmPassword((p) => !p)
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FormAkun;
