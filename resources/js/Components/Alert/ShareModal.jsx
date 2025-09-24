import { useState } from "react";
import { Icon } from "@iconify/react";
import Notification from "@/Components/Notification/Notification";
import { QRCodeCanvas } from "qrcode.react";

export default function SharePopup({ url, onClose }) {
    const [showNotif, setShowNotif] = useState(false);
    const [showBarcode, setShowBarcode] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        setShowNotif(true);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-5">
            <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-sm md:max-w-2xl flex flex-col items-center justify-center py-16 px-8">
                {/* Tombol X (Close) */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-primary-100 transition"
                >
                    <Icon icon="mdi:close" className="text-2xl" />
                </button>

                {/* Judul */}
                <h2 className="text-lg md:text-2xl font-semibold text-primary-100 mb-6">
                    Share your link
                </h2>

                {/* WhatsApp */}
                <a
                    href={`https://wa.me/?text=${encodeURIComponent(url)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex justify-center mb-4"
                >
                    <Icon
                        icon="mdi:whatsapp"
                        className="text-4xl md:text-6xl text-primary-100 hover:text-secondary transition"
                    />
                </a>

                {/* Garis OR */}
                <div className="flex w-3/4 md:w-3/5 items-center gap-4 text-gray-400 mb-6">
                    <hr className="flex-1 border-t border-gray-300" />
                    <span className="text-md md:text-lg text-primary-100 font-medium">
                        OR
                    </span>
                    <hr className="flex-1 border-t border-gray-300" />
                </div>

                {/* Tombol Generate Barcode */}
                <button
                    onClick={() => setShowBarcode(!showBarcode)}
                    className="mb-6 bg-primary-100 hover:bg-secondary text-white font-medium px-5 py-2 rounded-lg shadow-md transition"
                >
                    {showBarcode ? "Hide Barcode" : "Generate Barcode"}
                </button>

                {/* Barcode */}
                {showBarcode && (
                    <div className="mb-6 flex flex-col items-center animate-fadeIn">
                        <div className="p-4 bg-white border border-gray-200 rounded-2xl shadow-sm">
                            <QRCodeCanvas
                                value={url}
                                size={150}
                                bgColor={"#ffffff"}
                                fgColor={"#000000"}
                                level={"H"}
                                includeMargin={true}
                            />
                        </div>
                        <p className="text-sm text-gray-600 mt-3 text-center">
                            Scan this QR to open the link
                        </p>
                    </div>
                )}

                <h2 className="text-lg md:text-xl font-normal text-foreground mb-4">
                    Copy your link
                </h2>

                {/* Copy Area */}
                <div className="w-[80%] md:w-[60%]">
                    <div className="rounded-2xl px-4 py-3 flex items-center justify-between mb-4 gap-2 border border-gray-300 bg-white shadow-sm">
                        <span className="text-sm text-gray-700 truncate max-w-[80%]">
                            {url}
                        </span>
                        <button onClick={handleCopy}>
                            <Icon
                                icon="mdi:content-copy"
                                className="text-lg text-gray-600 hover:text-primary-100 transition"
                            />
                        </button>
                    </div>

                    {/* Notifikasi */}
                    {showNotif && (
                        <Notification
                            type="success"
                            message="Link copied to clipboard!"
                            onClose={() => setShowNotif(false)}
                            className="w-full"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
