import React from "react";
import { Icon } from "@iconify/react";
import { LineChart, Line, ResponsiveContainer } from "recharts";

export default function StatCard({
    title = "Total Earning",
    value = "$25,000",
    percentage = "+3.25%",
    subtext = "$21k today",
    data = [
        { value: 12 },
        { value: 18 },
        { value: 10 },
        { value: 22 },
        { value: 16 },
        { value: 25 },
    ],
    color = "#015196",
    up = true, 
    className = "",
}) {
    return (
        <div
            className={`
        relative bg-white/80 backdrop-blur-sm
        rounded-2xl p-5 shadow-[0_4px_20px_rgba(1,81,150,0.05)]
        transform hover:-rotate-1 transition-all duration-300 ease-out
        ${className}
      `}
        >
            <div className="flex items-start justify-between mb-2">
                <p className="text-sm text-gray-500 font-medium">{title}</p>

                {/* Small Line Chart */}
                <div className="w-16 h-10">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke={color}
                                strokeWidth={2}
                                dot={false}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-1">{value}</h2>

            {/* Growth Info */}
            <div className="flex items-center gap-1 text-sm">
                <Icon
                    icon={up ? "mdi:arrow-up" : "mdi:arrow-down"}
                    className={`text-[16px] ${up ? "text-green-500" : "text-red-500"
                        }`}
                />
                <span
                    className={`font-semibold ${up ? "text-green-500" : "text-red-500"
                        }`}
                >
                    {percentage}
                </span>
                <span className="text-gray-500"> {subtext}</span>
            </div>
        </div>
    );
}
