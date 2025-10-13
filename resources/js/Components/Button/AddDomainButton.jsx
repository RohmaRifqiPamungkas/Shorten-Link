import { FiPlus } from "react-icons/fi";

export default function AddDomainButton({
    onClick,
    icon = <FiPlus size={18} />,
    label = "Add Domain",
    className = "",
    type = "button",
    disabled = false,
}) {
    return (
        <button
            onClick={onClick}
            type={type}
            disabled={disabled}
            className={`flex items-center gap-1 justify-center px-4 py-2 rounded-md font-semibold text-sm transition-all duration-150
        ${disabled
            ? "bg-gray-300 text-gray-700 cursor-not-allowed"
            : "bg-gradient-to-r from-orange-500 to-yellow-500 text-white hover:brightness-110 shadow-md hover:shadow-lg"
            }
        ${className}`}
        >
            {icon}
            {label}
        </button>
    );
}
