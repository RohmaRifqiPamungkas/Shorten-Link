import React, { useState } from "react";
import { useForm, Head } from "@inertiajs/react";
import { Inertia } from '@inertiajs/inertia';
import { Icon } from "@iconify/react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import PrimaryButton from "@/Components/PrimaryButton";
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import DeleteModal from "@/Components/Alert/DeleteModal";
import SharePopup from "@/Components/Alert/ShareModal";
import Notification from "@/Components/Notification/Notification";

const EditUrlPage = ({ auth, link }) => {
    const { data, setData, patch, processing, errors } = useForm({
        original_url: link.original_url,
        custom_alias: link.custom_alias || "",
        expires_at: link.expires_at ? link.expires_at.substring(0, 10) : "",
    });
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedLinkToDelete, setSelectedLinkToDelete] =
        useState(null);
    const [isShareModalOpen, setShareModalOpen] = useState(false);
    const [selectedShareUrl, setSelectedShareUrl] = useState("");
    const [notification, setNotification] = useState(null);

    const handleCopy = (link) => {
        const fullUrl = `${window.location.host}/s/${link.custom_alias}`;
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

    const handleShareClick = (link) => {
          const fullUrl = `${window.location.host}/s/${link.custom_alias}`;
        setSelectedShareUrl(fullUrl);
        setShareModalOpen(true);
    };

    const handleDeleteClick = (link) => {
        setSelectedLinkToDelete(link);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
    if (selectedLinkToDelete) {
        Inertia.post(
            `/shorten/${selectedLinkToDelete.id}`,
            { _method: "DELETE" },
            {
                onSuccess: () => {
                    Inertia.visit("/shorten", {
                        replace: true,
                        preserveScroll: true,
                    });
                },
            }
        );
    }

    setDeleteModalOpen(false);
};


    const onSubmit = (e) => {
        e.preventDefault();
        patch(`/shorten/${link.id}`);
    };

    return (
        <DashboardLayout user={auth.user}>
            <Breadcrumb />
              <Head title="   Edit Link" />
            <h2 className="text-xl font-semibold text-blue-900 mt-4 mb-4">
                Edit URL
            </h2>

            {/* Link & Icons */}
            <div className="mb-4 flex items-center justify-between text-sm text-foreground">
                <span className="text-foreground text-lg font-medium">
                    Your Link Is :{" "}
                    <a
                        className="underline"
                        href={`/s/${data.custom_alias}`}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {`${window.location.host}/m/${data.custom_alias}`}
                    </a>
                </span>
                <div className="flex gap-2 ml-4">
                    <button
                        type="button"
                        title="Copy"
                        onClick={() => handleCopy(link)}
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
                        onClick={() => handleDeleteClick(link)}
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
                        onClick={() => handleShareClick(link)}
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
                            Long URL
                        </label>
                        <input
                            type="url"
                            className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                            placeholder="https://example.com/"
                            value={data.original_url}
                            onChange={(e) =>
                                setData("original_url", e.target.value)
                            }
                            required
                        />
                        {errors.original_url && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.original_url}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-row">
                        <div className="basis-1/5">
                            <label className="text-sm text-foreground">
                                Short URL
                            </label>
                            <input
                                type="text"
                                className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1 bg-gray-100 text-gray-700"
                                value={`sevenpion.com/s/`}
                                readOnly
                            />
                        </div>
                        <div className="basis-4/5 ms-4">
                            <label className="text-sm text-foreground">
                                Alias
                            </label>
                            <input
                                type="text"
                                className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                                placeholder="custom-alias"
                                value={data.custom_alias}
                                onChange={(e) =>
                                    setData("custom_alias", e.target.value)
                                }
                            />
                            {errors.custom_alias && (
                                <p className="text-red-500 text-sm mt-1">
                                    {errors.custom_alias}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className="text-sm text-foreground">
                            Expiration Date
                        </label>
                        <input
                            type="date"
                            className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                            value={data.expires_at}
                            onChange={(e) =>
                                setData("expires_at", e.target.value)
                            }
                        />
                        {errors.expires_at && (
                            <p className="text-red-500 text-sm mt-1">
                                {errors.expires_at}
                            </p>
                        )}
                    </div>

                    <PrimaryButton type="submit" disabled={processing}>
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
