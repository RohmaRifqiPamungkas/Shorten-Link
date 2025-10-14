import { Link } from "@inertiajs/react";

export default function TransparentButton({
    className = "",
    disabled = false,
    children,
    href = null,
    routeName = null,
    ...props
}) {
    const baseClass = `
        w-full flex justify-center items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold
        transition-all duration-200 ease-in-out
        ${disabled
            ? "opacity-50 cursor-not-allowed border border-primary-100/30 text-primary-100/50"
            : "border border-primary-100/40 bg-transparent text-primary-100 hover:bg-primary-100/5 hover:border-primary-100 shadow-sm hover:shadow-md"
        }
        focus:outline-none focus:ring-2 focus:ring-primary-100/50 focus:ring-offset-2
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
