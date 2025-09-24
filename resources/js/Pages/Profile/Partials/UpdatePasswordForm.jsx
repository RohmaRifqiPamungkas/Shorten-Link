import { useForm } from "@inertiajs/react";
import { useRef } from "react";
import PrimaryButton from "@/Components/PrimaryButton";

export default function UpdatePasswordForm({ className = "" }) {
    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const { data, setData, errors, put, reset, processing, recentlySuccessful } =
        useForm({
            current_password: "",
            password: "",
            password_confirmation: "",
        });

    const updatePassword = (e) => {
        e.preventDefault();

        put(route("password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current.focus();
                }
                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current.focus();
                }
            },
        });
    };

    return (
        <form onSubmit={updatePassword} className={`space-y-6 ${className}`}>
            {/* Current Password */}
            <div>
                <label className="text-sm text-foreground">Current Password</label>
                <input
                    id="current_password"
                    ref={currentPasswordInput}
                    type="password"
                    className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                    value={data.current_password}
                    onChange={(e) => setData("current_password", e.target.value)}
                    autoComplete="current-password"
                />
                {errors.current_password && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.current_password}
                    </p>
                )}
            </div>

            {/* New Password */}
            <div>
                <label className="text-sm text-foreground">New Password</label>
                <input
                    id="password"
                    ref={passwordInput}
                    type="password"
                    className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                    value={data.password}
                    onChange={(e) => setData("password", e.target.value)}
                    autoComplete="new-password"
                />
                {errors.password && (
                    <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
            </div>

            {/* Confirm Password */}
            <div>
                <label className="text-sm text-foreground">Confirm Password</label>
                <input
                    id="password_confirmation"
                    type="password"
                    className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                    value={data.password_confirmation}
                    onChange={(e) =>
                        setData("password_confirmation", e.target.value)
                    }
                    autoComplete="new-password"
                />
                {errors.password_confirmation && (
                    <p className="text-red-500 text-sm mt-1">
                        {errors.password_confirmation}
                    </p>
                )}
            </div>

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
