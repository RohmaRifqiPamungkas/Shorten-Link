import { Link } from "@inertiajs/react";

export default function PrimaryButton({
    className = "",
    disabled = false,
    children,
    href = null,
    routeName = null,
    ...props
}) {
    const baseClass = `
        w-full flex justify-center items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white 
        transition-all duration-200 ease-in-out
        ${disabled
            ? "bg-gradient-to-r from-blue-500 to-blue-400 opacity-50 cursor-not-allowed"
            : "bg-gradient-to-r from-primary-100 to-blue-400 hover:brightness-110 shadow-md hover:shadow-lg"
        }
        focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2
        ${className}
    `;

    if (routeName) {
        return (
            <Link href={route(routeName)} className={baseClass}>
                {children}
            </Link>
        );
    }

    if (href) {
        return (
            <Link href={href} className={baseClass}>
                {children}
            </Link>
        );
    }

    return (
        <button {...props} disabled={disabled} className={baseClass}>
            {children}
        </button>
    );
}
