import { Icon } from "@iconify/react";

export default function Footer() {
    return (
        <footer className="relative pb-6 w-full px-6">
            {/* Top divider line */}
            <div className="h-px bg-gradient-to-r from-transparent via-primary-50 to-transparent mb-4 w-full"></div>

            {/* Footer container */}
            <div
                className="w-full grid grid-cols-1 md:grid-cols-12 items-center 
                   bg-primary-100/100 backdrop-blur-md border border-primary-25 
                   text-white rounded-2xl px-6 py-4 shadow-lg shadow-primary/20"
            >
                {/* Left: Logo */}
                <div className="col-span-4 flex items-center justify-center md:justify-start gap-2 mb-3 md:mb-0">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 text-white font-bold shadow-inner shadow-primary-50/20">
                        T
                    </div>
                    <span className="font-semibold text-sm tracking-wide text-white/90">
                        Tautly
                    </span>
                </div>

                {/* Center: Copyright */}
                <div className="col-span-4 flex justify-center">
                    <p className="text-sm text-gray-300 text-center">
                        Copyright ©2025{" "}
                        <span className="text-white font-medium">Tautly</span>. All rights reserved.
                    </p>
                </div>

                {/* Right: Social Icons */}
                <div className="col-span-4 flex justify-center md:justify-end items-center gap-4">
                    <a href="#" className="text-white hover:text-secondary-100 transition-colors">
                        <Icon icon="mdi:facebook" className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-white hover:text-secondary-100 transition-colors">
                        <Icon icon="mdi:twitter" className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-white hover:text-secondary-100 transition-colors">
                        <Icon icon="mdi:linkedin" className="w-5 h-5" />
                    </a>
                    <a href="#" className="text-white hover:text-secondary-100 transition-colors">
                        <Icon icon="mdi:instagram" className="w-5 h-5" />
                    </a>
                </div>
            </div>
        </footer>
    );
}
