import PrimaryButton from '@/Components/PrimaryButton';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import ApplicationLogo from "@/Components/ApplicationLogo";

export default function VerifyEmail({ status }) {
    const { post, processing } = useForm({});

    const submit = (e) => {
        e.preventDefault();

        post(route('verification.send'));
    };

    return (
        <GuestLayout>
            <Head title="Email Verification" />

             <div className="flex justify-center">
                            <Link href="/">
                                <ApplicationLogo className="h-20 w-20 " />
                            </Link>
                        </div>

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                Thanks for signing up! Before getting started, could you verify
                your email address by clicking on the link we just emailed to
                you? If you didn't receive the email, we will gladly send you
                another.
            </div>

            {status === 'verification-link-sent' && (
                <div className="mb-4 text-sm font-medium text-green-600 dark:text-green-400">
                    A new verification link has been sent to the email address
                    you provided during registration.
                </div>
            )}

            <form onSubmit={submit}>
                <div className="mt-4 flex items-center justify-between">
                    <PrimaryButton disabled={processing}>
                        Resend Verification Email
                    </PrimaryButton>

                   
                </div>
              

                    <p className="text-center text-sm text-gray-600 mt-6">
                    Not using your account anymore?{" "}
                    <Link
                        href={route('logout')}
                        method="post"                 
                        className="font-semibold text-primary-100 underline hover:text-secondary"
                    >
                       Log Out
                    </Link>
                </p>
            </form>
        </GuestLayout>
    );
}
