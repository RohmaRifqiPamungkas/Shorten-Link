import { Icon } from "@iconify/react";

const socialLinks = [
    { icon: "mdi:github", href: "#", label: "GitHub" },
    { icon: "mdi:twitter", href: "#", label: "Twitter" },
    { icon: "mdi:linkedin", href: "#", label: "LinkedIn" },
    { icon: "mdi:instagram", href: "#", label: "Instagram" },
];

const footerLinks = [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Help", href: "#" },
];

export default function Footer() {
    return (
        <footer className="border-t border-gray-100 bg-white px-4 sm:px-6 lg:px-8">
            <div className="flex h-14 items-center justify-between gap-4">

                {/* Left: brand */}
                <div className="flex items-center gap-2.5 flex-none">
                    {/* <img
                        src="/images/Tautly.png"
                        alt="Tautly"
                        className="h-5 w-auto object-contain opacity-80"
                    /> */}
                    <span className="hidden text-xs text-gray-400 sm:inline">
                        © {new Date().getFullYear()} Tautly
                    </span>
                </div>

                {/* Center: nav links */}
                <div className="flex items-center gap-4">
                    {footerLinks.map((link) => (
                        <a
                            key={link.label}
                            href={link.href}
                            className="text-xs text-gray-400 transition hover:text-gray-700"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                {/* Right: social icons */}
                <div className="flex items-center gap-1 flex-none">
                    {socialLinks.map((social) => (
                        <a
                            key={social.label}
                            href={social.href}
                            aria-label={social.label}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
                        >
                            <Icon icon={social.icon} width={15} height={15} />
                        </a>
                    ))}
                </div>
            </div>

            {/* Mobile copyright */}
            <p className="pb-3 text-center text-xs text-gray-400 sm:hidden">
                © {new Date().getFullYear()} Tautly. All rights reserved.
            </p>
        </footer>
    );
}
