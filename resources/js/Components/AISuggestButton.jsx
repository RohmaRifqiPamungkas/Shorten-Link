export default function AISuggestButton({
    className = '',
    disabled,
    loading = false,
    children = "AI Suggest",
    ...props
}) {
    return (
        <button
            {...props}
            disabled={disabled || loading}
            className={
                `w-full flex justify-center items-center rounded-lg border border-transparent bg-primary-100 px-4 py-3 text-sm font-semibold text-white transition duration-150 ease-in-out hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 
                 ${disabled || loading ? 'opacity-50 cursor-not-allowed' : ''} ` + className
            }
        >
            {loading ? (
                <span className="flex items-center gap-2">
                    <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        ></circle>
                        <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                        ></path>
                    </svg>
                    Generating...
                </span>
            ) : (
                children
            )}
        </button>
    );
}
