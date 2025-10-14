import React from "react";
import PropTypes from "prop-types";

export default function GlassBadge({
    children,
    color = "#004AAD",
    borderColor = "#ffffff31",
    bgOpacity = "10",
    blur = "md",
    className = "",
}) {
    return (
        <span
            className={`
        inline-block px-6 py-2 rounded-full border text-sm font-medium 
        backdrop-blur-${blur} shadow-lg transition-all duration-300 hover:scale-105
        mb-8
        ${className}
      `}
            style={{
                color,
                borderColor,
                backgroundColor: `rgba(255,255,255,0.${bgOpacity})`,
                boxShadow: `${color}1A 0px 4px 10px`,
            }}
        >
            {children}
        </span>
    );
}

GlassBadge.propTypes = {
    children: PropTypes.node.isRequired,
    color: PropTypes.string,
    borderColor: PropTypes.string,
    bgOpacity: PropTypes.string,
    blur: PropTypes.string,
    className: PropTypes.string,
};
