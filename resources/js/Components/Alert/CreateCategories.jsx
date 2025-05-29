import React, { useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import Notification from "../Notification/Notification";
import { useForm } from "@inertiajs/react";

export default function CreateProject({ show, onClose, project }) {
    const [notification, setNotification] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
    });

    if (!show) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        post(`/projects/${project.id}/categories`, {
            onSuccess: () => {
                setNotification({
                    type: 'success',
                    message: 'Kategori berhasil ditambahkan!',
                });
                reset();
            },
            onError: () => {
                setNotification({
                    type: 'error',
                    message: 'Terjadi kesalahan, periksa input Anda.',
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
                            Categories Link
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
                            {processing ? 'Create Categories...' : 'Create Categories'}
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </div>
    );
}
