
import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { Head, usePage, Link } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import SearchBar from "@/Components/Searchbar/Search";
import Pagination from "@/Components/Pagination/Pagination";
import BulkActions from "@/Components/BulkAction/BulkAction";
import ShortenButton from "@/Components/Button/ButtonShort";
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import DeleteModal from "@/Components/Alert/DeleteModal";
import Notification from "@/Components/Notification/Notification";
import { Icon } from "@iconify/react";
import { FiPlus } from "react-icons/fi";

export default function Links({ auth, project = {}, category = {}, links = { data: [] }, categories = [] }) {
    // const { links = { data: [] } } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [bulkMode, setBulkMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedLinkToDelete, setSelectedLinkToDelete] = useState(null);
    const [notification, setNotification] = useState(null);
    const [perPage, setPerPage] = useState(10);

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const handleDeleteClick = (link) => {
        setSelectedLinkToDelete(link);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedLinkToDelete) {
            Inertia.post(
                `/links/${selectedLinkToDelete.id}`,
                { _method: "DELETE" },
                {
                    onSuccess: () =>
                        setNotification({
                            type: "success",
                            message: "Link deleted successfully.",
                        }),
                    onError: () =>
                        setNotification({
                            type: "error",
                            message: "Failed to delete link. Please try again.",
                        }),
                }
            );
        }
        setDeleteModalOpen(false);
    };

    const filteredLinks = links.data.filter((link) =>
        link.title.toLowerCase().includes(searchTerm.toLowerCase())
    );

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
            <Head title="Link in Categories " />

            <Breadcrumb />

            <div className="py-5">
                <h1 className="text-2xl font-semibold text-primary-100">
                    Link in Categories
                </h1>

                <div className="flex justify-between items-center flex-wrap gap-5 my-3">
                    <span className="text-foreground text-lg font-medium">
                        List link in :{" "}
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
                                onClick={() =>
                                    Inertia.get(
                                        `/projects/${project.id}/links/create?category_id=${data.category_id}`
                                    )
                                }
                                label="Add URL"
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
                        {...notification}
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
                                    URL & Link Name
                                </th>

                                <th className="px-4 py-6 font-semibold">
                                    Date Created
                                </th>
                                <th className="px-4 py-6 font-semibold">
                                    Categories
                                </th>
                                <th className="px-4 py-6 font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredLinks.length > 0 ? (
                                filteredLinks.map((link) => (
                                    <tr
                                        key={link.id}
                                        className="border-b border-muted hover:bg-gray-50"
                                    >
                                        {bulkMode && (
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(
                                                        link.id
                                                    )}
                                                    onChange={() =>
                                                        toggleSelect(link.id)
                                                    }
                                                />
                                            </td>
                                        )}
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            <a
                                                href={link.original_url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-foreground hover:underline"
                                            >
                                                {link.original_url}
                                            </a>
                                            <div className=" text-foreground">
                                                {link.title}
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {link.category?.name ? (
                                                <span className="inline-block bg-secondary text-white text-sm font-medium px-4 py-1 rounded-lg">
                                                    {link.category.name}
                                                </span>
                                            ) : (
                                                "-"
                                            )}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {new Date(
                                                link.created_at
                                            ).toLocaleDateString("id-ID", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric",
                                            })}
                                        </td>
                                        <td className="px-4 py-4 space-x-2 flex">
                                            <Link
                                                href={`/projects/${project.id}/categories/${link.category_id}/link/${link.link_id}/edit`}
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
                                                    handleDeleteClick(link)
                                                }
                                                className="hover:text-primary-100"
                                                title="Delete"
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
                                        Belum ada link yang tersedia.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <Pagination
                    pagination={
                        links.meta || {
                            current_page: 1,
                            last_page: 1,
                            from: 1,
                            to: 1,
                            total: 1,
                        }
                    }
                    perPage={perPage}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />

                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                />
            </div>
        </DashboardLayout>
    );
}
