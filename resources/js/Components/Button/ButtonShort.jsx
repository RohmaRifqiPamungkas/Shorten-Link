import { FiPlus } from "react-icons/fi";

export default function ShortenButton({
  onClick,
  icon = <FiPlus size={18} />,
  label = "Shorten",
  className = "",
  type = "button",
}) {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`bg-secondary hover:bg-primary-100 text-white px-3 py-2 flex items-center gap-1 rounded-lg ${className}`}
    >
      {icon} {label}
    </button>
  );
}
