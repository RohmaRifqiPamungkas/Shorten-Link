import { useState } from "react";
import { Icon } from "@iconify/react";
import Notification from "@/Components/Notification/Notification";
import { router } from "@inertiajs/react";

export default function PasswordPopup({ shortCode }) {
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        router.post(
            "/validate-password",
            { short_code: shortCode, password },
            {
                onError: (errors) => {
                    setError(errors.password || "Password salah!");
                    setLoading(false);
                },
                onSuccess: () => {
                    setLoading(false);
                },
            }
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-5 ">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm md:max-w-lg flex flex-col items-center justify-center py-10 px-8">
                {/* Judul */}
                <h2 className="text-lg md:text-2xl font-semibold text-primary-100 mb-6">
                    Enter Password
                </h2>

                {/* Form Input */}
                <form
                    onSubmit={handleSubmit}
                    className="w-full flex flex-col gap-4"
                >
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        className="w-full px-4 py-3 rounded-xl border border-brfourth focus:ring-2 focus:ring-primary-100 focus:outline-none"
                        required
                    />

                    {error && (
                        <Notification
                            type="error"
                            message={error}
                            onClose={() => setError(null)}
                            className="w-full"
                        />
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary-100 hover:bg-secondary text-white px-4 py-2 rounded-lg w-full text-sm md:text-lg disabled:opacity-50"
                    >
                        {loading ? "Validating..." : "Submit"}
                    </button>
                </form>
            </div>
        </div>
    );
}
