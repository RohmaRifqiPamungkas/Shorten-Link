// export default function PrimaryButton({
//     className = '',
//     disabled,
//     children,
//     ...props
// }) {
//     return (
//         <button
//             {...props}
//             className={
//                 `inline-flex items-center rounded-md border border-transparent bg-gray-800 px-4 py-2 text-xs font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-gray-700 focus:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:bg-gray-900 dark:bg-gray-200 dark:text-gray-800 dark:hover:bg-white dark:focus:bg-white dark:focus:ring-offset-gray-800 dark:active:bg-gray-300 ${
//                     disabled && 'opacity-25'
//                 } ` + className
//             }
//             disabled={disabled}
//         >
//             {children}
//         </button>
//     );
// }

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `w-full flex justify-center items-center rounded-lg border border-transparent bg-primary-100 px-4 py-3 text-sm font-semibold text-white transition duration-150 ease-in-out hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    disabled && 'opacity-25'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
