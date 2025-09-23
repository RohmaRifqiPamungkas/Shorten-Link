import React, { useEffect, useState } from "react";
import DashboardLayout from "@/Components/DashboardLayout/DashboardLayout";
import { Head, usePage } from "@inertiajs/react";
import Notification from "@/Components/Notification/Notification";
import { Icon } from "@iconify/react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";

// Registrasi chart.js
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

export default function DashboardPage({ totalLinks, totalClicks, topLinks, clicksPerDay }) {
    const { success } = usePage().props;
    const [notification, setNotification] = useState(null);

    // flash message dari backend
    useEffect(() => {
        if (success) {
            setNotification({
                type: "success",
                message: success,
            });
        }
    }, [success]);

    // data chart klik per hari
    const chartData = {
        labels: clicksPerDay.map((c) => c.date),
        datasets: [
            {
                label: "Clicks",
                data: clicksPerDay.map((c) => c.count),
                fill: false,
                borderColor: "#004AAD",
                backgroundColor: "#004AAD",
                tension: 0.3,
            },
        ],
    };

    return (
        <DashboardLayout>
            <Head title="Dashboard" />

            <div className="py-5">
                <h1 className="text-xl md:text-2xl font-semibold text-primary-100 mb-6">
                    Dashboard
                </h1>

                {notification && (
                    <Notification
                        type={notification.type}
                        message={notification.message}
                        onClose={() => setNotification(null)}
                    />
                )}

                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white p-5 rounded-2xl shadow flex items-center gap-4">
                        <div className="p-3 bg-primary-25 rounded-xl text-primary-100 text-2xl">
                            <Icon icon="mdi:link" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Links</p>
                            <p className="text-xl font-bold">{totalLinks}</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow flex items-center gap-4">
                        <div className="p-3 bg-green-100 rounded-xl text-green-600 text-2xl">
                            <Icon icon="mdi:mouse-click" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Clicks</p>
                            <p className="text-xl font-bold">{totalClicks}</p>
                        </div>
                    </div>
                </div>

                {/* Chart */}
                <div className="bg-white p-5 rounded-2xl shadow mb-6">
                    <h2 className="text-lg font-semibold mb-4">Clicks per Day</h2>
                    {clicksPerDay.length > 0 ? (
                        <Line data={chartData} />
                    ) : (
                        <p className="text-gray-500 text-sm">No data available</p>
                    )}
                </div>

                {/* Top Links */}
                <div className="bg-white p-5 rounded-2xl shadow">
                    <h2 className="text-lg font-semibold mb-4">Top 5 Links</h2>
                    {topLinks.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {topLinks.map((link) => (
                                <li
                                    key={link.id}
                                    className="py-3 flex justify-between items-center"
                                >
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <img
                                            src={`https://www.google.com/s2/favicons?sz=64&domain=${new URL(link.original_url).hostname}`}
                                            alt="favicon"
                                            className="w-6 h-6 rounded-full"
                                            onError={(e) => {
                                                e.currentTarget.onerror = null;
                                                e.currentTarget.src =
                                                    "https://cdn-icons-png.flaticon.com/512/565/565547.png";
                                            }}
                                        />
                                        <a
                                            href={`${window.location.origin}/s/${link.short_code}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="truncate max-w-[300px] text-primary-100 hover:underline text-sm"
                                        >
                                            {window.location.origin}/s/{link.short_code}
                                        </a>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {link.clicks_count} clicks
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">No links available</p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
