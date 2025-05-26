
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

export default function Notification({ type, message, onClose }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer1 = setTimeout(() => setFadeOut(true), 2500);
    const timer2 = setTimeout(() => onClose(), 3000);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, [onClose]);

  const isSuccess = type === "success";
  const bgColor = isSuccess ? "bg-green-100" : "bg-red-100";
  const textColor = isSuccess ? "text-green-800" : "text-red-800";
  const borderColor = isSuccess ? "border-green-300" : "border-red-300";
  const iconColor = isSuccess ? "text-green-600" : "text-red-600";
  const icon = isSuccess
    ? "mdi:check-circle"
    : "mdi:alert-circle-outline";

  return (
    <div
      className={`flex items-center gap-2 px-4 py-3 mb-4 rounded-md border ${bgColor} ${borderColor} ${textColor} transition-opacity duration-500 ${
        fadeOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <Icon icon={icon} className={`${iconColor} w-5 h-5`} />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}
