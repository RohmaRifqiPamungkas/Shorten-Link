import { useState } from "react";
import { Inertia } from "@inertiajs/inertia";
import { Link, usePage } from "@inertiajs/react";
import { FiLogOut } from "react-icons/fi";
import { RiFolderSettingsLine } from "react-icons/ri";
import { MdOutlineLink } from "react-icons/md";
import { FaBars } from "react-icons/fa";

export default function Sidebar({ isMobileOpen, setIsMobileOpen }) {
    const [isExpanded, setIsExpanded] = useState(true);
    const { url } = usePage();
    const { auth } = usePage().props;
    const handleLogout = () => {
        Inertia.post(
            "/logout",
            {},
            {
                onSuccess: () => {
                    Inertia.visit("/login");
                },
                onError: (error) => {
                    console.error("Logout failed:", error);
                },
            }
        );
    };

    const menuItems = [
        {
            name: "Management Link",
            href: "/managementLink",
            icon: <RiFolderSettingsLine />,
        },
        {
            name: "Shortened Link",
            href: "/shortenedLink",
            icon: <MdOutlineLink />,
        },
    ];

    return (
        <aside
            className={`
      fixed top-0 left-0 z-40 min-h-screen bg-white border-r  shadow-fourth
      flex flex-col
      transition-all duration-300 ease-in-out
      ${isExpanded ? "w-64" : "w-20"}
      ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
      md:translate-x-0 md:static
    `}
        >
            {/* close hp*/}
            {isMobileOpen && (
                <button
                    onClick={() => setIsMobileOpen(false)}
                    className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-100 md:hidden"
                >
                    ✕
                </button>
            )}

            {/* ini header bang */}
            <div className="relative flex items-center p-4 border-b h-16">
                {isExpanded ? (
                    <div className="flex justify-left w-full">
                        <img
                            src="/images/Logo.png"
                            alt="Logo"
                            className="w-32 h-auto"
                        />
                    </div>
                ) : null}

                {/* hambergerrrnya kakk */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`
      md:block hidden text-gray-600 hover:text-primary transition
      ${isExpanded ? "absolute right-4" : "mx-auto"}
    `}
                >
                    <FaBars />
                </button>
            </div>

            {/* menu nih */}
            <nav className="flex-grow mt-4">
                <div className="mb-4 px-4">
                    {!isExpanded && <hr className="my-1 border-transparent" />}
                    {isExpanded && (
                        <h2 className="text-sm font-semibold text-gray-600 mb-2 px-3">
                            MENU
                        </h2>
                    )}
                    {menuItems.map((item) => {
                        const isActive = url.startsWith(item.href);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                  relative group flex items-center gap-4 py-2 px-3 my-1 rounded-lg transition-all
                  overflow-hidden
                  ${
                      isActive
                          ? "bg-primary-25 text-foreground"
                          : "text-gray-600 hover:bg-primary-25 hover:text-primary-100"
                  }
                `}
                            >
                                <span
                                    className={`
                    absolute right-0 top-0 bottom-0 w-2 bg-primary-100 rounded-r-full transition-transform transform
                    ${
                        isActive
                            ? "scale-y-100"
                            : "scale-y-0 group-hover:scale-y-100"
                    }
                  `}
                                />
                                <span className="text-lg z-10 relative">
                                    {item.icon}
                                </span>
                                {isExpanded && (
                                    <span className="z-10 relative text-sm font-medium">
                                        {item.name}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>

            {/* footer logout*/}
            <div
                className={`
    mt-auto flex items-center gap-3 px-6 py-3.5
    ${isExpanded ? "justify-between" : "justify-center"}
    bg-tertiary
  `}
            >
                {isExpanded ? (
                    <>
                        <div className="flex items-center gap-3">
                            <img
                                src="/user.jpg"
                                width={36}
                                height={36}
                                alt="User"
                                className="rounded-full object-cover"
                            />
                            <div className="leading-tight">
                                <p className="text-sm font-medium">
                                    {auth?.user?.name}
                                </p>
                                <p className="text-xs text-orange-600">Admin</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className={`
          relative group flex items-center gap-4 py-2 px-3 rounded-lg transition-all
          overflow-hidden text-foreground hover:text-primary-100 hover:bg-primary-25 hover:text-primary
        `}
                        >
                            <span
                                className={`
            absolute right-0 top-0 bottom-0 w-2 bg-primary-100 hover:text-primary-100 rounded-r-full transition-transform transform
            scale-y-0 group-hover:scale-y-100
          `}
                            />
                            <span className="text-lg z-10 relative hover:text-primary-100">
                                <FiLogOut />
                            </span>
                        </button>
                    </>
                ) : (
                    <button
                        onClick={handleLogout}
                        className={`
        relative group flex items-center justify-center py-2 px-3 rounded-lg transition-all
        overflow-hidden text-foreground hover:text-primary-100 hover:bg-primary-25 hover:text-primary
      `}
                    >
                        <span
                            className={`
          absolute right-0 top-0 bottom-0 w-2 bg-primary-100 rounded-r-full transition-transform transform
          scale-y-0 group-hover:scale-y-100
        `}
                        />
                        <span className="text-lg z-10 relative hover:text-primary-100">
                            <FiLogOut />
                        </span>
                    </button>
                )}
            </div>
        </aside>
    );
}
