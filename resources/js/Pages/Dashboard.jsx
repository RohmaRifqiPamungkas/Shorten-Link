import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { Head, useForm } from "@inertiajs/react";
import SearchBar from "@/Components/Searchbar/Search";
import Pagination from "@/Components/Pagination/Pagination";
import BulkActions from "@/Components/BulkAction/BulkAction";
import ShortenButton from "@/Components/Button/ButtonShort";
import CreateProject from "@/Components/Alert/CreateProject";
import DeleteModal from "@/Components/Alert/DeleteModal";
import SharePopup from "@/Components/Alert/ShareModal";
import ToastAlert from "@/Components/Notification/ToastAlert";
import { Icon } from "@iconify/react";
import { FiPlus } from "react-icons/fi";

export default function ShortenedLinkPage({ links }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [bulkMode, setBulkMode] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);   const [showPopup, setShowPopup] = useState(false);
 
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedLinkToDelete, setSelectedLinkToDelete] = useState(null);
    const [isShareModalOpen, setShareModalOpen] = useState(false);
    const [selectedShareUrl, setSelectedShareUrl] = useState("");
    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

    const { data, setData, post, processing, errors, reset } = useForm({
        long_url: "",
        expiration_date: "",
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post("/links", {

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

    const handleCopy = (text) => {
        navigator.clipboard
            .writeText(text)
            .then(() => {
                setToastMessage("Link copied to clipboard!");
                setToastType("success");
                setTimeout(() => setToastMessage(""), 3000);
            })
            .catch(() => {
                setToastMessage("Failed to copy the link.");
                setToastType("error");
                setTimeout(() => setToastMessage(""), 3000);
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
        setSelectedShareUrl(link.short_url);
        setShareModalOpen(true);
    };

    const dummyLinks = {
        data: [
            {
                id: 1,
                original_url: "https://www.example.com/very/long/url/1",
                short_url: "https://sho.rt/abc123",
                created_at: "2024-05-01",
                expired_at: "2024-12-31",
                status: "active",
            },
            {
                id: 2,
                original_url: "https://github.com/user/project",
                short_url: "https://sho.rt/git123",
                created_at: "2024-04-20",
                expired_at: "2024-10-20",
                status: "expired",
            },
        ],
        total: 3,
        current_page: 1,
        last_page: 1,
        per_page: 10,
        from: 1,
        to: 3,
    };

    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(10);

    const filteredLinks = dummyLinks.data.filter(
        (link) =>
            link.original_url
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            link.short_url.toLowerCase().includes(searchTerm.toLowerCase())
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
            <Head title="Management Links" />

            <div className="py-5">
                <h1 className="text-2xl font-semibold text-primary-100">
                    Management Link
                </h1>
                <div className="flex justify-between items-center flex-wrap gap-5 my-3">
                    {/* Kiri */}
                    <p className="text-gray-700 text-lg font-medium">
                        List Management Link
                    </p>

                    {/* Kanan */}
                    <div className="flex items-center gap-3 transition-all duration-300 ease-in-out flex-wrap">
                        {/* Shorten button */}
                        <div className="transition-all duration-300">
                            <ShortenButton
                                onClick={() => setShowPopup(true)}
                                label="Add Project"
                                icon={<FiPlus size={18} />}
                            />
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

                {/* Toast */}
                <ToastAlert
                    message={toastMessage}
                    type={toastType}
                    onClose={() => setToastMessage("")}
                />

                {/* Table */}
                {/* <div className="overflow-x-auto rounded-b-2xl w-full">
    <div className="inline-block min-w-full rounded-2xl shadow-lg p-4 bg-blue-200">
        <table className=" text-left text-sm text-foreground bg-green-300" style={{ minWidth: "1000px" }}> */}
                <div className="overflow-x-auto bg-white shadow rounded-2xl">
                    <table className="min-w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-muted">
                                {bulkMode && (
                                    <th className="px-4 py-6">
                                        <input type="checkbox" disabled />
                                    </th>
                                )}
                                <th className="px-4 py-6 font-semibold">Project Name</th>
                                <th className="px-4 py-6 font-semibold">
                                   URL
                                </th>
                                <th className="px-4 py-6 font-semibold">
                                     Date Created
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
                                    {/* whitespace-nowrap */}
                                    <td className="px-4 py-4 ">
                                        <a
                                            href={link.projects}
                                            className="text-primary hover:underline break-all"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                        >
                                            {link.short_url}
                                        </a>                                       
                                    </td>
                                    <td className="px-4 py-4">
                                        {link.created_at}
                                    </td>
                                    <td className="px-4 py-4">
                                        {link.expired_at}
                                    </td>                                  
                                    <td className="px-4 py-4 space-x-2  text-lg text-gray-700">
                                        <button
                                            title="Copy"
                                            onClick={() =>
                                                handleCopy(link.short_url)
                                            }
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

                <CreateProject
                    show={showPopup}
                    onClose={() => setShowPopup(false)}
                    onSubmit={handleSubmit}
                    data={data}
                    setData={setData}
                    errors={errors}
                    processing={processing}
                />
            </div>
        </DashboardLayout>
    );
}
