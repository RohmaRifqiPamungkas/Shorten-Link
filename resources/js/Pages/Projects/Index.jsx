import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import SearchBar from "@/Components/Searchbar/Search";
import Pagination from "@/Components/Pagination/Pagination";
import BulkActions from "@/Components/BulkAction/BulkAction";
import ShortenButton from "@/Components/Button/ButtonShort";
import CreateProject from "@/Components/Alert/CreateProject";
import DeleteModal from "@/Components/Alert/DeleteModal";
import SharePopup from "@/Components/Alert/ShareModal";
import Notification from "@/Components/Notification/Notification";
import { Icon } from "@iconify/react";
import { FiPlus } from "react-icons/fi";

export default function ProjectsDashboard({ auth }) {
    const { projects = { data: [], links: [] }, success } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [bulkMode, setBulkMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProjectToDelete, setSelectedProjectToDelete] = useState(null);
    const [isShareModalOpen, setShareModalOpen] = useState(false);
    const [selectedShareUrl, setSelectedShareUrl] = useState("");
    const [notification, setNotification] = useState(null);
    const [perPage, setPerPage] = useState(Number(new URLSearchParams(window.location.search).get('perPage')) || 10);

    // Show notification if success flash message from backend
    useEffect(() => {
        if (success) {
            setNotification({
                type: "success",
                message: success,
            });
            Inertia.replace(window.location.pathname + window.location.search);
        }
    }, [success]);

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

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

    const handleShareClick = (project) => {
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
            Inertia.delete(
                `/projects/${selectedProjectToDelete.id}`,
                {
                    onSuccess: () => {
                        setDeleteModalOpen(false);
                        setSelectedProjectToDelete(null);
                    },
                    onError: () => {
                        setNotification({
                            type: "error",
                            message: "Failed to delete project. Please try again.",
                        });
                        setDeleteModalOpen(false);
                        setSelectedProjectToDelete(null);
                    },
                    preserveScroll: true,
                }
            );
        } else {
            setDeleteModalOpen(false);
        }
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) {
            setNotification({
                type: "error",
                message: "No projects selected.",
            });
            return;
        }

        if (!window.confirm("Are you sure you want to delete selected projects?")) return;

        Inertia.post('/projects/bulk-delete', {
            ids: selectedIds,
            _method: 'DELETE',
        }, {
            onSuccess: () => {
                setNotification({
                    type: "success",
                    message: "Selected Deleted Successfully.",
                });
                setSelectedIds([]);
                setBulkMode(false);
            },
            onError: () => {
                setNotification({
                    type: "error",
                    message: "Failed to delete selected projects.",
                });
            },
            preserveScroll: true,
        });
    };

    // Search & Pagination handled by backend, so just send params
    const handlePageChange = (newPage) => {
        Inertia.get(
            `/projects`,
            {
                page: newPage,
                perPage,
                search: searchTerm,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handlePerPageChange = (newPerPage) => {
        setPerPage(newPerPage);
        Inertia.get(
            `/projects`,
            {
                page: 1,
                perPage: newPerPage,
                search: searchTerm,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        Inertia.get(
            `/projects`,
            {
                page: 1,
                perPage,
                search: term,
            },
            {
                preserveState: true,
                replace: true,
            }
        );
    };

    return (
        <DashboardLayout user={auth.user}>
            <Head title="Management Link" />

            <div className="py-5">
                <h1 className="text-2xl font-semibold text-primary-100">
                    Management Link
                </h1>

                <div className="flex justify-between items-center flex-wrap gap-5 my-3">
                    <p className="text-gray-700 text-lg font-medium">
                        List Management Link
                    </p>

                    <div className="flex items-center gap-3 transition-all duration-300 ease-in-out flex-wrap">
                        <div className="transition-all duration-300">
                            <ShortenButton
                                onClick={() => setShowPopup(true)}
                                label="Add Project"
                                icon={<FiPlus size={18} />}
                            />
                        </div>
                        <div className="transition-all duration-300">
                            <SearchBar onSearch={handleSearch} />
                        </div>
                        <div className="transition-all duration-300">
                            <BulkActions
                                isActive={bulkMode}
                                toggleBulkMode={() => {
                                    setBulkMode(!bulkMode);
                                    setSelectedIds([]);
                                }}
                                onDelete={handleBulkDelete}
                            />
                        </div>
                    </div>
                </div>

                {notification && (
                    <Notification
                        type={notification.type}
                        message={notification.message}
                        onClose={() => setNotification(null)}
                    />
                )}

                <div className="overflow-x-auto bg-white shadow rounded-2xl">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-muted">
                                {bulkMode && (
                                    <th className="px-4 py-6">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.length === projects.data.length && projects.data.length > 0}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedIds(projects.data.map((p) => p.id));
                                                } else {
                                                    setSelectedIds([]);
                                                }
                                            }}
                                        />
                                    </th>
                                )}
                                <th className="px-4 py-6 font-semibold">
                                    Project Name
                                </th>
                                <th className="px-4 py-6 font-semibold">URL</th>
                                <th className="px-4 py-6 font-semibold">
                                    Date Created
                                </th>
                                <th className="px-4 py-6 font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.data.length > 0 ? (
                                projects.data.map((project) => (
                                    <tr
                                        key={project.id}
                                        className="border-b border-muted hover:bg-gray-50"
                                    >
                                        {bulkMode && (
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(
                                                        project.id
                                                    )}
                                                    onChange={() =>
                                                        toggleSelect(project.id)
                                                    }
                                                />
                                            </td>
                                        )}
                                        <td className="px-4 py-4 whitespace-nowrap hover:underline flex items-center gap-2">
                                            <span
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-white font-bold text-lg"
                                                style={{ flexShrink: 0 }}
                                            >
                                                {project.project_name
                                                    .charAt(0)
                                                    .toUpperCase()}
                                            </span>
                                            <a
                                                href={`/projects/${project.id}/categories`}
                                                className="hover:underline text-foreground"
                                            >
                                                {project.project_name}
                                            </a>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <a
                                                href={`http://localhost:8000/m/${project.project_slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-foreground hover:underline"
                                            >
                                                {`http://localhost:8000/m/${project.project_slug}`}
                                            </a>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {project.created_at.slice(0, 10)}
                                        </td>
                                        <td
                                            className="px-4 py-4 space-x-4 text-lg text-gray-700 flex"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                title="Copy"
                                                onClick={() =>
                                                    handleCopy(project)
                                                }
                                                className="hover:text-primary-100"
                                            >
                                                <Icon
                                                    icon="akar-icons:copy"
                                                    width={20}
                                                    height={20}
                                                />
                                            </button>

                                            <Link
                                                href={`/projects/${project.id}/edit`}
                                                title="Edit"
                                                className="hover:text-primary-100"
                                            >
                                                <Icon
                                                    icon="iconamoon:edit-light"
                                                    width={20}
                                                    height={20}
                                                />
                                            </Link>

                                            <button
                                                onClick={() =>
                                                    handleDeleteClick(project)
                                                }
                                                title="Delete"
                                                className="hover:text-primary-100"
                                            >
                                                <Icon
                                                    icon="gravity-ui:trash-bin"
                                                    width={20}
                                                    height={20}
                                                />
                                            </button>

                                            <button
                                                title="Share"
                                                onClick={() =>
                                                    handleShareClick(project)
                                                }
                                                className="hover:text-primary-100"
                                            >
                                                <Icon
                                                    icon="tabler:share"
                                                    width={20}
                                                    height={20}
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={bulkMode ? 4 : 3}
                                        className="px-4 py-6 text-center text-gray-500"
                                    >
                                        No projects available yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination
                    pagination={{
                        current_page: projects.current_page,
                        last_page: projects.last_page,
                        from: projects.from,
                        to: projects.to,
                        total: projects.total,
                    }}
                    perPage={perPage}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />

                {/* Delete Modal */}
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

                <CreateProject
                    show={showPopup}
                    onClose={() => setShowPopup(false)}
                    onSuccess={() => Inertia.reload()}
                />
            </div>
        </DashboardLayout>
    );
}