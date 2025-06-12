import React, { useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import Notification from "../Notification/Notification";
import { useForm } from "@inertiajs/react";

export default function CreateCategories({ show, onClose, project }) {
    const [notification, setNotification] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        image: null,
    });

    if (!show) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setData("image", file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewImage(null);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        post(`/projects/${project.id}/categories`, {
            forceFormData: true,
            onSuccess: () => {
                setNotification({
                    type: 'success',
                    message: 'Created Succesfully',
                });
                reset();
            },
            onError: () => {
                setNotification({
                    type: 'error',
                    message: 'An error occurred, please check your input.',
                });
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
            <div className="bg-white rounded-2xl shadow-xl w-full  max-w-sm md:max-w-2xl p-5 md:p-10 relative">
                <div className="flex justify-between">
                    <div className="flex flex-row">
                        <img
                            src="/images/Hyperlink.png"
                            style={{ width: "24px", height: "24px" }}
                            alt="hyperlink"
                        />
                        <h2 className="text-sm md:text-xl ms-4 font-semibold text-primary-100 mb-4">
                            Categories Link
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
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

                        <div className="space-y-2">
                            <label className="text-sm text-foreground">
                                Image (optional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                                onChange={handleImageChange}
                            />
                            {errors.image && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.image}
                                </div>
                            )}
                            {previewImage && (
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    className="mt-2 max-h-32 object-contain rounded"
                                />
                            )}
                        </div>

                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Categories'}
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </div>
    );
}
