import React, { useEffect, useState } from "react";
import DashboardLayout from "@/Components/DashboardLayout/DashboardLayout";
import { Head, usePage } from "@inertiajs/react";
import Notification from "@/Components/Notification/Notification";
import { Icon } from "@iconify/react";
import {
    BarChart,
    barClasses,
    barElementClasses,
    barLabelClasses,
} from "@mui/x-charts/BarChart";

export default function DashboardPage({
    totalLinks,
    totalClicks,
    topLinks,
    clicksPerMonthShorten,
    totalProjects,
    totalCategories,
    topProjects,
    clicksPerMonthProjects,
}) {
    const { success } = usePage().props;
    const [notification, setNotification] = useState(null);

    useEffect(() => {
        if (success) {
            setNotification({ type: "success", message: success });
        }
    }, [success]);

    // Data Chart Shorten
    const shortenMonths = clicksPerMonthShorten?.map((c) => c.month) || [];
    const shortenCounts = clicksPerMonthShorten?.map((c) => c.count) || [];

    // Data Chart Projects
    const projectMonths = clicksPerMonthProjects?.map((c) => c.month) || [];
    const projectCounts = clicksPerMonthProjects?.map((c) => c.count) || [];

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
                            <Icon icon="mdi:cursor-default-click" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Clicks</p>
                            <p className="text-xl font-bold">{totalClicks}</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow flex items-center gap-4">
                        <div className="p-3 bg-primary-25 rounded-xl text-primary-100 text-2xl">
                            <Icon icon="mdi:folder" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Projects</p>
                            <p className="text-xl font-bold">{totalProjects}</p>
                        </div>
                    </div>
                    <div className="bg-white p-5 rounded-2xl shadow flex items-center gap-4">
                        <div className="p-3 bg-yellow-100 rounded-xl text-yellow-600 text-2xl">
                            <Icon icon="mdi:tag-multiple" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Categories</p>
                            <p className="text-xl font-bold">{totalCategories}</p>
                        </div>
                    </div>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Chart Shorten */}
                    <div className="bg-white p-5 rounded-2xl shadow">
                        <h2 className="text-lg font-semibold mb-4">Clicks per Day (Shorten URLs)</h2>
                        {shortenMonths.length > 0 ? (
                            <BarChart
                                xAxis={[{ scaleType: "band", data: shortenMonths }]}
                                series={[
                                    {
                                        data: shortenCounts,
                                        label: "Shorten URL Clicks",
                                        color: "#004AAD", // solid biru
                                    },
                                ]}
                                height={300}
                            />
                        ) : (
                            <p className="text-gray-500 text-sm">No data available</p>
                        )}
                    </div>

                    {/* Chart Projects */}
                    <div className="bg-white p-5 rounded-2xl shadow">
                        <h2 className="text-lg font-semibold mb-4">Clicks per Day (Projects)</h2>
                        {projectMonths.length > 0 ? (
                            <BarChart
                                xAxis={[{ scaleType: "band", data: projectMonths }]}
                                series={[
                                    {
                                        data: projectCounts,
                                        label: "Project Clicks",
                                    },
                                ]}
                                height={300}
                                sx={{
                                    [`& .${barClasses.series}[data-series="0"] .${barElementClasses.root}`]: {
                                        fill: "url(#bar-gradient)",
                                    },
                                    [`& .${barClasses.seriesLabels}[data-series="0"] .${barLabelClasses.root}`]:
                                    {
                                        fontWeight: "bold",
                                        fill: "#333",
                                    },
                                }}
                            >
                                <defs>
                                    <linearGradient id="bar-gradient" x1="0" x2="0" y1="0" y2="1">
                                        <stop offset="0%" stopColor="#FFD700" />
                                        <stop offset="100%" stopColor="#FFA500" />
                                    </linearGradient>
                                </defs>
                            </BarChart>
                        ) : (
                            <p className="text-gray-500 text-sm">No data available</p>
                        )}
                    </div>
                </div>

                {/* Top Links */}
                <div className="bg-white p-5 rounded-2xl shadow mb-6">
                    <h2 className="text-lg font-semibold mb-4">Top 5 Links</h2>
                    {topLinks?.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {topLinks.map((link) => (
                                <li key={link.id} className="py-3 flex justify-between items-center">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <img
                                            src={`https://www.google.com/s2/favicons?sz=64&domain=${new URL(
                                                link.original_url
                                            ).hostname}`}
                                            alt="favicon"
                                            className="w-6 h-6 rounded-full"
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

                {/* Top Projects */}
                <div className="bg-white p-5 rounded-2xl shadow">
                    <h2 className="text-lg font-semibold mb-4">Top 5 Projects</h2>
                    {topProjects?.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {topProjects.map((proj) => (
                                <li key={proj.id} className="py-3 flex justify-between items-center">
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <Icon icon="mdi:folder-outline" className="w-6 h-6 text-primary-100" />
                                        <a
                                            href={`${window.location.origin}/m/${proj.project_slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="truncate max-w-[300px] text-primary-100 hover:underline text-sm"
                                        >
                                            {proj.project_name}
                                        </a>
                                    </div>
                                    <span className="text-sm font-medium text-gray-700">
                                        {proj.clicks_count} clicks
                                    </span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">No projects available</p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
