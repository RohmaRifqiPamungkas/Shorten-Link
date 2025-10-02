import React, { useState } from "react";
import { useForm, Head } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Inertia } from '@inertiajs/inertia';
import DashboardLayout from "@/Components/DashboardLayout/DashboardLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import DeleteModal from "@/Components/Alert/DeleteModal";
import SharePopup from "@/Components/Alert/ShareModal";
import Notification from "@/Components/Notification/Notification";

const EditUrlPage = ({ auth, project, domains }) => {
    const { data, setData, patch, processing, errors } = useForm({
        project_name: project.project_name || "",
        project_slug: project.project_slug || "",
        domain_id: project.domain_id || "",
        current_password: "",
        new_password: "",
    });

    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedShareUrl, setSelectedShareUrl] = useState("");
    const [isShareModalOpen, setShareModalOpen] = useState(false);
    const [notification, setNotification] = useState(null);

    const handleCopy = (project) => {
        const fullUrl = `${window.location.origin}/m/${project.project_slug}`;
        navigator.clipboard
            .writeText(fullUrl)
            .then(() => {
                setNotification({
                    type: "success",
                    message: "Link copied to clipboard!",
                });
            })
            .catch(() => {
                setNotification({
                    type: "error",
                    message: "Failed to copy the link.",
                });
            });
    };

    const handleShareClick = () => {
        const fullUrl = `${window.location.origin}/m/${project.project_slug}`;
        setSelectedShareUrl(fullUrl);
        setShareModalOpen(true);
    };

    const handleDeleteClick = (project) => {
        setSelectedProjectToDelete(project);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedProjectToDelete) {
            Inertia.post(
                `/projects/${selectedProjectToDelete.id}`,
                {
                    _method: "DELETE",
                },
                {
                    onSuccess: () => {
                        setNotification({
                            type: "success",
                            message: "Project deleted successfully.",
                        });
                    },
                    onError: () => {
                        setNotification({
                            type: "error",
                            message:
                                "Failed to delete project. Please try again.",
                        });
                    },
                }
            );
        }

        setDeleteModalOpen(false);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        patch(`/projects/${project.id}`);
    };

    return (
        <DashboardLayout user={auth.user}>
            <Head title="   Edit Link" />
            <Breadcrumb />

            <h2 className="text-xl font-semibold text-blue-900 mt-4 mb-4">
                Edit Project URL
            </h2>

            {/* URL & Icons Row */}
            <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4 md:justify-between text-sm text-foreground">
                <span className="text-foreground text-sm md:text-lg font-medium">
                    Your Link Is :{" "}
                    <a
                        className="underline"
                        href={`/m/${project.project_slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {`${project.domain_id
                            ? `https://${domains.find((d) => d.id == project.domain_id)?.domain}`
                            : window.location.origin
                            }/s/${project.project_slug}`}

                    </a>
                </span>
                <div className="flex gap-2 md:ml-4">
                    <button
                        type="button"
                        title="Copy"
                        onClick={() => handleCopy(project)}
                        className="group bg-white p-3 rounded-lg shadow hover:bg-primary-100"
                    >
                        <Icon
                            icon="akar-icons:copy"
                            width={20}
                            height={20}
                            className="text-foreground group-hover:text-white"
                        />
                    </button>
                    <button
                        type="button"
                        title="Delete"
                        onClick={() => handleDeleteClick(project)}
                        className="group bg-white p-3 rounded-lg shadow hover:bg-primary-100"
                    >
                        <Icon
                            icon="gravity-ui:trash-bin"
                            width={20}
                            height={20}
                            className="text-foreground group-hover:text-white"
                        />
                    </button>
                    <button
                        type="button"
                        title="Share"
                        onClick={() => handleShareClick(project)}
                        className="group bg-white p-3 rounded-lg shadow hover:bg-primary-100"
                    >
                        <Icon
                            icon="tabler:share"
                            width={20}
                            height={20}
                            className="text-foreground group-hover:text-white"
                        />
                    </button>
                </div>
            </div>

            {notification && (
                <Notification
                    type={notification.type}
                    message={notification.message}
                    onClose={() => setNotification(null)}
                />
            )}

            {/* Form */}
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl md:max-w-full p-10 relative">
                <form onSubmit={onSubmit} className="space-y-6">
                    <div>
                        <label className="text-sm text-foreground">
                            Project Name
                        </label>
                        <input
                            type="text"
                            className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                            placeholder="Nama project"
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

                    {/* Domain Picker */}
                    <div>
                        <label className="text-sm text-foreground">Domain</label>
                        <select
                            className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1 bg-white text-gray-700"
                            value={data.domain_id || ""}
                            onChange={(e) => setData("domain_id", e.target.value)}
                        >
                            <option value="">Default ({window.location.origin})</option>
                            {domains.map((d) => (
                                <option key={d.id} value={d.id}>
                                    {d.domain}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="flex flex-col md:flex-row gap-4 md:gap-0">
                        <div className="basis-3/4 md:me-4">
                            <label className="text-sm text-foreground">URL</label>
                            <input
                                type="text"
                                className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1 bg-white text-gray-700"
                                value={
                                    `${data.domain_id
                                        ? `https://${domains.find((d) => d.id == data.domain_id)?.domain}`
                                        : window.location.origin
                                    }/m/${data.project_slug || ""}`
                                }
                                readOnly
                            />
                        </div>
                        <div className="basis-3/4 ">
                            <label className="text-sm text-foreground">
                                Alias
                            </label>
                            <input
                                type="text"
                                className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1 bg-white text-gray-700"
                                placeholder="custom-alias"
                                value={data.project_slug}
                                onChange={(e) =>
                                    setData("project_slug", e.target.value)
                                }
                                required
                            />
                            {errors.project_slug && (
                                <div className="text-red-500 text-sm mt-1">
                                    {errors.project_slug}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Password */}
                    <div className="mt-6">
                        <h3 className="text-md font-semibold text-primary-100 mb-2">
                            Password Protection
                        </h3>

                        {project.password && (
                            <div className="mb-4">
                                <label className="text-sm text-foreground">
                                    Current Password
                                </label>
                                <input
                                    type="password"
                                    className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                                    placeholder="Enter current password"
                                    onChange={(e) =>
                                        setData(
                                            "current_password",
                                            e.target.value
                                        )
                                    }
                                />
                                {errors.current_password && (
                                    <p className="text-red-500 text-sm mt-1">
                                        {errors.current_password}
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="text-sm text-foreground">
                                New Password
                            </label>
                            <input
                                type="password"
                                className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                                placeholder="Enter new password (leave empty to remove)"
                                onChange={(e) =>
                                    setData("new_password", e.target.value)
                                }
                            />
                            {errors.new_password && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.new_password}
                                </p>
                            )}
                        </div>
                    </div>

                    <PrimaryButton
                        type="submit"
                        disabled={processing}
                        className="w-full bg-primary-100 hover:bg-secondary text-white py-2 rounded-md font-semibold"
                    >
                        {processing ? "Updating..." : "Update"}
                    </PrimaryButton>
                </form>

                {isDeleteModalOpen && (
                    <DeleteModal
                        isOpen={isDeleteModalOpen}
                        onClose={() => setDeleteModalOpen(false)}
                        onConfirm={handleConfirmDelete}
                    />
                )}

                {isShareModalOpen && (
                    <SharePopup
                        url={selectedShareUrl}
                        onClose={() => setShareModalOpen(false)}
                    />
                )}
            </div>
        </DashboardLayout>
    );
};

export default EditUrlPage;
