import React from "react";
import { Link } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import PrimaryButton from "@/Components/Button/PrimaryButton"; 

export default function TopProjectsCard({
    title = "Top Projects",
    projects = [],
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
                <Link href="/projects" className="ml-auto">
                    <PrimaryButton
                        className="!px-4 !py-2 flex items-center gap-2 text-sm w-auto"
                    >
                        <Icon icon="mdi:plus" className="w-4 h-4" />
                        Add New Project
                    </PrimaryButton>
                </Link>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-12 text-xs font-semibold text-gray-500 border-b border-gray-100 pb-2 mb-2">
                <div className="col-span-5">Name</div>
                <div className="col-span-3 text-center">Sharing</div>
                <div className="col-span-2 text-center">Clicks</div>
                <div className="col-span-2 text-right">Updated</div>
            </div>

            {/* Table Rows */}
            {projects?.length > 0 ? (
                <div className="flex-grow divide-y divide-gray-100 overflow-y-auto">
                    {projects.map((proj, idx) => {
                        const baseDomain = getBaseDomain(proj.domain);
                        const projectUrl = `${baseDomain}/m/${proj.project_slug}`;
                        const modified =
                            proj.updated_at
                                ? new Date(proj.updated_at).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                })
                                : "—";

                        return (
                            <div
                                key={proj.id || proj.project_slug || idx}
                                className="grid grid-cols-12 items-center py-3 px-1 rounded-lg hover:bg-gray-50/50 transition"
                            >
                                {/* Name */}
                                <div className="col-span-5 flex items-center gap-3 overflow-hidden">
                                    <div className="flex items-center justify-center w-8 h-8 rounded-md bg-primary-25/10 text-primary-100 flex-shrink-0">
                                        <Icon
                                            icon="mdi:folder-outline"
                                            className="w-4 h-4"
                                        />
                                    </div>
                                    <div className="overflow-hidden">
                                        <a
                                            href={proj.full_short_url || projectUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-sm font-medium text-gray-800 truncate hover:text-primary-100 transition"
                                        >
                                            {proj.project_name || "Unnamed Project"}
                                        </a>
                                        <p className="text-xs text-gray-500 truncate">
                                            {projectUrl}
                                        </p>
                                    </div>
                                </div>

                                {/* Sharing */}
                                <div className="col-span-3 flex justify-center items-center gap-2">
                                    {proj.shared_with && proj.shared_with.length > 0 ? (
                                        <div className="flex -space-x-2">
                                            {proj.shared_with.slice(0, 3).map((user, i) => (
                                                <img
                                                    key={i}
                                                    src={user.avatar || "https://ui-avatars.com/api/?name=" + user.name}
                                                    alt={user.name}
                                                    className="w-6 h-6 rounded-full border-2 border-white"
                                                />
                                            ))}
                                            {proj.shared_with.length > 3 && (
                                                <span className="text-xs text-gray-500 ml-1">
                                                    +{proj.shared_with.length - 3}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-xs text-gray-400">—</span>
                                    )}
                                </div>

                                {/* Clicks */}
                                <div className="col-span-2 text-center">
                                    <span className="text-sm font-medium text-primary-100">
                                        {proj.clicks_count ?? 0}
                                    </span>
                                </div>

                                {/* Modified */}
                                <div className="col-span-2 text-right">
                                    <span className="text-xs text-gray-500">{modified}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <p className="text-gray-500 text-sm text-center py-6 flex-grow">
                    No projects available
                </p>
            )}

            {/* Footer */}
            <div className="pt-4 border-t border-gray-100 text-center mt-auto">
                <a
                    href="/projects"
                    className="text-sm text-primary-100 font-medium hover:underline inline-flex items-center gap-1"
                >
                    See all projects →
                </a>
            </div>
        </div>
    );
}
