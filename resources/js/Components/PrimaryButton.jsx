export default function PrimaryButton({
    className = "",
    disabled = false,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            disabled={disabled}
            className={`w-full flex justify-center items-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold text-white transition-all duration-200 ease-in-out
                ${disabled
                    ? "bg-gradient-to-r from-blue-500 to-blue-400 opacity-50 cursor-not-allowed"
                    : "bg-gradient-to-r from-primary-100 to-blue-400 hover:brightness-110 shadow-md hover:shadow-lg"
                }
                focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2
                ${className}`}
        >
            {children}
        </button>
    );
}
