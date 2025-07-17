import React from "react";

const Button = ({ text, bgColor, onClick, disabled = false, icon = null, shadow=""}) => {
    return(
        <button
            onClick = {onClick}
            disabled = {disabled}
            className = {`flex items-center justify-center cursor-pointer rounded-lg ${bgColor} ${shadow} border p-2 px-4 md:px-6 min-w-[120px] md:min-w-[150px] text-white font-bold text-sm md:text-base transition-opacity duration-150 ${disabled ? 'opacity-60 cursor-not-allowed' : 'hover:opacity-90'}`}
        >
            {icon}
            {text}
        </button>
    )
}

export default Button;