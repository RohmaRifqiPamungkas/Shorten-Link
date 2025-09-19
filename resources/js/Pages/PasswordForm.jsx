import { useState } from "react";
import { useForm } from "@inertiajs/react";
import Notification from "@/Components/Notification/Notification";

export default function PasswordForm({ short_code }) {
    const { data, setData, post, processing, errors } = useForm({
        short_code,
        password: "",
    });

    const [notif, setNotif] = useState(null);

    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     post(route("shorten.validate"), {
    //         onError: () => {
    //             setNotif({
    //                 type: "error",
    //                 message: "Password failed!",
    //             });
    //         },
    //     });
    // };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.post(route("shorten.validate"), {
                short_code: short_code,
                password: data.password,
            });

            if (res.data.success) {
                window.location.href = res.data.url; 
            }
        } catch (err) {
            setNotif({
                type: "error",
                message: "Password salah!",
            });
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-5">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6">
                <h2 className="text-xl font-semibold text-primary-100 mb-4 text-center">
                    Protected Link
                </h2>
                <p className="text-sm text-gray-600 mb-4 text-center">
                    Enter password to open this link
                </p>

                {notif && (
                    <Notification
                        type={notif.type}
                        message={notif.message}
                        onClose={() => setNotif(null)}
                    />
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        type="password"
                        className="w-full border border-gray-300 rounded-lg px-3 py-2"
                        placeholder="Enter password"
                        value={data.password}
                        onChange={(e) => setData("password", e.target.value)}
                        required
                    />
                    {errors.password && (
                        <div className="text-red-500 text-sm">
                            {errors.password}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={processing}
                        className="w-full bg-primary-100 text-white py-2 rounded-lg hover:bg-secondary"
                    >
                        {processing ? "Checking..." : "Unlock"}
                    </button>
                </form>
            </div>
        </div>
    );
}
