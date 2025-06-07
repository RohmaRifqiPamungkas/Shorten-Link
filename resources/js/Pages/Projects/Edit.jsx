import React, { useState } from "react";
import { useForm, Head } from "@inertiajs/react";
import { Icon } from "@iconify/react";
import { Inertia } from '@inertiajs/inertia';
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import DeleteModal from "@/Components/Alert/DeleteModal";
import SharePopup from "@/Components/Alert/ShareModal";
import Notification from "@/Components/Notification/Notification";

const EditUrlPage = ({ auth, project }) => {
    const { data, setData, patch, processing, errors } = useForm({
        project_name: project.project_name || "",
        project_slug: project.project_slug || "",
    });
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProjectToDelete, setSelectedProjectToDelete] =
        useState(null);
    const [isShareModalOpen, setShareModalOpen] = useState(false);
    const [selectedShareUrl, setSelectedShareUrl] = useState("");
    const [notification, setNotification] = useState(null);

    const handleCopy = (project) => {
        const fullUrl = `${window.location.host}/m/${project.project_slug}`;
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

    const handleShareClick = (project) => {
        const fullUrl = `${window.location.host}/m/${project.project_slug}`;
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
            <div className="mb-4 flex items-center justify-between text-sm text-foreground">
                <span className="text-foreground text-lg font-medium">
                    Your Link Is :{" "}
                    <a
                        className="underline"
                        href={`/m/${project.project_slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {`${window.location.host}/m/${project.project_slug}`}
                    </a>
                </span>
                <div className="flex gap-2 ml-4">
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

                    <div className="flex flex-row">
                        <div className="basis-1/5">
                            <label className="text-sm text-foreground">
                                Project URL
                            </label>
                            <input
                                type="text"
                                className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700"
                                value={`${window.location.host}/m/`}
                                readOnly
                            />
                        </div>
                        <div className="basis-4/5 ms-4">
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
