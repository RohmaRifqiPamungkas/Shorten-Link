import React, { useState, useEffect } from "react";
import DashboardLayout from "@/Components/DashboardLayout/DashboardLayout";
import { Head, usePage, Link, useForm } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import SearchBar from "@/Components/Searchbar/Search";
import Pagination from "@/Components/Pagination/Pagination";
import BulkActions from "@/Components/BulkAction/BulkAction";
import Notification from "@/Components/Notification/Notification";
import Modal from "@/Components/Modal";
import { Icon } from "@iconify/react";
import AddDomainButton from "@/Components/Button/AddDomainButton";
import CreateDomains from "@/Components/Alert/CreateDomains";
import DeleteModal from "@/Components/Alert/DeleteModal";

export default function DomainPage({ domains }) {
    const { success, error } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [bulkMode, setBulkMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [notification, setNotification] = useState(null);
    const [perPage, setPerPage] = useState(
        Number(new URLSearchParams(window.location.search).get("perPage")) || 10
    );

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // form inertia
    const { data, setData, post, processing, reset, errors } = useForm({
        domain: "",
    });

    const submitDomain = (e) => {
        e.preventDefault();
        post(route("domains.store"), {
            preserveScroll: true,
            onSuccess: () => {
                reset();
                setShowModal(false);
            },
        });
    };

    // flash message
    useEffect(() => {
        if (success) setNotification({ type: "success", message: success });
        if (error) setNotification({ type: "error", message: error });
    }, [success, error]);

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
        );
    };

    const handleBulkDelete = () => {
        if (selectedIds.length === 0) {
            setNotification({ type: "error", message: "No domains selected." });
            return;
        }
        if (!window.confirm("Are you sure you want to delete selected domains?"))
            return;

        Inertia.post(
            "/domains/bulk-delete",
            { ids: selectedIds, _method: "DELETE" },
            {
                onSuccess: () => {
                    setNotification({
                        type: "success",
                        message: "Selected domains deleted successfully.",
                    });
                    setSelectedIds([]);
                    setBulkMode(false);
                },
                onError: () => {
                    setNotification({
                        type: "error",
                        message: "Failed to delete selected domains.",
                    });
                },
                preserveScroll: true,
            }
        );
    };

    const handlePageChange = (newPage) => {
        Inertia.get(
            "/domains",
            { page: newPage, perPage, search: searchTerm },
            { preserveState: true, replace: true }
        );
    };

    const handlePerPageChange = (newPerPage) => {
        setPerPage(newPerPage);
        Inertia.get(
            "/domains",
            { page: 1, perPage: newPerPage, search: searchTerm },
            { preserveState: true, replace: true }
        );
    };

    const handleSearch = (term) => {
        setSearchTerm(term);
        Inertia.get(
            "/domains",
            { page: 1, perPage, search: term },
            { preserveState: true, replace: true }
        );
    };

    const handleDeleteClick = (domain) => {
        setSelectedDomain(domain);
        setDeleteModalOpen(true);
    };

    const confirmDelete = () => {
        if (!selectedDomain) return;

        destroy(route("domains.destroy", selectedDomain.id), {
            preserveScroll: true,
            onSuccess: () => {
                setDeleteModalOpen(false);
                setSelectedDomain(null);
                setNotification({
                    type: "success",
                    message: "Domain deleted successfully.",
                });
            },
            onError: () => {
                setNotification({
                    type: "error",
                    message: "Failed to delete domain.",
                });
            },
        });
    };

    return (
        <DashboardLayout>
            <Head title="Custom Domains" />

            <div className="py-5">
                <h1 className="text-xl md:text-2xl font-semibold text-primary-100">
                    Custom Domains
                </h1>
                <div className="flex justify-between items-center flex-wrap gap-5 my-3">
                    <p className="text-gray-700 text-lg font-medium">
                        Manage your branded domains
                    </p>
                    <div className="flex items-center gap-3 flex-wrap">
                        <AddDomainButton onClick={() => setShowModal(true)} />
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

                {/* Modal Create Domain */}
                <CreateDomains show={showModal} onClose={() => setShowModal(false)} />

                {/* Table */}
                <div className="overflow-x-auto bg-white shadow rounded-2xl">
                    <table className="min-w-full text-left border-collapse text-sm md:text-[16px]">
                        <thead>
                            <tr className="border-b border-muted hover:bg-gray-50">
                                {bulkMode && (
                                    <th className="px-4 py-6">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.length === domains.data.length && domains.data.length > 0}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedIds(domains.data.map((d) => d.id));
                                                } else {
                                                    setSelectedIds([]);
                                                }
                                            }}
                                        />
                                    </th>
                                )}
                                <th className="px-4 py-6 font-semibold">Domain</th>
                                <th className="px-4 py-6 font-semibold">Date Created</th>
                                <th className="px-4 py-6 font-semibold">Verified At</th>
                                <th className="px-4 py-6 font-semibold">Status</th>
                                <th className="px-4 py-6 font-semibold">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {domains.data.length > 0 ? (
                                domains.data.map((d) => (
                                    <tr
                                        key={d.id}
                                        className="border-b border-muted hover:bg-gray-50"
                                    >
                                        {bulkMode && (
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(d.id)}
                                                    onChange={() => toggleSelect(d.id)}
                                                />
                                            </td>
                                        )}
                                        <td className="px-4 py-4 whitespace-nowrap flex items-center gap-2 w-full max-w-full md:max-w-[560px] overflow-hidden">
                                            {/* Favicon */}
                                            <img
                                                src={`https://www.google.com/s2/favicons?sz=64&domain=${d.domain}`}
                                                alt="favicon"
                                                className="w-8 h-8 rounded-full bg-gray-100 object-contain"
                                                style={{ flexShrink: 0 }}
                                                onError={(e) => {
                                                    e.currentTarget.onerror = null;
                                                    e.currentTarget.src =
                                                        "https://cdn-icons-png.flaticon.com/512/565/565547.png";
                                                }}
                                            />
                                            <div className="min-w-0">
                                                <span className="text-sm text-foreground font-medium block overflow-hidden text-ellipsis whitespace-nowrap">
                                                    {d.domain}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {d.created_at?.slice(0, 10)}
                                        </td>
                                        <td className="px-4 py-4 whitespace-nowrap">
                                            {d.verified_at ? d.verified_at.slice(0, 10) : "-"}
                                        </td>
                                        <td className="px-4 py-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${d.status === "Active"
                                                        ? "bg-green-100 text-green-800"
                                                        : d.status === "failed"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                            >
                                                {d.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 flex space-x-2 text-lg text-gray-700">
                                            {d.status === "Pending" && (
                                                <Link
                                                    href={route("domains.verify", d.id)}
                                                    method="post"
                                                    as="button"
                                                    title="Verify"
                                                    className="hover:text-primary-100"
                                                >
                                                    <Icon icon="mdi:check-circle-outline" width={20} height={20} />
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => handleDeleteClick(d)}
                                                title="Delete"
                                                className="hover:text-primary-100"
                                            >
                                                <Icon icon="gravity-ui:trash-bin" width={20} height={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td
                                        colSpan={bulkMode ? 6 : 5}
                                        className="px-4 py-6 text-center text-gray-500"
                                    >
                                        No domains available yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination
                    pagination={{
                        current_page: domains.current_page,
                        last_page: domains.last_page,
                        from: domains.from,
                        to: domains.to,
                        total: domains.total,
                        prev_page_url: domains.prev_page_url,
                        next_page_url: domains.next_page_url,
                    }}
                    perPage={perPage}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />

                {/* Delete Confirmation Modal */}
                <DeleteModal
                    isOpen={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={confirmDelete}
                    processing={processing}
                />
            </div>
        </DashboardLayout>
    );
}
