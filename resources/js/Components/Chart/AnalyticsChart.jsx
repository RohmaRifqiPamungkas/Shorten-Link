import React, { useState } from "react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

export default function AnalyticsChart({
    title = "Overview",
    subtitle = "Earnings & Views Summary",
    dataSets = {
        "Shorten URLs": [],
        "Projects": [],
        "Clicks by Country": [],
    },
    colorMap = {
        "Shorten URLs": "#015196",
        "Projects": "#3BAFDA",
        "Clicks by Country": "#22c55e",
    },
    tabs = ["1M", "3M", "6M"],
    chartTypes = ["Line", "Bar", "Table"],
    onTabChange,
    className = "",
}) {
    const [activeTab, setActiveTab] = useState(tabs[0]);
    const [activeChart, setActiveChart] = useState(chartTypes[0]);
    const [activeDataset, setActiveDataset] = useState("Shorten URLs");

    const handleTabChange = (tab) => {
        setActiveTab(tab);
        onTabChange?.(tab);
    };

    const data = dataSets[activeDataset] || [];
    const color = colorMap[activeDataset] || "#015196";

    return (
        <div
            className={`bg-white/90 rounded-2xl shadow-[0_4px_20px_rgba(1,81,150,0.05)] p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-lg font-semibold text-primary-100">{title}</h2>
                    <p className="text-sm text-gray-500">{subtitle}</p>
                </div>

                {/* Tabs */}
                <div className="flex flex-wrap items-center gap-2 justify-end">
                    {/* Dataset Tabs */}
                    {Object.keys(dataSets).map((dataset) => (
                        <button
                            key={dataset}
                            onClick={() => setActiveDataset(dataset)}
                            className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all ${activeDataset === dataset
                                    ? "bg-primary-100 text-white border-primary-100"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                                }`}
                        >
                            {dataset}
                        </button>
                    ))}

                    {/* Chart Type Tabs */}
                    {chartTypes.map((type) => (
                        <button
                            key={type}
                            onClick={() => setActiveChart(type)}
                            className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all ${activeChart === type
                                    ? "bg-primary-25 text-primary-100 border-primary-100"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                                }`}
                        >
                            {type}
                        </button>
                    ))}

                    {/* Range Tabs */}
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => handleTabChange(tab)}
                            className={`px-3 py-1 text-xs font-medium rounded-lg border transition-all ${activeTab === tab
                                    ? "bg-primary-25 text-primary-100 border-primary-100"
                                    : "bg-white text-gray-600 border-gray-200 hover:bg-gray-100"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Chart Section */}
            {data?.length > 0 ? (
                <div className="h-[432px] w-full">
                    {activeChart === "Line" && (
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor={color} stopOpacity={0.4} />
                                        <stop offset="100%" stopColor={color} stopOpacity={0.05} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 12 }} />
                                <YAxis tick={{ fill: "#888", fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgba(255,255,255,0.9)",
                                        border: "1px solid rgba(1,81,150,0.1)",
                                        borderRadius: "10px",
                                        boxShadow: "0 4px 12px rgba(1,81,150,0.1)",
                                    }}
                                    labelStyle={{ fontWeight: "bold", color: color }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="value"
                                    stroke={color}
                                    strokeWidth={3}
                                    fill="url(#chartGradient)"
                                    dot={false}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}

                    {activeChart === "Bar" && (
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.1} />
                                <XAxis dataKey="month" tick={{ fill: "#888", fontSize: 12 }} />
                                <YAxis tick={{ fill: "#888", fontSize: 12 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "rgba(255,255,255,0.9)",
                                        border: "1px solid rgba(1,81,150,0.1)",
                                        borderRadius: "10px",
                                        boxShadow: "0 4px 12px rgba(1,81,150,0.1)",
                                    }}
                                    labelStyle={{ fontWeight: "bold", color: color }}
                                />
                                <Bar
                                    dataKey="value"
                                    fill={color}
                                    radius={[8, 8, 0, 0]}
                                    maxBarSize={40}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}

                    {activeChart === "Table" && (
                        <div className="overflow-x-auto h-full">
                            <table className="min-w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-600 border-b">
                                        <th className="py-2 px-3">Label</th>
                                        <th className="py-2 px-3">Value</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map((d, i) => (
                                        <tr key={i} className="border-b last:border-none">
                                            <td className="py-2 px-3 text-gray-800">{d.month}</td>
                                            <td className="py-2 px-3 font-medium text-primary-100">{d.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-gray-500 text-sm text-center py-10">No data available</p>
            )}
        </div>
    );
}
