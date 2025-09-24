import React, { useState } from "react";
import { Head } from "@inertiajs/react";
import { Icon } from "@iconify/react";

export default function PublicView({ project, categories }) {
    const [openDropdowns, setOpenDropdowns] = useState({});

    const toggleDropdown = (categoryName) => {
        setOpenDropdowns((prev) => ({
            ...prev,
            [categoryName]: !prev[categoryName],
        }));
    };

    // Fungsi untuk memilih logo berdasarkan nama kategori
    const categoryLogos = {
        figma: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg",
        canva: "https://static.canva.com/static/images/favicon.ico",
        youtube: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/youtube/youtube-original.svg",
        github: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
        facebook: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/facebook/facebook-original.svg",
        instagram: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/instagram/instagram-original.svg",
        twitter: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg",
        x: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/twitter/twitter-original.svg",
        linkedin: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linkedin/linkedin-original.svg",
        whatsapp: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/whatsapp/whatsapp-original.svg",
        telegram: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/telegram/telegram-original.svg",
        drive: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/google/google-original.svg",
        dropbox: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dropbox/dropbox-original.svg",
        notion: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/notion/notion-original.svg",
        slack: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/slack/slack-original.svg",
        discord: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/discord/discord-original.svg",
        tiktok: "https://cdn-icons-png.flaticon.com/512/3046/3046125.png",
        medium: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/medium/medium-original.svg",
        gmail: "https://cdn-icons-png.flaticon.com/512/281/281769.png",
    };

    const getCategoryLogo = (name = "", imageUrl = null) => {
        const lowerName = name.toLowerCase();

        for (const keyword in categoryLogos) {
            if (lowerName.includes(keyword)) {
                return categoryLogos[keyword];
            }
        }

        if (imageUrl) {
            return `/uploads/${imageUrl}`;
        }

        return "/images/Globe.png";
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
                        src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            project.name
                        )}`}
                        alt="avatar"
                        className="w-20 h-20 rounded-full mb-2"
                    />
                    <h2 className="text-lg font-semibold text-gray-800 mb-6">
                        {project.name}
                    </h2>

                    <div className="w-full max-w-md space-y-4">
                        {categories.map((categoryItem, index) => {
                            const categoryName =
                                categoryItem.category || "Tanpa Kategori";
                            const isOpen = openDropdowns[categoryName];
                            const firstLink = categoryItem.links[0];

                            return (
                                <div key={index} className="transition-all">
                                    <button
                                        onClick={() =>
                                            toggleDropdown(categoryName)
                                        }
                                        className="w-full flex items-center justify-between px-5 py-3 rounded-full text-white font-semibold bg-primary-100 hover:bg-secondary transition"
                                    >
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={getCategoryLogo(categoryName, categoryItem.image_url)}
                                                alt="category-logo"
                                                className="w-8 h-8 rounded-full bg-gray-100 object-contain"
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src = "/images/Globe.png";
                                                }}
                                            />
                                            <span>{categoryName}</span>
                                        </div>
                                        <Icon
                                            icon={
                                                isOpen
                                                    ? "mdi:chevron-up"
                                                    : "mdi:chevron-down"
                                            }
                                            width={20}
                                        />
                                    </button>

                                    {isOpen && (
                                        <div className="mt-3 space-y-2  transition-all">
                                            {categoryItem.links.map(
                                                (link, i) => (
                                                    <div key={i}>
                                                        <a
                                                            href={
                                                                link.original_url
                                                            }
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="block w-full bg-white text-gray-800 text-sm text-center px-4 py-4 rounded-full shadow hover:bg-gray-100 transition"
                                                        >
                                                            {link.title}
                                                        </a>
                                                    </div>
                                                )
                                            )}
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
