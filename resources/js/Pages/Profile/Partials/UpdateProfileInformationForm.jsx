import { useForm, usePage, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/Button/PrimaryButton";

export default function UpdateProfileInformation({
    mustVerifyEmail,
    status,
    className = "",
}) {
    const user = usePage().props.auth.user;

    const { data, setData, patch, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
        });

    const submit = (e) => {
        e.preventDefault();
        patch(route("profile.update"));
    };

    return (
        <form onSubmit={submit} className={`space-y-6 ${className}`}>
            {/* Input Name */}
            <div>
                <label className="text-sm text-foreground">Name</label>
                <input
                    id="name"
                    type="text"
                    className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                    value={data.name}
                    onChange={(e) => setData("name", e.target.value)}
                    required
                    autoComplete="name"
                />
                {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
            </div>

            {/* Input Email */}
            <div>
                <label className="text-sm text-foreground">Email</label>
                <input
                    id="email"
                    type="email"
                    className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                    value={data.email}
                    onChange={(e) => setData("email", e.target.value)}
                    required
                    autoComplete="username"
                />
                {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
            </div>

            {/* Verifikasi Email */}
            {mustVerifyEmail && user.email_verified_at === null && (
                <div className="text-sm">
                    <p className="text-foreground">
                        Your email address is unverified.{" "}
                        <Link
                            href={route("verification.send")}
                            method="post"
                            as="button"
                            className="underline text-primary-100 hover:text-primary"
                        >
                            Click here to re-send the verification email.
                        </Link>
                    </p>
                    {status === "verification-link-sent" && (
                        <p className="mt-2 text-green-600 text-sm">
                            A new verification link has been sent to your email
                            address.
                        </p>
                    )}
                </div>
            )}

            {/* Action */}
            <div className="flex items-center gap-4">
                <PrimaryButton disabled={processing}>
                    {processing ? "Saving..." : "Save"}
                </PrimaryButton>
                {recentlySuccessful && (
                    <p className="text-sm text-gray-600">Saved.</p>
                )}
            </div>
        </form>
    );
}
