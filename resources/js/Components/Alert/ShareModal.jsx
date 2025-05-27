import { useState } from 'react';
import { Icon } from '@iconify/react';
import Notification from '@/Components/Notification/Notification'; 

export default function SharePopup({ url, onClose }) {
  const [showNotif, setShowNotif] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setShowNotif(true);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm md:max-w-2xl flex flex-col items-center justify-center py-20 px-10">

        {/* Judul */}
        <h2 className="text-lg md:text-2xl font-semibold text-primary-100 mb-4">Share your link</h2>

        {/* WhatsApp */}
        <a
          href={`https://wa.me/?text=${encodeURIComponent(url)}`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex justify-center mb-4"
        >
          <Icon icon="mdi:whatsapp" className="text-4xl md:text-6xl text-primary-100" />
        </a>

        {/* Garis OR */}
        <div className="flex w-1/2 items-center gap-4 text-gray-500 mb-4">
          <hr className="flex-1 border-t border-foreground" />
          <span className="text-md md:text-xl text-primary-100">OR</span>
          <hr className="flex-1 border-t border-foreground" />
        </div>

        <h2 className="text-lg md:text-xl font-normal text-foreground mb-4">Copy your link</h2>

        {/* Copy Area */}
        <div className="rounded-2xl px-6 py-4 flex items-center justify-between mb-4 space-x-2 border border-brfourth bg-white">
          <span className="text-sm text-gray-700 truncate">{url}</span>
          <button onClick={handleCopy}>
            <Icon icon="mdi:content-copy" className="text-lg text-gray-600 hover:text-gray-800" />
          </button>
        </div>

        {/* Notifikasi muncul di atas tombol OK */}
        {showNotif && (
          <Notification
            type="success"
            message="Link copied to clipboard!"
            onClose={() => setShowNotif(false)}
          />
        )}

        {/* Tombol OK */}
        <button
          onClick={onClose}
          className="bg-primary-100 hover:bg-secondary text-white px-4 py-2 rounded-lg w-24"
        >
          OK
        </button>
      </div>
    </div>
  );
}
