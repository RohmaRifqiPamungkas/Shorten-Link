import React from "react";
import { Link } from "@inertiajs/react";
import SecondaryButton from "@/Components/Button/SecondaryButton";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import { Icon } from "@iconify/react";

const Navbar = () => {
    return (
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-6xl">
            <div className="flex items-center justify-between backdrop-blur-2xl bg-white/10 border border-white/20 rounded-full px-10 py-3.5 shadow-[0_0_30px_rgba(1,81,150,0.15)] transition-all duration-300">
                {/* Logo */}
                <div className="flex items-center gap-2">
                    <img
                        src="/images/Tautly.png"
                        alt="Logo"
                        className="w-32 h-auto"
                    />
                </div>

                {/* Links */}
                <div className="flex items-center gap-10 text-lg font-medium">
                    {[
                        { href: "#home", label: "Home" },
                        { href: "#features", label: "Features" },
                        { href: "#pricing", label: "Pricing" },
                        { href: "#about", label: "About" },
                    ].map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="text-primary-100 hover:text-secondary-gold transition-all duration-300 hover:scale-105"
                        >
                            {item.label}
                        </Link>
                    ))}
                </div>

                {/* Auth Buttons */}
                <div className="flex items-center gap-4">
                    <PrimaryButton
                        href={route('login')}
                        className="px-6 text-sm shadow-md flex items-center justify-center whitespace-nowrap"
                    >
                        Login
                    </PrimaryButton>

                    <SecondaryButton
                        href={route('register')}
                        className="px-6 text-sm shadow-md flex items-center justify-center whitespace-nowrap"
                    >
                        Get Started
                    </SecondaryButton>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
