import React, { useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import Notification from "../Notification/Notification";
import { useForm } from "@inertiajs/react";

export default function CreateShortlink({ show, onClose }) {
    const [notification, setNotification] = useState(null);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors
    } = useForm({
        original_url: "",
        custom_alias: "",
        expires_at: "",
    });

    // Tidak render jika tidak show
    if (!show) return null;

    const handleClose = () => {
        reset();
        clearErrors();
        setNotification(null);
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setNotification(null);

        post(route("shorten.store"), {
            onSuccess: () => {
                setNotification({
                    type: "success",
                    message: "Shortened successfully.",
                });
                reset();
                clearErrors();
                onClose();
            },
            onError: () => {
                setNotification({
                    type: "error",
                    message: "An error occurred, please check your input.",
                });
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm md:max-w-2xl p-5 md:p-10 relative">
                <div className="flex justify-between">
                    <div className="flex flex-row">
                        <img
                            src="/images/Hyperlink.png"
                            style={{ width: "24px", height: "24px" }}
                            alt="hyperlink"
                        />
                        <h2 className="text-sm md:text-xl ms-4 font-semibold text-primary-100 mb-4">
                            Shortened Link
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-foreground font-black hover:text-primary-100 w-2 h-2 md:w-4 md:h-4"
                    >
                        ✕
                    </button>
                </div>

                {/* Notifikasi */}
                {notification && (
                    <Notification
                        type={notification.type}
                        message={notification.message}
                        onClose={() => setNotification(null)}
                    />
                )}

                <div className="mt-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="text-sm text-foreground">
                                Long URL
                            </label>
                            <input
                                type="url"
                                className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                                placeholder="https://example.com/"
                                name="original_url"
                                value={data.original_url}
                                onChange={(e) =>
                                    setData("original_url", e.target.value)
                                }
                                required
                            />
                            {errors.original_url && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.original_url}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-4 md:flex-row md:gap-0">
                            <div className="w-full md:basis-3/4 md:me-4">
                                <label className="text-sm text-foreground">
                                    Short URL
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1 bg-white text-gray-700"
                                    value={`${window.location.host}/s/`}
                                    readOnly
                                />
                            </div>
                            <div className="w-full md:basis-3/4">
                                <label className="text-sm text-foreground">
                                    Alias
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1 bg-white text-gray-700"
                                    placeholder="custom-alias"
                                    name="custom_alias"
                                    value={data.custom_alias}
                                    onChange={(e) =>
                                        setData("custom_alias", e.target.value)
                                    }
                                />
                                {errors.custom_alias && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.custom_alias}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-foreground">
                                Expiration Date
                            </label>
                            <input
                                type="date"
                                className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                                name="expires_at"
                                value={data.expires_at}
                                onChange={(e) =>
                                    setData("expires_at", e.target.value)
                                }
                                required
                            />
                            {errors.expires_at && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.expires_at}
                                </div>
                            )}
                        </div>

                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? "Shortened Link..." : "Shortened Link"}
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </div>
    );
}
