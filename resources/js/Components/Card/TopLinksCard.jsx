import React from "react";
import { LineChart, Line, ResponsiveContainer } from "recharts";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import PrimaryButton from "@/Components/Button/PrimaryButton";

export default function TopLinksCard({
    title = "Latest Links",
    links = [],
    className = "",
}) {
    const getBaseDomain = (domain) =>
        (domain?.name ?? window.location.origin).replace(/\/$/, "");

    return (
        <div
            className={`bg-white/95 rounded-2xl shadow-[0_4px_20px_rgba(1,81,150,0.05)] p-6 flex flex-col h-full ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                {/* Add New Button */}
                <Link href="/shorten" className="ml-auto">
                    <PrimaryButton
                        className="!px-4 !py-2 flex items-center gap-2 text-sm w-auto"
                    >
                        <Icon icon="mdi:plus" className="w-4 h-4" />
                        Add New Shorten
                    </PrimaryButton>
                </Link>
            </div>

            {/* Links List */}
            {links?.length > 0 ? (
                <ul className="divide-y divide-gray-100 flex-grow overflow-y-auto pb-2 mb-2">
                    {links.map((link) => {
                        const baseDomain = getBaseDomain(link.domain);
                        const shortUrl = `${baseDomain}/s/${link.short_code}`;
                        const tinyData =
                            link.clicks_trend || [
                                { v: 5 },
                                { v: 7 },
                                { v: 3 },
                                { v: 6 },
                                { v: 9 },
                            ];

                        return (
                            <li
                                key={link.id}
                                className="py-3 flex justify-between items-center hover:bg-gray-50/50 transition rounded-lg px-2"
                            >
                                <div className="flex flex-col overflow-hidden">
                                    <span className="text-sm font-medium text-gray-800 truncate">
                                        {link.custom_alias || "Untitled link"}
                                    </span>
                                    <a
                                        href={link.full_short_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs text-primary-100 truncate hover:underline"
                                    >
                                        {shortUrl}
                                    </a>
                                </div>

                                <div className="flex items-center gap-3">
                                    {/* Sparkline */}
                                    <div className="w-16 h-8">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <LineChart data={tinyData}>
                                                <Line
                                                    type="monotone"
                                                    dataKey="v"
                                                    stroke="#015196"
                                                    strokeWidth={2}
                                                    dot={false}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>

                                    <span className="text-sm font-medium text-gray-700 whitespace-nowrap">
                                        {link.clicks_count} clicks
                                    </span>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            ) : (
                <p className="text-gray-500 text-sm text-center py-6 flex-grow">
                    No links available
                </p>
            )}

            {/* Footer link */}
            <div className="pt-3 border-t border-gray-100 text-center mt-auto">
                <a
                    href="/links"
                    className="text-sm text-primary-100 font-medium hover:underline inline-flex items-center gap-1"
                >
                    See all links →
                </a>
            </div>
        </div>
    );
}
