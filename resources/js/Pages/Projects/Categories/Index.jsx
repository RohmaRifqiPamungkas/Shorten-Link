import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import SearchBar from "@/Components/Searchbar/Search";
import Pagination from "@/Components/Pagination/Pagination";
import BulkActions from "@/Components/BulkAction/BulkAction";
import ShortenButton from "@/Components/Button/ButtonShort";
import CreateCategories from "@/Components/Alert/CreateCategories";
import UpdateCategories from "@/Components/Alert/UpdateCategories";
import DeleteModal from "@/Components/Alert/DeleteModal";
import Notification from "@/Components/Notification/Notification";
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import { Icon } from "@iconify/react";
import { FiPlus } from "react-icons/fi";

export default function Categories({ auth, project = {} }) {
    const { categories = { data: [], links: [] } } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [bulkMode, setBulkMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showPopupUpdate, setShowPopupUpdate] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProjectToDelete, setSelectedProjectToDelete] = useState(null);
    const [notification, setNotification] = useState(null);

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
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

    const filteredCategories = categories.data.filter((category) =>
        category.name && category.name.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Head title="Add categories" />

            <Breadcrumb />

            <div className="py-5">
                <h1 className="text-2xl font-semibold text-primary-100">
                    Categories
                </h1>

                <div className="flex justify-between items-center flex-wrap gap-5 my-3">
                    <span className="text-foreground text-lg font-medium">
                        Categories for :{" "}
                        <a
                            className="underline"
                            href={`/m/${project.project_slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            sevenpion.com/m/{project.project_slug}
                        </a>
                    </span>

                    <div className="flex items-center gap-3 transition-all duration-300 ease-in-out flex-wrap">
                        <div className="transition-all duration-300">
                            <ShortenButton
                                onClick={() => setShowPopup(true)}
                                label="Add Categories"
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
                                    Categories
                                </th>

                                <th className="px-4 py-6 font-semibold">
                                    Date Created
                                </th>
                                <th className="px-4 py-6 font-semibold">
                                    Links
                                </th>
                                <th className="px-4 py-6 font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCategories.length > 0 ? (
                                filteredCategories.map((category) => (
                                    <tr
                                        key={category.id}
                                        className="border-b border-muted hover:bg-gray-50 cursor-pointer"
                                        onClick={() =>
                                            (window.location.href = `/projects/${project.id}/categories/${category.id}/links`)
                                        }
                                    >
                                        {bulkMode && (
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(category.id)}
                                                    onChange={() => toggleSelect(category.id)}
                                                />
                                            </td>
                                        )}
                                        <td className="px-4 py-4 whitespace-nowrap hover:underline">
                                            {category.name}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                          {category.created_at.slice(0, 10)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap hover:underline">
                                            {category.links_count}
                                        </td>
                                        <td
                                            className="px-4 py-4 space-x-4 text-lg text-gray-700 flex"
                                            onClick={(e) => e.stopPropagation()}
                                        >
                                            <button
                                                onClick={() => setShowPopupUpdate(true)}
                                                title="Update"
                                                className="hover:text-primary-100"
                                            >
                                                <Icon
                                                    icon="material-symbols:link-rounded"
                                                    width={20}
                                                    height={20}
                                                />
                                            </button>
                                            <Link
                                                href={`/projects/${project.id}/categories/${category.id}/link`}
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
                                                onClick={() => handleDeleteClick(category)}
                                                title="Delete"
                                                className="hover:text-primary-100"
                                            >
                                                <Icon
                                                    icon="gravity-ui:trash-bin"
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
                                        Belum ada kategori yang tersedia.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination
                    pagination={{
                        current_page: categories.current_page,
                        last_page: categories.last_page,
                        from: categories.from,
                        to: categories.to,
                        total: categories.total,
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

                <CreateCategories
                    show={showPopup}
                    onClose={() => setShowPopup(false)}
                    project={project}
                    onSuccess={() => Inertia.reload()}
                />

                <UpdateCategories
                    show={showPopupUpdate}
                    onClose={() => setShowPopupUpdate(false)}
                    onSuccess={() => Inertia.reload()}
                />
            </div>
        </DashboardLayout>
    );
}
