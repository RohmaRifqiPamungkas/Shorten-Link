import React, { useState, useEffect } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import Notification from "../Notification/Notification";
import { useForm } from "@inertiajs/react";

export default function UpdateCategories({ show, onClose, project, category }) {
    const [notification, setNotification] = useState(null);

    const { data, setData, patch, processing, errors, reset } = useForm({
        name: category?.name || "",
    });

    useEffect(() => {
        setData("name", category?.name || "");
    }, [category, setData]);

    if (!show) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        patch(`/projects/${project.id}/categories/${category.id}`, {
            onSuccess: () => {
                setNotification({
                    type: 'success',
                    message: 'Updated Succesfully.',
                });
                reset();
            },
            onError: () => {
                setNotification({
                    type: 'error',
                    message: 'An error occurred, please check your input',
                });
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-10 relative">
                <div className="flex justify-between">
                    <div className="flex flex-row">
                        <img
                            src="/images/Hyperlink.png"
                            style={{ width: "24px", height: "24px" }}
                            alt="hyperlink"
                        />
                        <h2 className="text-xl ms-4 font-semibold text-primary-100 mb-4">
                           Edit Categories Link
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-foreground font-black hover:text-primary-100"
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
                        <div className="space-y-2">
                            <label className="text-sm text-foreground">
                                Name Categories
                            </label>
                            <input
                                type="text"
                                className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                                placeholder="Example"
                                value={data.name}
                                onChange={(e) => setData("name", e.target.value)}
                                required
                            />
                            {errors.name && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.name}
                                </div>
                            )}
                        </div>

                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? 'Update Categories...' : 'Update Categories'}
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </div>
    );
}
