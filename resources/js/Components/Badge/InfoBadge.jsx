import React from "react";
import PropTypes from "prop-types";

export default function InfoBadge({
    label,
    color = "#007BFF",
    bgColor = "rgba(0, 123, 255, 0.1)", 
    borderColor = "rgba(0, 123, 255, 0.3)", 
    className = "",
}) {
    return (
        <span
            className={`
        inline-flex items-center px-8 py-1.5 rounded-full border 
        text-sm font-semibold transition-all duration-300 
        hover:scale-105
        ${className}
      `}
            style={{
                color,
                backgroundColor: bgColor,
                borderColor,
            }}
        >
            {label}
        </span>
    );
}

InfoBadge.propTypes = {
    label: PropTypes.string.isRequired,
    color: PropTypes.string,
    bgColor: PropTypes.string,
    borderColor: PropTypes.string,
    className: PropTypes.string,
};
