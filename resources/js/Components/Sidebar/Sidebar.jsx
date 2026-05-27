import { useState } from "react";
import { Link, usePage, router } from "@inertiajs/react";
import { FiLogOut } from "react-icons/fi";
import { RiFolderSettingsLine } from "react-icons/ri";
import { MdOutlineLink } from "react-icons/md";
import { FaBars } from "react-icons/fa";
import { RxDashboard } from "react-icons/rx";
import { TbWorldWww } from "react-icons/tb";

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const {
        url,
        props: { auth },
    } = usePage();

    const handleLogout = () => {
        router.post(
            "/logout",
            {},
            {
                onSuccess: () => router.visit("/login"),
                onError: (err) => console.error("Logout failed:", err),
            }
        );
    };

    const menuItems = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: <RxDashboard />,
        },
        {
            name: "Management Link",
            href: "/projects",
            icon: <RiFolderSettingsLine />,
        },
        {
            name: "Shortened Link",
            href: "/shorten",
            icon: <MdOutlineLink />,
        },
        {
            name: "Domains",
            href: "/domains",
            icon: <TbWorldWww />,
        },
    ];

    const sidebarWidthClass = isExpanded ? "w-72 md:w-72" : "w-72 md:w-16";

    return (
        <aside
            className={`
                fixed left-0 top-0 z-50 flex h-dvh min-h-dvh flex-col border-r border-gray-100 bg-white shadow-sm transition-all duration-300 ease-in-out md:z-30 md:sticky md:translate-x-0 md:shadow-none
                ${sidebarWidthClass}
                ${isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
            `}
        >
            {isMobileOpen && (
                <button
                    onClick={() => setIsMobileOpen(false)}
                    aria-label="Close sidebar"
                    className="absolute right-4 top-4 z-50 inline-flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 text-gray-600 transition hover:bg-gray-200 md:hidden"
                >
                    <span className="text-lg leading-none">✕</span>
                </button>
            )}

            <div
                className={`relative flex h-16 items-center border-b border-gray-100 ${isExpanded ? "px-4" : "justify-center px-2 md:px-2"}`}
            >
                {isExpanded && (
                    <div className="flex w-full items-center justify-center">
                        <img
                            src="/images/Tautly.png"
                            alt="Logo"
                            className="h-auto w-24 max-w-full"
                        />
                    </div>
                )}

                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
                    className={`hidden h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-primary-25 hover:text-primary-100 md:inline-flex ${isExpanded ? "absolute right-4" : "absolute left-1/2 -translate-x-1/2"}`}
                >
                    <FaBars className="text-base" />
                </button>
            </div>

            <nav className={`flex-1 overflow-y-auto overflow-x-hidden ${isExpanded ? "px-3 py-4" : "px-2 py-3"}`}>
                <div className="space-y-3">
                    {isExpanded && (
                        <p className="px-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
                            Menu
                        </p>
                    )}

                    <div className={`space-y-1 ${isExpanded ? "" : "flex flex-col items-stretch"}`}>
                        {menuItems.map((item) => {
                            const isActive = url.startsWith(item.href);

                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`
                                        group relative flex min-h-12 items-center overflow-hidden rounded-xl transition-all duration-200
                                        ${isExpanded ? "gap-4 px-4" : "justify-center px-2"}
                                        ${isActive
                                            ? "bg-primary-25 text-foreground"
                                            : "text-foreground hover:bg-primary-25 hover:text-primary-100"
                                        }
                                    `}
                                >
                                    <span
                                        className={`
                                            absolute right-0 top-0 bottom-0 w-1 rounded-r-full bg-primary-100 transition-transform duration-200
                                            ${isActive ? "scale-y-100" : "scale-y-0 group-hover:scale-y-100"}
                                        `}
                                    />
                                    <span className="relative z-10 text-xl">
                                        {item.icon}
                                    </span>
                                    {isExpanded && (
                                        <span className="relative z-10 min-w-0 truncate text-sm font-medium md:text-[15px]">
                                            {item.name}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            <div className={`mt-auto border-t border-gray-100 bg-tertiary ${isExpanded ? "px-3 py-4" : "px-2 py-3"}`}>
                {isExpanded ? (
                    <div className="flex items-center justify-between gap-3 px-1">
                        <Link
                            href="/profile"
                            className="flex min-w-0 flex-1 items-center gap-3 rounded-xl px-3 py-2 transition hover:bg-white/70 hover:opacity-90"
                        >
                            <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary-100 text-sm font-semibold uppercase text-white">
                                {auth?.user?.name?.charAt(0) || "U"}
                            </div>
                            <div className="min-w-0 leading-tight">
                                <p className="truncate text-sm font-medium md:text-[15px]">
                                    {auth?.user?.name}
                                </p>
                                <p className="text-xs text-orange-600">User</p>
                            </div>
                        </Link>

                        <button
                            onClick={handleLogout}
                            aria-label="Logout"
                            className="group relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl text-foreground transition hover:bg-primary-25 hover:text-primary-100"
                        >
                            <span
                                className="absolute right-0 top-0 bottom-0 w-1 scale-y-0 rounded-r-full bg-primary-100 transition-transform group-hover:scale-y-100"
                            />
                            <span className="relative z-10 text-lg transition group-hover:text-primary-100">
                                <FiLogOut />
                            </span>
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={handleLogout}
                        aria-label="Logout"
                        className="group relative mx-auto inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl text-foreground transition hover:bg-primary-25 hover:text-primary-100"
                    >
                        <span
                            className="absolute right-0 top-0 bottom-0 w-1 scale-y-0 rounded-r-full bg-primary-100 transition-transform group-hover:scale-y-100"
                        />
                        <span className="relative z-10 text-lg transition group-hover:text-primary-100">
                            <FiLogOut />
                        </span>
                    </button>
                )}
            </div>
        </aside>
    );
}
