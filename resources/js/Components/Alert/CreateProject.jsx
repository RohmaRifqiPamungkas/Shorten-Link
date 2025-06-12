import React, { useState } from "react";
import PrimaryButton from "@/Components/PrimaryButton";
import Notification from "../Notification/Notification";
import { useForm } from "@inertiajs/react";

export default function CreateProject({ show, onClose }) {
    const [notification, setNotification] = useState(null);
    const { data, setData, post, processing, errors, reset } = useForm({
        project_name: "",
        project_slug: "",
    });

    if (!show) return null;

    const handleSubmit = (e) => {
        e.preventDefault();

        setNotification(null);

        post("/projects", {
            onSuccess: () => {
                setNotification({
                    type: "success",
                    message: "Created Successfully.",
                });
                reset();
          
         
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
                            Management Link
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
                        <div>
                            <label className="text-sm text-foreground">
                                Name Project
                            </label>
                            <input
                                type="text"
                                className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                                placeholder="example"
                                name="project_name"
                                value={data.project_name}
                                onChange={(e) =>
                                    setData("project_name", e.target.value)
                                }
                                required
                            />
                            {errors.project_name && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.project_name}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-4 md:flex-row md:gap-0">
                            <div className="w-full md:basis-3/4 md:me-4">
                                <label className="text-sm text-foreground">
                                    URL
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-brfourth rounded-lg px-2.5 py-2 mt-1 bg-white text-foreground"
                                    value={`${window.location.host}/m/`}
                                    readOnly
                                />
                            </div>
                            <div className="w-full md:basis-3/4 ">
                                <label className="text-sm text-foreground">
                                    Alias
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1 bg-white text-foreground"
                                    placeholder="custom-alias"
                                    id="project_slug"
                                    name="project_slug"
                                    value={data.project_slug}
                                    onChange={(e) =>
                                        setData("project_slug", e.target.value)
                                    }
                                    
                                />
                                {errors.project_slug && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.project_slug}
                                    </div>
                                )}
                            </div>
                        </div>

                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? "Add Project..." : "Add Project"}
                        </PrimaryButton>
                    </form>
                </div>
            </div>
        </div>
    );
}
