import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { FaBars } from "react-icons/fa";

const pageTitles = {
    "/dashboard": "Dashboard",
    "/projects": "Management Link",
    "/shorten": "Shortened Link",
    "/domains": "Domains",
    "/profile": "Profile",
};

export default function DashboardNavbar({ onMenuClick }) {
    const [searchValue, setSearchValue] = useState("");
    const { url, props } = usePage();
    const authUser = props?.auth?.user;

    const pageTitle =
        Object.entries(pageTitles).find(([path]) => url.startsWith(path))?.[1] ?? "Dashboard";

    return (
        <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-xl">
            <div className="flex h-16 items-center gap-4 px-4 sm:px-6 lg:px-8">

                {/* Left: hamburger + page title */}
                <div className="flex items-center gap-3">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        aria-label="Open navigation menu"
                        className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 md:hidden"
                    >
                        <FaBars className="text-sm" />
                    </button>
                </div>

                {/* Right: actions */}
                <div className="ml-auto flex items-center gap-1.5">
                    {/* Search icon — mobile only */}
                    <button
                        type="button"
                        aria-label="Search"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 sm:hidden"
                    >
                        <Icon icon="akar-icons:search" width={16} height={16} />
                    </button>

                    {/* Notifications */}
                    <button
                        type="button"
                        aria-label="Notifications"
                        className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                    >
                        <Icon icon="akar-icons:bell" width={17} height={17} />
                        <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-orange-500" />
                    </button>

                    {/* Divider */}
                    <span className="mx-1 h-5 w-px bg-gray-200" />

                    {/* User */}
                    <Link
                        href="/profile"
                        className="flex items-center gap-2.5 rounded-xl px-2 py-1.5 transition hover:bg-gray-100"
                    >
                        <div className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-primary-100 text-xs font-semibold uppercase text-white">
                            {authUser?.name?.charAt(0) || "U"}
                        </div>
                        <div className="hidden leading-tight xl:block">
                            <p className="max-w-[120px] truncate text-sm font-medium text-gray-800">
                                {authUser?.name || "User"}
                            </p>
                            <p className="text-xs text-gray-400">View profile</p>
                        </div>
                        <Icon
                            icon="akar-icons:chevron-down"
                            width={12}
                            height={12}
                            className="hidden text-gray-400 xl:block"
                        />
                    </Link>
                </div>
            </div>
        </header>
    );
}
