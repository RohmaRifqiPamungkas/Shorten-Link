// import React, { useState } from "react";
// import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
// import { Head, useForm } from "@inertiajs/react";
// import SearchBar from "@/Components/Searchbar/Search";
// import Pagination from "@/Components/Pagination/Pagination";
// import BulkActions from "@/Components/BulkAction/BulkAction";
// import ShortenButton from "@/Components/Button/ButtonShort";
// import CreateProject from "@/Components/Alert/CreateProject";
// import DeleteModal from "@/Components/Alert/DeleteModal";
// import SharePopup from "@/Components/Alert/ShareModal";
// import ToastAlert from "@/Components/Notification/ToastAlert";
// import { Icon } from "@iconify/react";
// import { FiPlus } from "react-icons/fi";

// export default function ShortenedLinkPage({ links }) {
//     const [searchTerm, setSearchTerm] = useState("");
//     const [bulkMode, setBulkMode] = useState(false);
//     const [selectedIds, setSelectedIds] = useState([]);   const [showPopup, setShowPopup] = useState(false);

//     const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [selectedLinkToDelete, setSelectedLinkToDelete] = useState(null);
//     const [isShareModalOpen, setShareModalOpen] = useState(false);
//     const [selectedShareUrl, setSelectedShareUrl] = useState("");
//     const [toastMessage, setToastMessage] = useState("");
//     const [toastType, setToastType] = useState("success");

//     const { data, setData, post, processing, errors, reset } = useForm({
//         long_url: "",
//         expiration_date: "",
//     });

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         post("/links", {

//             onSuccess: () => {
//                 setShowPopup(false);
//                 reset();
//             },
//         });
//     };

//     const toggleSelect = (id) => {
//         setSelectedIds((prev) =>
//             prev.includes(id)
//                 ? prev.filter((item) => item !== id)
//                 : [...prev, id]
//         );
//     };

//     const handleDeleteSelected = () => {
//         if (selectedIds.length === 0) return;
//         if (confirm(`Delete ${selectedIds.length} selected link(s)?`)) {
//             Inertia.post(
//                 "/links/bulk-delete",
//                 { ids: selectedIds },
//                 {
//                     onSuccess: () => {
//                         setSelectedIds([]);
//                         setBulkMode(false);
//                     },
//                 }
//             );
//         }
//     };

//     const handleCopy = (text) => {
//         navigator.clipboard
//             .writeText(text)
//             .then(() => {
//                 setToastMessage("Link copied to clipboard!");
//                 setToastType("success");
//                 setTimeout(() => setToastMessage(""), 3000);
//             })
//             .catch(() => {
//                 setToastMessage("Failed to copy the link.");
//                 setToastType("error");
//                 setTimeout(() => setToastMessage(""), 3000);
//             });
//     };

//     const handleConfirmDelete = () => {
//         console.log("Deleting link:", selectedLinkToDelete);
//         setDeleteModalOpen(false);
//     };

//     const handleDeleteClick = (link) => {
//         setSelectedLinkToDelete(link);
//         setDeleteModalOpen(true);
//     };

//     const handleShareClick = (link) => {
//         setSelectedShareUrl(link.short_url);
//         setShareModalOpen(true);
//     };

//     const dummyLinks = {
//         data: [
//             {
//                 id: 1,
//                 original_url: "https://www.example.com/very/long/url/1",
//                 short_url: "https://sho.rt/abc123",
//                 created_at: "2024-05-01",
//                 expired_at: "2024-12-31",
//                 status: "active",
//             },
//             {
//                 id: 2,
//                 original_url: "https://github.com/user/project",
//                 short_url: "https://sho.rt/git123",
//                 created_at: "2024-04-20",
//                 expired_at: "2024-10-20",
//                 status: "expired",
//             },
//         ],
//         total: 3,
//         current_page: 1,
//         last_page: 1,
//         per_page: 10,
//         from: 1,
//         to: 3,
//     };

//     const [currentPage, setCurrentPage] = useState(1);
//     const [perPage, setPerPage] = useState(10);

//     const filteredLinks = dummyLinks.data.filter(
//         (link) =>
//             link.original_url
//                 .toLowerCase()
//                 .includes(searchTerm.toLowerCase()) ||
//             link.short_url.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const paginatedLinks = filteredLinks.slice(
//         (currentPage - 1) * perPage,
//         currentPage * perPage
//     );

//     const pagination = {
//         current_page: currentPage,
//         last_page: Math.ceil(filteredLinks.length / perPage),
//         from: filteredLinks.length === 0 ? 0 : (currentPage - 1) * perPage + 1,
//         to: Math.min(currentPage * perPage, filteredLinks.length),
//         total: filteredLinks.length,
//     };

//     return (
//         <DashboardLayout>
//             <Head title="Management Links" />

//             <div className="py-5">
//                 <h1 className="text-2xl font-semibold text-primary-100">
//                     Management Link
//                 </h1>
//                 <div className="flex justify-between items-center flex-wrap gap-5 my-3">
//                     {/* Kiri */}
//                     <p className="text-gray-700 text-lg font-medium">
//                         List Management Link
//                     </p>

//                     {/* Kanan */}
//                     <div className="flex items-center gap-3 transition-all duration-300 ease-in-out flex-wrap">
//                         {/* Shorten button */}
//                         <div className="transition-all duration-300">
//                             <ShortenButton
//                                 onClick={() => setShowPopup(true)}
//                                 label="Add Project"
//                                 icon={<FiPlus size={18} />}
//                             />
//                         </div>

//                         {/* Search bar */}
//                         <div className="transition-all duration-300">
//                             <SearchBar onSearch={setSearchTerm} />
//                         </div>

//                         {/* Bulk action */}
//                         <div className="transition-all duration-300">
//                             <BulkActions
//                                 isActive={bulkMode}
//                                 toggleBulkMode={() => {
//                                     setBulkMode(!bulkMode);
//                                     setSelectedIds([]);
//                                 }}
//                                 onDelete={handleDeleteSelected}
//                             />
//                         </div>
//                     </div>
//                 </div>

//                 {/* Toast */}
//                 <ToastAlert
//                     message={toastMessage}
//                     type={toastType}
//                     onClose={() => setToastMessage("")}
//                 />

//                 {/* Table */}
//                 {/* <div className="overflow-x-auto rounded-b-2xl w-full">
//     <div className="inline-block min-w-full rounded-2xl shadow-lg p-4 bg-blue-200">
//         <table className=" text-left text-sm text-foreground bg-green-300" style={{ minWidth: "1000px" }}> */}
//                 <div className="overflow-x-auto bg-white shadow rounded-2xl">
//                     <table className="min-w-full text-left border-collapse">
//                         <thead>
//                             <tr className="border-b border-muted">
//                                 {bulkMode && (
//                                     <th className="px-4 py-6">
//                                         <input type="checkbox" disabled />
//                                     </th>
//                                 )}
//                                 <th className="px-4 py-6 font-semibold">Project Name</th>
//                                 <th className="px-4 py-6 font-semibold">
//                                    URL
//                                 </th>
//                                 <th className="px-4 py-6 font-semibold">
//                                      Date Created
//                                 </th>
//                                 <th className="px-4 py-6 font-semibold">
//                                     Action
//                                 </th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {paginatedLinks.map((link, idx) => (
//                                 <tr key={idx} className="border-b border-muted">
//                                     {bulkMode && (
//                                         <td className="px-4 py-4">
//                                             <input
//                                                 type="checkbox"
//                                                 checked={selectedIds.includes(
//                                                     link.id
//                                                 )}
//                                                 onChange={() =>
//                                                     toggleSelect(link.id)
//                                                 }
//                                             />
//                                         </td>
//                                     )}
//                                     {/* whitespace-nowrap */}
//                                     <td className="px-4 py-4 ">
//                                         <a
//                                             href={link.projects}
//                                             className="text-primary hover:underline break-all"
//                                             target="_blank"
//                                             rel="noopener noreferrer"
//                                         >
//                                             {link.short_url}
//                                         </a>
//                                     </td>
//                                     <td className="px-4 py-4">
//                                         {link.created_at}
//                                     </td>
//                                     <td className="px-4 py-4">
//                                         {link.expired_at}
//                                     </td>
//                                     <td className="px-4 py-4 space-x-2  text-lg text-gray-700">
//                                         <button
//                                             title="Copy"
//                                             onClick={() =>
//                                                 handleCopy(link.short_url)
//                                             }
//                                             className="hover:text-primary-100"
//                                         >
//                                             <Icon
//                                                 icon="akar-icons:copy"
//                                                 width={20}
//                                                 height={20}
//                                             />
//                                         </button>
//                                         <button
//                                             title="Edit"
//                                             className="hover:text-primary-100"
//                                         >
//                                             <Icon
//                                                 icon="iconamoon:edit-light"
//                                                 width={20}
//                                                 height={20}
//                                             />
//                                         </button>
//                                         <button
//                                             title="Delete"
//                                             onClick={() =>
//                                                 handleDeleteClick(link)
//                                             }
//                                             className="hover:text-primary-100"
//                                         >
//                                             <Icon
//                                                 icon="gravity-ui:trash-bin"
//                                                 width={20}
//                                                 height={20}
//                                             />
//                                         </button>
//                                         <button
//                                             title="Share"
//                                             onClick={() =>
//                                                 handleShareClick(link)
//                                             }
//                                             className="hover:text-primary-100"
//                                         >
//                                             <Icon
//                                                 icon="tabler:share"
//                                                 width={20}
//                                                 height={20}
//                                             />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Pagination */}
//                 <div className="my-4">
//                     <Pagination
//                         pagination={pagination}
//                         perPage={perPage}
//                         onPageChange={(page) => setCurrentPage(page)}
//                         onPerPageChange={(val) => {
//                             setPerPage(val);
//                             setCurrentPage(1);
//                         }}
//                     />
//                 </div>

//                 {/* Modals */}
//                 {isDeleteModalOpen && (
//                     <DeleteModal
//                         isOpen={isDeleteModalOpen}
//                         onClose={() => setDeleteModalOpen(false)}
//                         onConfirm={handleConfirmDelete}
//                     />
//                 )}

//                 {isShareModalOpen && (
//                     <SharePopup
//                         url={selectedShareUrl}
//                         onClose={() => setShareModalOpen(false)}
//                     />
//                 )}

//                 <CreateProject
//                     show={showPopup}
//                     onClose={() => setShowPopup(false)}
//                     onSubmit={handleSubmit}
//                     data={data}
//                     setData={setData}
//                     errors={errors}
//                     processing={processing}
//                 />
//             </div>
//         </DashboardLayout>
//     );
// }


import React, { useState } from "react";
import { Icon } from "@iconify/react";
import DashboardLayout from "@/Components/DashboardLayout/DashboardLayout";
import PrimaryButton from "@/Components/Button/PrimaryButton";
import Breadcrumb from "@/Components/Breadcrumb/Breadcrumb";
import { Head, router, useForm } from "@inertiajs/react";
import DeleteModal from "@/Components/Alert/DeleteModal";
import SharePopup from "@/Components/Alert/ShareModal";
import Notification from "@/Components/Notification/Notification";

const CreateLink = ({ project, selectedCategoryId }) => {
    const { data, setData, post, processing, errors } = useForm({
        category_id: selectedCategoryId ?? "",
        links: [{ title: "", url: "" }],
    });

    const handleLinkChange = (index, field, value) => {
        const updatedLinks = [...data.links];
        updatedLinks[index][field] = value;
        setData("links", updatedLinks);
    };

    const addLinkField = () => {
        setData("links", [...data.links, { title: "", url: "" }]);
    };

    const removeLinkField = (index) => {
        const updatedLinks = data.links.filter((_, i) => i !== index);
        setData("links", updatedLinks);
    };

    const submit = (e) => {
        e.preventDefault();
        if (!project?.id) return;

        post(`/dashboard/projects/${project.id}/links`);
    };

    const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
    const [selectedProjectToDelete, setSelectedProjectToDelete] =
        useState(null);
    const [isShareModalOpen, setShareModalOpen] = useState(false);
    const [selectedShareUrl, setSelectedShareUrl] = useState("");
    const [notification, setNotification] = useState(null);

    const projectShareUrl = project?.project_slug
        ? `${window.location.origin}/m/${project.project_slug}`
        : "";

    const handleCopy = () => {
        if (!projectShareUrl) return;

        navigator.clipboard
            .writeText(projectShareUrl)
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

    const handleShareClick = () => {
        if (!projectShareUrl) return;

        setSelectedShareUrl(projectShareUrl);
        setShareModalOpen(true);
    };

    const handleDeleteClick = () => {
        if (!project) return;

        setSelectedProjectToDelete(project);
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (selectedProjectToDelete) {
            router.delete(
                `/dashboard/projects/${selectedProjectToDelete.id}`,
                {
                    preserveScroll: true,
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

    return (
        <DashboardLayout>
            <Head title="Add Link" />

            <div className="mx-auto w-full max-w-screen-2xl px-4 py-5 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
                <div className="space-y-6">
                    <div className="space-y-3">
                        <Breadcrumb />
                        <div className="space-y-1">
                            <h2 className="text-2xl font-semibold tracking-tight text-blue-900 sm:text-3xl">
                                Add URL
                            </h2>
                            <p className="max-w-3xl text-sm leading-6 text-gray-600 sm:text-base">
                                Tambahkan beberapa link sekaligus dengan layout
                                yang lebih rapi, responsif, dan tetap selaras
                                dengan identitas desain asli.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 rounded-2xl border border-gray-100 bg-white px-4 py-4 shadow-sm sm:px-6 sm:py-5 lg:flex-row lg:items-center lg:justify-between">
                        <div className="min-w-0 space-y-1">
                            <p className="text-sm font-medium text-gray-500">
                                Your Link Is :
                            </p>
                            {projectShareUrl ? (
                                <a
                                    href={projectShareUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block break-all text-sm font-semibold text-foreground underline decoration-primary-100/40 underline-offset-4 sm:text-base"
                                >
                                    {projectShareUrl}
                                </a>
                            ) : (
                                <span className="block text-sm text-gray-400">
                                    Project URL belum tersedia.
                                </span>
                            )}
                        </div>

                        <div className="flex flex-wrap gap-2 sm:gap-3 lg:justify-end">
                            <button
                                type="button"
                                title="Copy"
                                onClick={handleCopy}
                                disabled={!projectShareUrl}
                                className="group inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-white p-3 shadow transition hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Icon
                                    icon="akar-icons:copy"
                                    width={20}
                                    height={20}
                                    className="text-foreground transition group-hover:text-white"
                                />
                            </button>
                            <button
                                type="button"
                                title="Delete"
                                onClick={handleDeleteClick}
                                disabled={!project}
                                className="group inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-white p-3 shadow transition hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Icon
                                    icon="gravity-ui:trash-bin"
                                    width={20}
                                    height={20}
                                    className="text-foreground transition group-hover:text-white"
                                />
                            </button>
                            <button
                                type="button"
                                title="Share"
                                onClick={handleShareClick}
                                disabled={!projectShareUrl}
                                className="group inline-flex min-h-11 min-w-11 items-center justify-center rounded-xl bg-white p-3 shadow transition hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <Icon
                                    icon="tabler:share"
                                    width={20}
                                    height={20}
                                    className="text-foreground transition group-hover:text-white"
                                />
                            </button>
                        </div>
                    </div>

                    {notification && (
                        <Notification
                            type={notification.type}
                            message={notification.message}
                            onClose={() => setNotification(null)}
                        />
                    )}

                    <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-md sm:p-6 lg:p-8">
                        <form onSubmit={submit} className="space-y-5">
                            <input
                                type="hidden"
                                value={data.category_id}
                                name="category_id"
                            />

                            {data.links.map((link, index) => (
                                <div
                                    key={index}
                                    className="rounded-xl border border-brfourth bg-gray-50 p-4 sm:p-5"
                                >
                                    <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_auto] md:items-end">
                                        <div className="min-w-0">
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                Title URL
                                            </label>
                                            <input
                                                type="text"
                                                placeholder="Example"
                                                value={link.title}
                                                onChange={(e) =>
                                                    handleLinkChange(
                                                        index,
                                                        "title",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border border-brfourth bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-100 focus:ring-2 focus:ring-primary-100/20 sm:text-base"
                                            />
                                        </div>

                                        <div className="min-w-0">
                                            <label className="mb-1 block text-sm font-medium text-gray-700">
                                                URL
                                            </label>
                                            <input
                                                type="url"
                                                placeholder="Example"
                                                value={link.url}
                                                onChange={(e) =>
                                                    handleLinkChange(
                                                        index,
                                                        "url",
                                                        e.target.value
                                                    )
                                                }
                                                className="w-full rounded-lg border border-brfourth bg-white px-3 py-2.5 text-sm outline-none transition focus:border-primary-100 focus:ring-2 focus:ring-primary-100/20 sm:text-base"
                                            />
                                        </div>

                                        <div className="flex flex-wrap items-center gap-2 md:justify-end">
                                            {data.links.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeLinkField(index)
                                                    }
                                                    className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-primary-100 p-3 text-white transition hover:bg-secondary"
                                                >
                                                    <Icon
                                                        icon="gravity-ui:trash-bin"
                                                        width={18}
                                                        height={18}
                                                    />
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={addLinkField}
                                                className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg bg-secondary p-3 text-white transition hover:bg-primary-100"
                                            >
                                                <Icon
                                                    icon="mdi:plus"
                                                    width={18}
                                                    height={18}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {errors.category_id && (
                                <p className="text-sm text-red-500">
                                    {errors.category_id}
                                </p>
                            )}

                            {errors.links && (
                                <p className="text-sm text-red-500">
                                    {errors.links}
                                </p>
                            )}

                            <div className="flex justify-end pt-2">
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing}
                                    className="inline-flex min-h-11 w-full items-center justify-center rounded-lg bg-primary-100 px-6 py-3 text-sm font-semibold text-white transition hover:bg-secondary disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                                >
                                    {processing ? "Submitting..." : "Submit"}
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>

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
                </div>
            </div>
        </DashboardLayout>
    );
};

export default CreateLink;
