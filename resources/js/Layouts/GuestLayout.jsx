import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function GuestLayout({ children }) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center py-6 sm:justify-center px-10 sm:pt-10 bg-background">
            <div className="mt-6 w-full overflow-hidden px-6 py-4 sm:max-w-md rounded-2xl bg-background shadow-primary">
                {children}
            </div>
        </div>
    );
}
