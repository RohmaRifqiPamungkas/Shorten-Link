import React, { useEffect, useState } from "react";
import DashboardLayout from "@/Components/DashboardLayout/DashboardLayout";
import { Head, usePage } from "@inertiajs/react";
import Notification from "@/Components/Notification/Notification";
import SpotlightCard from "@/Components/Card/SpotlightCard";
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
    clicksByCountry,
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

    // Data Table By Country
    const countryLabels = clicksByCountry?.map(c => c.country || "Unknown") || [];
    const countryCounts = clicksByCountry?.map(c => c.total) || [];

    const [selectedCountry, setSelectedCountry] = useState("");
    const filteredData = selectedCountry
        ? clicksByCountry.filter(c => c.country === selectedCountry)
        : clicksByCountry;

    const getBaseDomain = (domain) => {
        return (domain?.name ?? window.location.origin).replace(/\/$/, "");
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <SpotlightCard
                        spotlightColor="rgba(1,81,150,0.5)"
                        borderColor="rgba(1,81,150,0.15)"
                        className="p-5 rounded-2xl flex items-center gap-4 bg-white/90 backdrop-blur-sm"
                    >
                        <div className="p-3 bg-primary-25 rounded-xl text-primary-100 text-2xl">
                            <Icon icon="mdi:link" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Links</p>
                            <p className="text-xl font-bold">{totalLinks}</p>
                        </div>
                    </SpotlightCard>

                    <SpotlightCard
                        spotlightColor="rgba(34,197,94,0.4)"
                        borderColor="rgba(34,197,94,0.2)"
                        className="p-5 rounded-2xl flex items-center gap-4 bg-white/90 backdrop-blur-sm"
                    >
                        <div className="p-3 bg-green-100 rounded-xl text-green-600 text-2xl">
                            <Icon icon="mdi:cursor-default-click" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Clicks</p>
                            <p className="text-xl font-bold">{totalClicks}</p>
                        </div>
                    </SpotlightCard>

                    <SpotlightCard
                        spotlightColor="rgba(1,81,150,0.4)"
                        borderColor="rgba(1,81,150,0.2)"
                        className="p-5 rounded-2xl flex items-center gap-4 bg-white/90 backdrop-blur-sm"
                    >
                        <div className="p-3 bg-primary-25 rounded-xl text-primary-100 text-2xl">
                            <Icon icon="mdi:folder" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Projects</p>
                            <p className="text-xl font-bold">{totalProjects}</p>
                        </div>
                    </SpotlightCard>

                    <SpotlightCard
                        spotlightColor="rgba(255,165,0,0.4)"
                        borderColor="rgba(255,165,0,0.2)"
                        className="p-5 rounded-2xl flex items-center gap-4 bg-white/90 backdrop-blur-sm"
                    >
                        <div className="p-3 bg-yellow-100 rounded-xl text-yellow-600 text-2xl">
                            <Icon icon="mdi:tag-multiple" />
                        </div>
                        <div>
                            <p className="text-gray-600 text-sm">Total Categories</p>
                            <p className="text-xl font-bold">{totalCategories}</p>
                        </div>
                    </SpotlightCard>
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Chart Shorten */}
                    <SpotlightCard spotlightColor="rgba(1,81,150,0.25)" borderColor="rgba(1,81,150,0.1)" className="p-5 bg-white/95 rounded-2xl backdrop-blur-sm">
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
                    </SpotlightCard>

                    {/* Chart Projects */}
                    <SpotlightCard spotlightColor="rgba(255,200,50,0.4)" borderColor="rgba(255,200,50,0.15)" className="p-5 bg-white/95 rounded-2xl backdrop-blur-sm">
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
                    </SpotlightCard>
                </div>

                {/* By Country Section */}
                <SpotlightCard spotlightColor="rgba(34,197,94,0.25)" borderColor="rgba(34,197,94,0.1)" className="p-5 bg-white/95 rounded-2xl backdrop-blur-sm mb-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-semibold">Clicks by Country</h2>
                        <select
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value)}
                            className="w-full md:w-auto border border-brfourth rounded-lg px-3 py-2 mt-1 bg-white text-gray-700 focus:ring-2 focus:ring-primary-100 focus:border-primary-100 text-sm"
                        >
                            <option value="">All Countries</option>
                            {countryLabels.map((c) => (
                                <option key={c} value={c}>
                                    {c}
                                </option>
                            ))}
                        </select>
                    </div>
                    {filteredData.length > 0 ? (
                        <BarChart
                            xAxis={[{ scaleType: "band", data: filteredData.map(c => c.country || "Unknown") }]}
                            series={[
                                {
                                    data: filteredData.map(c => c.total),
                                    label: "Clicks",
                                    color: "#28a745", // hijau
                                },
                            ]}
                            height={300}
                        />
                    ) : (
                        <p className="text-gray-500 text-sm">No data available</p>
                    )}
                </SpotlightCard>

                {/* Top Links */}
                <SpotlightCard spotlightColor="rgba(1,81,150,0.25)" borderColor="rgba(1,81,150,0.1)" className="p-5 bg-white/95 rounded-2xl backdrop-blur-sm mb-6">
                    <h2 className="text-lg font-semibold mb-4">Top 5 Links</h2>
                    {topLinks?.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {topLinks.map((link) => {
                                const baseDomain = getBaseDomain(link.domain);
                                const shortUrl = `${baseDomain}/s/${link.short_code}`;

                                return (
                                    <li key={link.id} className="py-3 flex justify-between items-center">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <img
                                                src={`https://www.google.com/s2/favicons?sz=64&domain=${new URL(link.original_url).hostname}`}
                                                alt="favicon"
                                                className="w-6 h-6 rounded-full"
                                            />
                                            <a
                                                href={link.full_short_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="truncate max-w-[300px] text-primary-100 hover:underline text-sm"
                                            >
                                                {link.full_short_url}
                                            </a>
                                        </div>
                                        <span className="text-sm font-medium text-gray-700">
                                            {link.clicks_count} clicks
                                        </span>
                                    </li>
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">No links available</p>
                    )}
                </SpotlightCard>

                {/* Top Projects */}
                <SpotlightCard spotlightColor="rgba(1,81,150,0.25)" borderColor="rgba(1,81,150,0.1)" className="p-5 bg-white/95 rounded-2xl backdrop-blur-sm mb-6">
                    <h2 className="text-lg font-semibold mb-4">Top 5 Projects</h2>
                    {topProjects?.length > 0 ? (
                        <ul className="divide-y divide-gray-200">
                            {topProjects.map((proj) => {
                                const baseDomain = getBaseDomain(proj.domain);
                                const projectUrl = `${baseDomain}/m/${proj.project_slug}`;

                                return (
                                    <li key={proj.id} className="py-3 flex justify-between items-center">
                                        <div className="flex items-center gap-3 overflow-hidden">
                                            <Icon icon="mdi:folder-outline" className="w-6 h-6 text-primary-100" />
                                            <a
                                                href={proj.full_short_url}
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
                                );
                            })}
                        </ul>
                    ) : (
                        <p className="text-gray-500 text-sm">No projects available</p>
                    )}
                </SpotlightCard>
            </div>
        </DashboardLayout>
    );
}
