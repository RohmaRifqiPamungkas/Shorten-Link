import React, { useState } from "react";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import Notification from "@/Components/Notification/Notification";
import { useForm } from "@inertiajs/react";
import { TbWorldWww } from "react-icons/tb";

export default function CreateDomains({ show, onClose }) {
    const [notification, setNotification] = useState(null);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        domains: "",
    });

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

        post(route("domains.store"), {
            onSuccess: () => {
                setNotification({
                    type: "success",
                    message: "Domain added successfully, please verify DNS.",
                });
                reset();
                clearErrors();
                onClose();
            },
            onError: () => {
                setNotification({
                    type: "error",
                    message: "Failed to add domain. Check input.",
                });
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm md:max-w-2xl p-5 md:p-10 relative">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <div className="flex items-center">
                        <TbWorldWww className="text-primary-100 w-6 h-6" />
                        <h2 className="ml-3 text-base md:text-lg font-semibold text-primary-100">
                            Add Custom Domain
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-gray-500 hover:text-primary-100 text-lg font-bold"
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

                {/* Form */}
                <div className="mt-4">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Domain Input */}
                        <div>
                            <label className="text-sm text-foreground">
                                Domain
                            </label>
                            <input
                                type="text"
                                className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1 bg-white text-gray-700"
                                placeholder="https://yourdomain.com"
                                name="domain"
                                value={data.domain}
                                onChange={(e) =>
                                    setData("domain", e.target.value)
                                }
                                required
                            />
                            {errors.domain && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.domain}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? "Created Domain..." : "Save Domain"}
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </div>
    );
}
