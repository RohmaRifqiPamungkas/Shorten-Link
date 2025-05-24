import { useState } from "react";
import { Icon } from "@iconify/react";
import DeleteModal from "@/Components/Alert/DeleteModal";
import SharePopup from "@/Components/Alert/ShareModal";
import ToastAlert from "../Notification/ToastAlert";

export default function URLTable({
    links,
    bulkMode,
    selectedIds,
    toggleSelect,
}) {
    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedLinkToDelete, setSelectedLinkToDelete] = useState(null);

    const [isShareModalOpen, setShareModalOpen] = useState(false);
    const [selectedShareUrl, setSelectedShareUrl] = useState("");

    const [toastMessage, setToastMessage] = useState("");
    const [toastType, setToastType] = useState("success");

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
        console.log("Open Delete Modal for:", link);
        setSelectedLinkToDelete(link);
        setDeleteModalOpen(true);
    };

    const handleShareClick = (link) => {
        console.log("Open Share Modal for:", link.short_url);
        setSelectedShareUrl(link.short_url);
        setShareModalOpen(true);
    };

    return (
        <>
            <ToastAlert
                message={toastMessage}
                type={toastType}
                onClose={() => setToastMessage("")}
            />

            {/* Tabel */}
          <div className="w-full overflow-x-auto">
  <div className="min-w-[1200px] bg-white rounded-2xl shadow-lg p-4">
    <table className="min-w-full text-left text-sm text-foreground">
                        <thead>
                            <tr className="border-b border-muted">
                                {bulkMode && (
                                    <th className="px-4 py-6">
                                        <input type="checkbox" disabled />
                                    </th>
                                )}
                                <th className="text-left font-semibold px-4 py-6 ">
                                    URL
                                </th>
                                <th className="text-left font-semibold px-4 py-6">
                                    Date Created
                                </th>
                                <th className="text-left font-semibold px-4 py-6">
                                    Expiration Date
                                </th>
                                <th className="text-left font-semibold px-4 py-6">
                                    Status
                                </th>
                                <th className="text-left font-semibold px-4 py-6">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {links.map((link, idx) => (
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
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        <div>
                                            <a
                                                href={link.short_url}
                                                className="text-primary underline break-all"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {link.short_url}
                                            </a>
                                            <div className="text-xs text-muted-foreground break-all">
                                                {link.original_url}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {link.created_at}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">
                                        {link.expired_at}
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap">{link.status}</td>
                                    <td className="px-4 py-4 space-x-2 text-lg text-gray-700 whitespace-nowrap">
                                        <button
                                            title="Copy"
                                            className="hover:text-primary-100"
                                            onClick={() =>
                                                handleCopy(link.short_url)
                                            }
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
                                            className="hover:text-primary-100"
                                            onClick={() =>
                                                handleDeleteClick(link)
                                            }
                                        >
                                            <Icon
                                                icon="gravity-ui:trash-bin"
                                                width={20}
                                                height={20}
                                            />
                                        </button>
                                        <button
                                            title="Share"
                                            className="hover:text-primary-100"
                                            onClick={() =>
                                                handleShareClick(link)
                                            }
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
                   </div>
  

            {/* Modal Delete  */}
            {isDeleteModalOpen && (
                <DeleteModal
                    isOpen={isDeleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    onConfirm={handleConfirmDelete}
                />
            )}

            {/* Modal Share */}
            {isShareModalOpen && (
                <SharePopup
                    url={selectedShareUrl}
                    onClose={() => setShareModalOpen(false)}
                />
            )}
        </>
    );
}
