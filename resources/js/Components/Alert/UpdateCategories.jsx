import React, { useState, useEffect } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import Notification from "../Notification/Notification";
import { useForm, router } from "@inertiajs/react";

export default function UpdateCategories({ show, onClose, project, category }) {
    const [notification, setNotification] = useState(null);
    const [imagePreview, setImagePreview] = useState("");

    const { data, setData, processing, errors, reset } = useForm({
        name: category?.name || "",
        image: null,
    });

    useEffect(() => {
        if (category) {
            setData({
                name: category.name || "",
                image: null,
            });

            setImagePreview(category.image_url ? `/uploads/${category.image_url}` : "");
        }
    }, [category?.id]);

    if (!show) return null;

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("image", file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append("name", data.name?.trim() || "");
        if (data.image) {
            formData.append("image", data.image);
        }
        formData.append("_method", "PATCH");

        router.post(route("projects.categories.update", [project.id, category.id]), formData, {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => {
                setNotification({ type: "success", message: "Updated Successfully." });
                reset();
                setImagePreview("");
                onClose();
            },
            onError: () => {
                setNotification({ type: "error", message: "An error occurred, please check your input" });
            },
        });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl p-5 md:p-10 relative">
                <div className="flex justify-between">
                    <div className="flex flex-row">
                        <img
                            src="/images/Hyperlink.png"
                            style={{ width: "24px", height: "24px" }}
                            alt="hyperlink"
                        />
                        <h2 className="text-sm md:text-xl ms-4 font-semibold text-primary-100 mb-4">
                            Edit Categories Link
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-foreground font-black hover:text-primary-100 w-2 h-2 md:w-4 md:h-4"
                    >
                        ✕
                    </button>
                </div>

                {notification && (
                    <Notification
                        type={notification.type}
                        message={notification.message}
                        onClose={() => setNotification(null)}
                    />
                )}

                <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <label className="text-sm text-foreground">Name Categories</label>
                        <input
                            type="text"
                            className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                            placeholder="Example"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                        {errors.name && (
                            <div className="text-red-500 text-sm mt-1">{errors.name}</div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm text-foreground">Image Logo</label>
                        <input
                            type="file"
                            accept="image/*"
                            className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                            onChange={handleFileChange}
                        />
                        {errors.image && (
                            <div className="text-red-500 text-sm mt-1">{errors.image}</div>
                        )}
                        {imagePreview && (
                            <img
                                src={imagePreview}
                                alt="Preview"
                                className="mt-2 max-h-32 object-contain rounded"
                            />
                        )}
                    </div>

                    <PrimaryButton type="submit" disabled={processing}>
                        {processing ? "Updating..." : "Update Categories"}
                    </PrimaryButton>
                </form>
            </div>
        </div>
    );
}
