
import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { Icon } from "@iconify/react";

const getCategoryIcon = (name) => {
    switch (name.toLowerCase()) {
        case "figma":
            return "logos:figma";
        case "google docs":
            return "logos:google-docs";
        case "google drive":
            return "logos:google-drive";
        case "github":
            return "logos:github-icon";
        case "powerpoint":
            return "logos:microsoft-powerpoint";
        case "canva":
            return "logos:canva-icon";
        default:
            return "ph:folder-duotone";
    }
};

export default function PublicView() {
    const [openDropdowns, setOpenDropdowns] = useState({});

    const project = {
        name: "Demo Project",
    };

    const categories = [
        {
            category: "Figma",
            links: [
                {
                    title: "Figma Design Homepage",
                    original_url: "https://www.figma.com/file/homepage-design",
                    children: [
                        {
                            title: "Mobile View",
                            original_url: "https://www.figma.com/file/mobile-view",
                        },
                        {
                            title: "Desktop View",
                            original_url: "https://www.figma.com/file/desktop-view",
                        },
                    ],
                },
                {
                    title: "Design System",
                    original_url: "https://www.figma.com/file/design-system",
                    children: [],
                },
            ],
        },
        {
            category: "Google Docs",
            links: [
                {
                    title: "Meeting Notes",
                    original_url: "https://docs.google.com/document/d/notes",
                    children: [],
                },
            ],
        },
        {
            category: "Github",
            links: [
                {
                    title: "Frontend Repo",
                    original_url: "https://github.com/org/frontend",
                    children: [],
                },
                {
                    title: "Backend Repo",
                    original_url: "https://github.com/org/backend",
                    children: [],
                },
            ],
        },
        {
            category: null,
            links: [
                {
                    title: "Random Link",
                    original_url: "https://example.com/random",
                    children: [],
                },
            ],
        },
    ];

    const toggleDropdown = (categoryName) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [categoryName]: !prev[categoryName],
        }));
    };

    return (
        <>
            <Head title={project.name} />
            <div className="relative min-h-screen flex flex-col items-center justify-start bg-tertiary text-center overflow-hidden px-6 py-10">
                {/* BGPojok */}
                <div className="absolute top-0 left-0 w-1/4 h-1/4 bg-gradient-to-br from-primary-100 to-transparent rounded-full blur-3xl opacity-70 z-10" />
                <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-gradient-to-tr from-primary-100 to-transparent rounded-full blur-3xl opacity-70 z-10" />

                <div className="relative z-20 flex flex-col items-center w-full">
                    <img
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(project.name)}`}
                        alt="avatar"
                        className="w-20 h-20 rounded-full mb-2"
                    />
                    <h2 className="text-xl font-semibold text-primary-700 mb-6">{project.name}</h2>

                    <div className="w-full max-w-md space-y-4">
                        {categories.map((categoryItem, index) => {
                            const categoryName = categoryItem.category || "Tanpa Kategori";
                            const isOpen = openDropdowns[categoryName];

                            return (
                                <div key={index} className="transition-all">
                                    <button
                                        onClick={() => toggleDropdown(categoryName)}
                                        className="w-full flex items-center justify-between px-5 py-3 rounded-full text-white font-semibold bg-primary-100 hover:bg-secondary transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <Icon icon={getCategoryIcon(categoryName)} width={24} height={24} />
                                            <span>{categoryName}</span>
                                        </div>
                                        <Icon icon={isOpen ? "mdi:chevron-up" : "mdi:chevron-down"} width={20} />
                                    </button>

                                    {isOpen && (
                                        <div className="mt-3 space-y-2  transition-all">
                                            {categoryItem.links.map((link, i) => (
                                                <div key={i}>
                                                    <a
                                                        href={link.original_url}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="block w-full bg-white text-gray-800 text-sm text-left px-4 py-2 rounded-full shadow hover:bg-gray-100 transition"
                                                    >
                                                        {link.title}
                                                    </a>

                                                    {Array.isArray(link.children) && link.children.length > 0 && (
                                                        <div className="px-4 mt-2 space-y-1">
                                                            {link.children.map((child, idx) => (
                                                                <a
                                                                    key={idx}
                                                                    href={child.original_url}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="block w-full bg-white text-gray-600 text-sm text-left px-4 py-2 rounded-full shadow hover:bg-gray-100 transition"
                                                                >
                                                                    {child.title}
                                                                </a>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </>
    );
}
