import { ChevronDown } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";

const CustomSelect = ({
  icon: Icon,
  options,
  value,
  onChange,
  placeholder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null);

  const handleSelect = (optionValue) => {
    onChange(optionValue);
    setIsOpen(false);
  };

  // Menutup dropdown saat mengklik di luar area komponen
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative w-full" ref={selectRef}>
      {/* Tampilan input dropdown yang terlihat */}
      <div
        className="flex items-center border-1 border-white py-1 px-2 outline-none rounded-lg w-full cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Icon className="text-white flex-shrink-0" />
        <span className="text-sm px-2 w-full outline-none bg-transparent">
          {selectedOption ? (
            <span className="text-white">{selectedOption.label}</span>
          ) : (
            <span className="text-gray-400">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-white transition-transform duration-200 ${isOpen ? "transform rotate-180" : ""}`}
        />
      </div>

      {/* Daftar opsi yang muncul saat dropdown terbuka */}
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-md shadow-lg">
          <ul className="py-1">
            {options.map((option) => (
              <li
                key={option.value}
                className="px-3 py-2 text-sm text-black cursor-pointer hover:bg-green-700 hover:text-white"
                onClick={() => handleSelect(option.value)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
