import React, { useState, useEffect, useRef } from "react";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import ToastAlert from "@/Components/Notification/ToastAlert";
import { useForm } from "@inertiajs/react";
import { FiTag } from "react-icons/fi";

export default function CreateCategories({ show, onClose, project }) {
    const [notification, setNotification] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);
    const fileInputRef = useRef(null);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        name: '',
        image: null,
    });

    useEffect(() => {
        if (!show) {
            reset();
            clearErrors();
            setNotification(null);
            setPreviewImage(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }, [show]);

    if (!show) return null;

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // Frontend validation: max 1MB
            if (file.size > 1 * 1024 * 1024) {
                setNotification({
                    type: 'error',
                    message: 'The file is too large. Maximum size is 1 MB.',
                });
                setData("image", null);
                setPreviewImage(null);
                e.target.value = '';
                return;
            }

            setData("image", file);

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
                clearErrors();
                setPreviewImage(null);
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            },
            onError: () => {
                setNotification({
                    type: 'error',
                    message: 'An error occurred, please check your input.',
                });
            },
        });
    };

    const handleClose = () => {
        reset();
        clearErrors();
        setNotification(null);
        setPreviewImage(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
            <div className="bg-white rounded-2xl shadow-xl w-full  max-w-sm md:max-w-2xl p-5 md:p-10 relative">
                {/* Header */}
                <div className="flex justify-between items-center border-b border-gray-200 pb-3">
                    <div className="flex items-center">
                        <FiTag className="text-primary-100 w-6 h-6" />
                        <h2 className="ml-3 text-base md:text-lg font-semibold text-primary-100">
                            Categories Link
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
                    <ToastAlert
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
                                Image Logo
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                                onChange={handleImageChange}
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Recommended format: JPG, PNG, or WEBP. Maximum size: 1 MB.
                            </p>
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
