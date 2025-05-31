import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { Head, useForm } from "@inertiajs/react";
import SearchBar from "@/Components/Searchbar/Search";
import Pagination from "@/Components/Pagination/Pagination";
import BulkActions from "@/Components/BulkAction/BulkAction";
import ShortenButton from "@/Components/Button/ButtonShort";
import CreateShortlink from "@/Components/Alert/CreateShortlink";
import DeleteModal from "@/Components/Alert/DeleteModal";
import SharePopup from "@/Components/Alert/ShareModal";
import Notification from "@/Components/Notification/Notification";
import { Icon } from "@iconify/react";
export default function ShortenedLinkPage({ shortends }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [bulkMode, setBulkMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedLinkToDelete, setSelectedLinkToDelete] = useState(null);
    const [isShareModalOpen, setShareModalOpen] = useState(false);
    const [selectedShareUrl, setSelectedShareUrl] = useState("");
    const [notification, setNotification] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        original_url: "",
        custom_alias: "",
        expires_at: "",
    });

    const getStatus = (expires_at) => {
        if (!expires_at) return "Active";

        const now = new Date();
        const expiresDate = new Date(expires_at);
        return expiresDate < now ? "Expired" : "Active";
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/shorten.store", {
            onSuccess: () => {
                setShowPopup(false);
                reset();
            },
        });
    };

    const toggleSelect = (id) => {
        setSelectedIds((prev) =>
            prev.includes(id)
                ? prev.filter((item) => item !== id)
                : [...prev, id]
        );
    };

    const handleDeleteSelected = () => {
        if (selectedIds.length === 0) return;
        if (confirm(`Delete ${selectedIds.length} selected link(s)?`)) {
            Inertia.post(
                "/links/bulk-delete",
                { ids: selectedIds },
                {
                    onSuccess: () => {
                        setSelectedIds([]);
                        setBulkMode(false);
                    },
                }
            );
        }
    };

    const handleCopy = (link) => {
        const fullUrl = `${window.location.origin}/s/${link.short_code}`;
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

    const handleConfirmDelete = () => {
        console.log("Deleting link:", selectedLinkToDelete);
        setDeleteModalOpen(false);
    };

    const handleDeleteClick = (link) => {
        setSelectedLinkToDelete(link);
        setDeleteModalOpen(true);
    };

    const handleShareClick = (link) => {
        const fullUrl = `${window.location.origin}/s/${link.short_code}`;
        setSelectedShareUrl(fullUrl);
        setShareModalOpen(true);
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const filteredLinks = shortends.data.filter(
        (link) =>
            link.original_url
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            (link.short_code &&
                link.short_code
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase())) ||
            (link.custom_alias &&
                link.custom_alias
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()))
    );

    const paginatedLinks = filteredLinks.slice(
        (currentPage - 1) * perPage,
        currentPage * perPage
    );

    const pagination = {
        current_page: currentPage,
        last_page: Math.ceil(filteredLinks.length / perPage),
        from: filteredLinks.length === 0 ? 0 : (currentPage - 1) * perPage + 1,
        to: Math.min(currentPage * perPage, filteredLinks.length),
        total: filteredLinks.length,
    };

    return (
        <DashboardLayout>
            <Head title="Shortened Links" />

            <div className="py-5">
                <h1 className="text-2xl font-semibold text-primary-100">
                    Shortened Link
                </h1>
                <div className="flex justify-between items-center flex-wrap gap-5 my-3">
                    {/* Kiri */}
                    <p className="text-gray-700 text-lg font-medium">
                        List Shortened Link
                    </p>

                    {/* Kanan */}
                    <div className="flex items-center gap-3 transition-all duration-300 ease-in-out flex-wrap">
                        {/* Shorten button */}
                        <div className="transition-all duration-300">
                            <ShortenButton onClick={() => setShowPopup(true)} />
                        </div>

                        {/* Search bar */}
                        <div className="transition-all duration-300">
                            <SearchBar onSearch={setSearchTerm} />
                        </div>

                        {/* Bulk action */}
                        <div className="transition-all duration-300">
                            <BulkActions
                                isActive={bulkMode}
                                toggleBulkMode={() => {
                                    setBulkMode(!bulkMode);
                                    setSelectedIds([]);
                                }}
                                onDelete={handleDeleteSelected}
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

                {/* Table */}
                <div className="overflow-x-auto bg-white shadow rounded-2xl">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-muted">
                                {bulkMode && (
                                    <th className="px-4 py-6">
                                        <input type="checkbox" disabled />
                                    </th>
                                )}
                                <th className="px-4 py-6 font-semibold">URL</th>
                                <th className="px-4 py-6 font-semibold">
                                    Date Created
                                </th>
                                <th className="px-4 py-6 font-semibold">
                                    Expiration Date
                                </th>
                                <th className="px-4 py-6 font-semibold">
                                    Status
                                </th>
                                <th className="px-4 py-6 font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedLinks.map((link, idx) => (
                                <tr key={idx} className="border-b border-muted">
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
                                    <td className="px-4 py-4 whitespace-nowrap flex items-center gap-2 w-full max-w-full md:max-w-[560px] overflow-hidden">
                                        {/* Logo/Favicon */}
                                        <img
                                            src={`https://www.google.com/s2/favicons?sz=64&domain=${
                                                new URL(link.original_url)
                                                    .hostname
                                            }`}
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
                                            {/* Short link */}
                                            <a
                                                href={`http://localhost:8000/s/${link.short_code}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-sm text-foreground hover:underline block overflow-hidden text-ellipsis whitespace-nowrap"
                                            >
                                                {`http://localhost:8000/s/${link.short_code}`}
                                            </a>
                                            {/* Original URL */}
                                            <div className="text-sm text-foreground break-all hover:underline">
                                                {link.original_url}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {link.created_at?.slice(0, 10)}
                                    </td>
                                    <td className="px-4 py-4">
                                        {link.expires_at?.slice(0, 10)}
                                    </td>
                                    <td className="px-4 py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                getStatus(link.expires_at) ===
                                                "Expired"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-green-100 text-green-800"
                                            }`}
                                        >
                                            {getStatus(link.expires_at)}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4 space-x-2 text-lg text-gray-700">
                                        <button
                                            title="Copy"
                                            onClick={() => handleCopy(link)}
                                            className="hover:text-primary-100"
                                        >
                                            <Icon
                                                icon="akar-icons:copy"
                                                width={20}
                                                height={20}
                                            />
                                        </button>
                                        <button
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
                                            title="Delete"
                                            onClick={() =>
                                                handleDeleteClick(link)
                                            }
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
                                                handleShareClick(link)
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
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="my-4">
                    <Pagination
                        pagination={pagination}
                        perPage={perPage}
                        onPageChange={(page) => setCurrentPage(page)}
                        onPerPageChange={(val) => {
                            setPerPage(val);
                            setCurrentPage(1);
                        }}
                    />
                </div>

                {/* Modals */}
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

                <CreateShortlink
                    show={showPopup}
                    onClose={() => setShowPopup(false)}
                    onSubmit={handleSubmit}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                    post={post}
                    reset={reset}
                />
            </div>
        </DashboardLayout>
    );
}
