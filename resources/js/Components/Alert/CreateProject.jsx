import React, { useState } from "react";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import AISuggestButton from "../AISuggestButton";
import ToastAlert from "../Notification/ToastAlert";
import { useForm } from "@inertiajs/react";

export default function CreateProject({ show, onClose, domains = [] }) {
    const [notification, setNotification] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [usePassword, setUsePassword] = useState(false);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors,
    } = useForm({
        domain_id: "",
        project_name: "",
        project_slug: "",
        password: "",
    });

    // Tidak render jika tidak show
    if (!show) return null;

    const handleClose = () => {
        reset();
        clearErrors();
        setNotification(null);
        setUsePassword(false);
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setNotification(null);

        if (!usePassword) {
            setData("password", "");
        }

        post(route("projects.store"), {
            onSuccess: () => {
                setNotification({
                    type: "success",
                    message: "Created Successfully.",
                });
                reset();
                clearErrors();
                setUsePassword(false);
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

    console.log("Domains from props:", domains);


    const handleAISuggest = async () => {
        if (!data.project_name) {
            setNotification({
                type: "error",
                message: "Fill in the Project Name first!",
            });
            return;
        }

        try {
            setLoadingAI(true);

            const res = await fetch("/ai/project-slug", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRF-TOKEN": document
                        .querySelector('meta[name="csrf-token"]')
                        .getAttribute("content"),
                },
                body: JSON.stringify({ project_name: data.project_name }),
            });

            const json = await res.json();

            if (json.slug) {
                setData("project_slug", json.slug);
                setNotification({
                    type: "success",
                    message: "AI successfully generated slug.",
                });
            } else {
                setNotification({
                    type: "error",
                    message: "AI did not return slug.",
                });
            }
        } catch (err) {
            console.error(err);
            setNotification({
                type: "error",
                message: "Failed to generate slug from AI.",
            });
        } finally {
            setLoadingAI(false);
        }
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

                        {/* Select Domain */}
                        <div>
                            <label className="text-sm text-foreground">
                                Domain
                            </label>
                            <select
                                name="domain_id"
                                value={data.domain_id}
                                onChange={(e) => setData("domain_id", e.target.value)}
                                className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1 bg-white text-gray-700"
                            >
                                <option value="">-- Select Domain --</option>
                                {domains.map((d) => (
                                    <option key={d.id} value={d.id}>
                                        {d.domain}
                                    </option>
                                ))}
                            </select>
                            {errors.domain_id && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.domain_id}
                                </div>
                            )}
                        </div>

                        {/* Project Name */}
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

                        {/* Slug + AI Suggest */}
                        <div className="flex flex-col gap-4 md:flex-row md:gap-0">
                            <div className="w-full md:basis-3/4 md:me-4">
                                <label className="text-sm text-foreground">
                                    URL
                                </label>
                                <input
                                    type="text"
                                    className="w-full border border-brfourth rounded-lg px-2.5 py-2 mt-1 bg-white text-foreground"
                                    value={
                                        `${data.domain_id
                                            ? domains.find((d) => d.id == data.domain_id)?.domain.replace(/\/+$/, "") // hapus trailing /
                                            : window.location.origin
                                        }/m/${data.project_slug || ""}`
                                    }
                                    readOnly
                                />
                            </div>
                            <div className="w-full md:basis-3/4">
                                <label className="text-sm text-foreground">
                                    Alias
                                </label>
                                <div className="flex gap-2">
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
                                    <AISuggestButton
                                        onClick={handleAISuggest}
                                        loading={loadingAI}
                                        className="mt-1"
                                    />
                                </div>
                                {errors.project_slug && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.project_slug}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Opsional Password */}
                        <div>
                            <label className="flex items-center gap-2 text-sm text-foreground">
                                <input
                                    type="checkbox"
                                    checked={usePassword}
                                    onChange={(e) =>
                                        setUsePassword(e.target.checked)
                                    }
                                />
                                Protect with Password?
                            </label>

                            {usePassword && (
                                <input
                                    type="password"
                                    className="w-full border border-brfourth rounded-lg px-3 py-2 mt-2"
                                    placeholder="Enter password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />
                            )}
                            {errors.password && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.password}
                                </div>
                            )}
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
