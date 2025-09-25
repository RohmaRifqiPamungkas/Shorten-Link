import React, { useState } from "react";
import axios from "axios";
import PrimaryButton from "@/Components/PrimaryButton";
import AISuggestButton from "@/Components/AISuggestButton";
import Notification from "../Notification/Notification";
import { useForm } from "@inertiajs/react";

export default function CreateShortlink({ show, onClose, domains = [] }) {
    const [notification, setNotification] = useState(null);
    const [loadingAI, setLoadingAI] = useState(false);
    const [usePassword, setUsePassword] = useState(false);

    const {
        data,
        setData,
        post,
        processing,
        errors,
        reset,
        clearErrors
    } = useForm({
        domain_id: "",
        original_url: "",
        custom_alias: "",
        expires_at: "",
        password: "",
    });

    // Tidak render jika tidak show
    if (!show) return null;

    const handleClose = () => {
        reset();
        clearErrors();
        setNotification(null);
        setUsePassword(false);
        onClose();
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setNotification(null);

        if (!usePassword) {
            setData("password", "");
        }

        post(route("shorten.store"), {
            onSuccess: () => {
                setNotification({
                    type: "success",
                    message: "Shortened successfully.",
                });
                reset();
                clearErrors();
                setUsePassword(false);
                onClose();
            },
            onError: () => {
                setNotification({
                    type: "error",
                    message: "An error occurred, please check your input.",
                });
            },
        });
    };

    const handleAISuggest = async () => {
        if (!data.original_url) {
            setNotification({
                type: "error",
                message: "Isi Long URL dulu!",
            });
            return;
        }

        try {
            setLoadingAI(true);

            const res = await axios.post(
                "/ai/slug",
                { url: data.original_url },
                {
                    headers: {
                        "X-CSRF-TOKEN": document
                            .querySelector('meta[name="csrf-token"]')
                            .getAttribute("content"),
                    },
                }
            );

            if (res.data?.slug) {
                setData("custom_alias", res.data.slug);
                setNotification({
                    type: "success",
                    message: "AI successfully generated slug.",
                });
            } else {
                setNotification({
                    type: "error",
                    message: "AI does not return slugs.",
                });
            }
        } catch (err) {
            console.error(err);
            setNotification({
                type: "error",
                message: "Failed to generate slug from AI.",
            });
        } finally {
            setLoadingAI(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-5">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm md:max-w-2xl p-5 md:p-10 relative">
                <div className="flex justify-between">
                    <div className="flex flex-row">
                        <img
                            src="/images/Hyperlink.png"
                            style={{ width: "24px", height: "24px" }}
                            alt="hyperlink"
                        />
                        <h2 className="text-sm md:text-xl ms-4 font-semibold text-primary-100 mb-4">
                            Shortened Link
                        </h2>
                    </div>
                    <button
                        onClick={handleClose}
                        className="text-foreground font-black hover:text-primary-100 w-2 h-2 md:w-4 md:h-4"
                    >
                        ✕
                    </button>
                </div>

                {/* Notifikasi */}
                {notification && (
                    <Notification
                        type={notification.type}
                        message={notification.message}
                        onClose={() => setNotification(null)}
                    />
                )}

                <div className="mt-4">
                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* Pilih Domain */}
                        <div>
                            <label className="text-sm text-foreground">Domain</label>
                            <select
                                name="domain_id"
                                value={data.domain_id}
                                onChange={(e) => setData("domain_id", e.target.value)}
                                className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1 bg-white text-gray-700"
                                required
                            >
                                <option value="">-- Select Domain --</option>
                                {(domains || []).length > 0 ? (
                                    domains.map((d) => (
                                        <option key={d.id} value={d.id}>
                                            {d.domain} {d.status ? `(${d.status})` : ""}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No domain available</option>
                                )}
                            </select>

                            {errors.domain_id && (
                                <div className="text-red-500 text-sm mt-1">{errors.domain_id}</div>
                            )}
                        </div>

                        {/* Long URL */}
                        <div>
                            <label className="text-sm text-foreground">Long URL</label>
                            <input
                                type="url"
                                className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                                placeholder="https://example.com/"
                                name="original_url"
                                value={data.original_url}
                                onChange={(e) => setData("original_url", e.target.value)}
                                required
                            />
                            {errors.original_url && (
                                <div className="text-red-500 text-sm mt-1">{errors.original_url}</div>
                            )}
                        </div>

                        {/* Short URL + Alias + AI Suggest */}
                        <div className="flex flex-col gap-4 md:flex-row md:gap-0">
                            <div className="w-full md:basis-3/4 md:me-4">
                                <label className="text-sm text-foreground">Short URL</label>
                                <input
                                    type="text"
                                    className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1 bg-white text-gray-700"
                                    value={
                                        `${data.domain_id
                                            ? domains.find((d) => d.id == data.domain_id)?.domain
                                            : window.location.host
                                        }/s/${data.custom_alias || ""}`
                                    }
                                    readOnly
                                />
                            </div>

                            <div className="w-full md:basis-3/4">
                                <label className="text-sm text-foreground">Alias</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1 bg-white text-gray-700"
                                        placeholder="custom-alias"
                                        name="custom_alias"
                                        value={data.custom_alias}
                                        onChange={(e) => setData("custom_alias", e.target.value)}
                                    />
                                    <AISuggestButton
                                        onClick={handleAISuggest}
                                        loading={loadingAI}
                                        className="mt-1"
                                    />
                                </div>
                                {errors.custom_alias && (
                                    <div className="text-red-500 text-sm mt-1">
                                        {errors.custom_alias}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Expiration Date */}
                        <div>
                            <label className="text-sm text-foreground">Expiration Date</label>
                            <input
                                type="date"
                                className="w-full border border-brfourth rounded-lg px-3 py-2 mt-1"
                                name="expires_at"
                                value={data.expires_at}
                                onChange={(e) => setData("expires_at", e.target.value)}
                                required
                            />
                            {errors.expires_at && (
                                <div className="text-red-500 text-sm mt-1">{errors.expires_at}</div>
                            )}
                        </div>

                        {/* Opsional Password */}
                        <div>
                            <label className="flex items-center gap-2 text-sm text-foreground">
                                <input
                                    type="checkbox"
                                    checked={usePassword}
                                    onChange={(e) => setUsePassword(e.target.checked)}
                                />
                                Protect with Password?
                            </label>

                            {usePassword && (
                                <input
                                    type="password"
                                    className="w-full border border-brfourth rounded-lg px-3 py-2 mt-2"
                                    placeholder="Enter password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData("password", e.target.value)}
                                />
                            )}
                            {errors.password && (
                                <div className="text-red-500 text-sm mt-1">{errors.password}</div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <PrimaryButton type="submit" disabled={processing}>
                            {processing ? "Shortened Link..." : "Shortened Link"}
                        </PrimaryButton>
                    </form>

                </div>
            </div>
        </div>
    );
}
