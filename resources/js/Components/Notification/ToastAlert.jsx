import React, { useEffect } from "react";
import ReactDOM from "react-dom";
import { Icon } from "@iconify/react";

const ToastAlert = ({ message, type = "success", onClose, title }) => {
  if (!message) return null;

  // Icon & color berdasarkan type
  const typeConfig = {
    success: {
      icon: "ph:check-circle-bold",
      color: "text-green-600",
      border:
        "border border-green-200 bg-gradient-to-r from-green-50/90 to-white/80 backdrop-blur-md",
    },
    error: {
      icon: "ph:x-circle-bold",
      color: "text-red-600",
      border:
        "border border-red-200 bg-gradient-to-r from-red-50/90 to-white/80 backdrop-blur-md",
    },
    info: {
      icon: "ph:info-bold",
      color: "text-blue-600",
      border:
        "border border-blue-200 bg-gradient-to-r from-blue-50/90 to-white/80 backdrop-blur-md",
    },
    warning: {
      icon: "ph:warning-bold",
      color: "text-yellow-600",
      border:
        "border border-yellow-200 bg-gradient-to-r from-yellow-50/90 to-white/80 backdrop-blur-md",
    },
  };

  const cfg = typeConfig[type] || typeConfig.info;

  // Auto-close
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  // Elemen Toast
  const toastElement = (
    <div className="fixed top-6 right-6 z-[9999] w-full max-w-sm transition-all duration-500 animate-fadeIn">
      <div
        className={`flex items-start gap-3 px-4 py-3 border rounded-xl shadow-sm ${cfg.border} text-sm`}
      >
        {/* Icon */}
        <Icon icon={cfg.icon} width="22" className={`${cfg.color} flex-shrink-0`} />

        {/* Text */}
        <div className="flex-1">
          <p className={`font-semibold ${cfg.color}`}>
            {title || `${type.charAt(0).toUpperCase() + type.slice(1)} Toast`}
          </p>
          <p className="text-gray-600 text-sm">{message}</p>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          ✕
        </button>
      </div>
    </div>
  );

  return ReactDOM.createPortal(toastElement, document.body);
};

export default ToastAlert;
