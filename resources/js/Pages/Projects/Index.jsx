import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import { Inertia } from '@inertiajs/inertia';
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
            Inertia.post(`/projects/${selectedProjectToDelete.id}`, {
                _method: "DELETE",
            }, {
                onSuccess: () => {

                    setNotification({
                        type: "success",
                        message: "Project deleted successfully.",
                    });

                },
                onError: () => {
                    setNotification({
                        type: "error",
                        message: "Failed to delete project. Please try again.",
                    });
                },
            });
        }

        setDeleteModalOpen(false);
    };

    const filteredProjects = projects.data.filter((project) =>
        project.project_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const [perPage, setPerPage] = useState(10);

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
                            <SearchBar onSearch={setSearchTerm} />
                        </div>
                        <div className="transition-all duration-300">
                            <BulkActions
                                isActive={bulkMode}
                                toggleBulkMode={() => {
                                    setBulkMode(!bulkMode);
                                    setSelectedIds([]);
                                }}
                                onDelete={() =>
                                    alert(
                                        "Bulk delete belum diimplementasikan."
                                    )
                                }
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
                                        <input type="checkbox" disabled />
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
                            {filteredProjects.length > 0 ? (
                                filteredProjects.map((project) => (
                                    <tr
                                        key={project.id}
                                        className="border-b border-muted hover:bg-gray-50 cursor-pointer"
                                        onClick={() =>
                                            (window.location.href = `/projects/${project.id}/categories`)
                                        }
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
                                            {/* Avatar lingkaran dengan huruf awal */}
                                            <span
                                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-white font-bold text-lg"
                                                style={{ flexShrink: 0 }}
                                            >
                                                {project.project_name.charAt(0).toUpperCase()}
                                            </span>
                                            {project.project_name}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <a
                                                href={`http://localhost:8000/m/${project.project_slug}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 hover:underline"
                                            >
                                                {`http://localhost:8000/m/${project.project_slug}`}
                                            </a>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                {category.created_at.slice(0, 10)}
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
                                        Belum ada proyek yang tersedia.
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
