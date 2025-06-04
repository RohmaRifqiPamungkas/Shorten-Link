import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { Head, usePage, useForm, Link } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
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
    const { success } = usePage().props;
    const [searchTerm, setSearchTerm] = useState("");
    const [bulkMode, setBulkMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedLinkToDelete, setSelectedLinkToDelete] = useState(null);
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

    const handleDeleteClick = (link) => {
        setSelectedLinkToDelete(link);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedLinkToDelete) {
            Inertia.delete(
                `/shorten/${selectedLinkToDelete.id}`,
                {
                    onSuccess: () => {
                        setDeleteModalOpen(false);
                        setSelectedLinkToDelete(null);
                        setNotification({
                            type: "success",
                            message: "Link deleted successfully.",
                        });
                    },
                    onError: () => {
                        setNotification({
                            type: "error",
                            message: "Failed to delete link. Please try again.",
                        });
                        setDeleteModalOpen(false);
                        setSelectedLinkToDelete(null);
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
                message: "No links selected.",
            });
            return;
        }

        if (!window.confirm("Are you sure you want to delete selected links?")) return;

        Inertia.post('/shorten/bulk-delete', {
            ids: selectedIds,
            _method: 'DELETE',
        }, {
            onSuccess: () => {
                setNotification({
                    type: "success",
                    message: "Selected links deleted successfully.",
                });
                setSelectedIds([]);
                setBulkMode(false);
            },
            onError: () => {
                setNotification({
                    type: "error",
                    message: "Failed to delete selected links.",
                });
            },
            preserveScroll: true,
        });
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

    const handleShareClick = (link) => {
        const fullUrl = `${window.location.origin}/s/${link.short_code}`;
        setSelectedShareUrl(fullUrl);
        setShareModalOpen(true);
    };

    // Search & Pagination handled by backend, so just send params
    const handlePageChange = (newPage) => {
        Inertia.get(
            `/shorten`,
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
            `/shorten`,
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
            `/shorten`,
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
        <DashboardLayout>
            <Head title="Shortened Links" />

            <div className="py-5">
                <h1 className="text-2xl font-semibold text-primary-100">
                    Shortened Link
                </h1>
                <div className="flex justify-between items-center flex-wrap gap-5 my-3">
                    <p className="text-gray-700 text-lg font-medium">
                        List Shortened Link
                    </p>
                    <div className="flex items-center gap-3 transition-all duration-300 ease-in-out flex-wrap">
                        <div className="transition-all duration-300">
                            <ShortenButton onClick={() => setShowPopup(true)} />
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

                {/* Table */}
                <div className="overflow-x-auto bg-white shadow rounded-2xl">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-muted hover:bg-gray-50">
                                {bulkMode && (
                                    <th className="px-4 py-6">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.length === shortends.data.length && shortends.data.length > 0}
                                            onChange={(e) => {
                                                if (e.target.checked) {
                                                    setSelectedIds(shortends.data.map((l) => l.id));
                                                } else {
                                                    setSelectedIds([]);
                                                }
                                            }}
                                        />
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
                            {shortends.data.length > 0 ? (
                                shortends.data.map((link) => (
                                    <tr
                                        key={link.id}
                                        className="border-b border-muted hover:bg-gray-50"
                                    >
                                        {bulkMode && (
                                            <td className="px-4 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(link.id)}
                                                    onChange={() => toggleSelect(link.id)}
                                                />
                                            </td>
                                        )}
                                        <td className="px-4 py-4 whitespace-nowrap flex items-center gap-2 w-full max-w-full md:max-w-[560px] overflow-hidden">
                                            {/* Logo/Favicon */}
                                            <img
                                                src={`https://www.google.com/s2/favicons?sz=64&domain=${new URL(link.original_url).hostname}`}
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
                                                    {link.original_url.length > 50
                                                        ? `${link.original_url.slice(0, 60)}...`
                                                        : link.original_url}
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
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatus(link.expires_at) === "Expired"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-green-100 text-green-800"
                                                    }`}
                                            >
                                                {getStatus(link.expires_at)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-4 flex space-x-2 text-lg text-gray-700">
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
                                            <Link
                                                href={`/shorten/${link.id}/edit`}
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
                                                title="Delete"
                                                onClick={() => handleDeleteClick(link)}
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
                                                onClick={() => handleShareClick(link)}
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
                                        colSpan={bulkMode ? 6 : 5}
                                        className="px-4 py-6 text-center text-gray-500"
                                    >
                                        No links available yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <Pagination
                    pagination={{
                        current_page: shortends.current_page,
                        last_page: shortends.last_page,
                        from: shortends.from,
                        to: shortends.to,
                        total: shortends.total,
                    }}
                    perPage={perPage}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />

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