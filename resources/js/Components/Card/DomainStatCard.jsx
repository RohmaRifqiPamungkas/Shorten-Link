import React from "react";
import { Icon } from "@iconify/react";

export default function DomainStatCard({
    title = "Approved Links",
    value = 0,
    subtext = "Total Domains",
    color = "#015196",
    icon = "mdi:link-variant",
    trend = "~",
}) {
    return (
        <div
            className="bg-white/95 rounded-2xl shadow-[0_4px_20px_rgba(1,81,150,0.05)] 
                       p-5 flex flex-col justify-between transition-all duration-300 hover:shadow-md"
        >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                    <span className="text-primary-100 text-xl">{trend}</span>
                    <p className="text-xs text-gray-500 font-medium">Today</p>
                </div>
                <Icon icon={icon} className="text-primary-100 w-5 h-5 opacity-70" />
            </div>

            {/* Content */}
            <div className="flex flex-col items-center text-center">
                <h3 className="text-sm font-semibold text-gray-700 tracking-wide mb-1">
                    {title}
                </h3>
                <span
                    className="text-4xl font-bold"
                    style={{ color }}
                >
                    {value}
                </span>
                <p className="text-xs text-gray-500 mt-1">{subtext}</p>
            </div>
        </div>
    );
}
