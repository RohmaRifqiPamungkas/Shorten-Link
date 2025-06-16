import { Link } from "@inertiajs/react";

export default function ErrorPage({ statusCode = 404, title = "Page Not Found", description }) {
    const defaultDescriptions = {
        403: "You don’t have permission to access this page.",
        404: "The page you are looking for might have been removed, had its name changed or is temporarily unavailable.",
        419: "The page has expired. Please refresh and try again.",
        429: "You have made too many requests in a short time. Please wait and try again.",
        500: "Something went wrong on our server. We're working on it.",
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center bg-tertiary text-center overflow-hidden">
            {/* Background Gradasi Pojok */}
            <div className="absolute top-0 left-0 w-1/4 h-1/4 bg-gradient-to-br from-primary-100 to-transparent rounded-full blur-3xl opacity-70 z-10" />
            <div className="absolute bottom-0 right-0 w-1/4 h-1/4 bg-gradient-to-tr from-primary-100 to-transparent rounded-full blur-3xl opacity-70 z-10" />

            <div className="absolute w-2/3 h-2/3 bg-center bg-no-repeat bg-cover z-0" style={{ backgroundImage: "url('/images/Vector.png')" }}>
                {/* Logo */}
                <div className="mb-6">
                    <img src="/images/Logo.png" alt="Sevenpion" className="h-12 w-36 mx-auto" />
                </div>

                <div className="space-y-6">
                    <h1 className="text-6xl md:text-9xl font-bold text-primary-100">Oops!</h1>

                    <h2 className="text-2xl md:text-4xl font-semibold text-primary-100">
                        {statusCode} - {title}
                    </h2>

                    <p className="text-primary-100 text-sm md:text-md font-semibold max-w-md mx-auto">
                        {description || defaultDescriptions[statusCode] || "An unexpected error has occurred."}
                    </p>

                    <Link
                        href="/projects"
                        className="md:px-32 px-6 py-2 text-lg bg-primary-100 hover:bg-secondary text-white rounded-lg shadow-md transition duration-300 inline-block"
                    >
                        Go To Home Page!
                    </Link>
                </div>
            </div>
        </div>
    );
}
