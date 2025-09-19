import React, { useState, useEffect } from "react";
import DashboardLayout from "@/Components/DashboardLayout/DashboardLayout";
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
    const { categories = { data: [], links: [] }, success } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [bulkMode, setBulkMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [showPopupUpdate, setShowPopupUpdate] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedCategoryToDelete, setSelectedCategoryToDelete] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);
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

    const handleDeleteClick = (category) => {
        setSelectedCategoryToDelete(category);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedCategoryToDelete) {
            Inertia.delete(
                `/projects/${project.id}/categories/${selectedCategoryToDelete.id}`,
                {
                    onSuccess: () => {
                        setNotification({
                            type: "success",
                            message: "Deleted successfully.",
                        });
                        setDeleteModalOpen(false);
                        setSelectedCategoryToDelete(null);
                    },
                    onError: () => {
                        setNotification({
                            type: "error",
                            message: "Failed to delete category. Please try again.",
                        });
                        setDeleteModalOpen(false);
                        setSelectedCategoryToDelete(null);
                    },
                    preserveScroll: true,
                }
            );
        } else {
            setDeleteModalOpen(false);
        }
    };

    // Pagination & Search handled by backend
    const handlePageChange = (newPage) => {
        Inertia.get(
            window.location.pathname,
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
            window.location.pathname,
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
            window.location.pathname,
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
            <Head title="Add categories" />

            <Breadcrumb />

            <div className="py-5">
                <h1 className="text-xl md:text-2xl font-semibold text-primary-100">
                    Categories
                </h1>

                <div className="flex justify-between items-center flex-wrap gap-5 my-3">
                    <span className="text-foreground text-sm  md:text-lg font-medium">
                        Categories for :{" "}
                        <a
                            className="underline"
                            href={`/m/${project.project_slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {`${window.location.origin}/m/${project.project_slug}`}
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
                            <SearchBar onSearch={handleSearch} />
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
                    <table className="min-w-full text-left border-collapse text-sm  md:text-[16px]">
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
                            {categories.data.length > 0 ? (
                                categories.data.map((category) => (
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
                                            <a href={`/projects/${project.id}/categories/${category.id}/links`}>
                                                {category.name}
                                            </a>
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
                                            <Link
                                                href={`/projects/${project.id}/categories/${category.id}/links`}
                                                title="link"
                                                className="hover:text-primary-100"
                                            >
                                                <Icon
                                                    icon="material-symbols:link-rounded"
                                                    width={20}
                                                    height={20}
                                                />
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    setSelectedCategory(category);
                                                    setShowPopupUpdate(true);
                                                }}
                                                title="Edit"
                                                className="hover:text-primary-100"
                                            >
                                                <Icon
                                                    icon="iconamoon:edit-light"
                                                    width={20}
                                                    height={20}
                                                />
                                            </button>
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
                                        colSpan={bulkMode ? 5 : 4}
                                        className="px-4 py-6 text-center text-gray-500"
                                    >
                                        No categories available yet.
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
                        prev_page_url: categories.prev_page_url,
                        next_page_url: categories.next_page_url,
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
                    project={project}
                    category={selectedCategory}
                    onSuccess={() => Inertia.reload()}
                />
            </div>
        </DashboardLayout>
    );
}