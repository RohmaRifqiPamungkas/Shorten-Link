

import { useState } from 'react';
import { FiChevronDown, FiTrash2 } from 'react-icons/fi';
import { LuList } from "react-icons/lu";


export default function BulkActions({ onDelete, isActive, toggleBulkMode }) {
  const [showDropdown, setShowDropdown] = useState(false);

  const handleToggle = () => {
    toggleBulkMode();
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="relative">
      {/* Tombol Hamburger (ikon list menu) */}
      {!showDropdown ? (
        <button
          onClick={handleToggle}
          className={`p-2 rounded-lg bg-white border shadow-sm hover:bg-gray-100 ${isActive ? 'bg-blue-50' : ''}`}
        >
          <LuList size={20} className="text-foreground" />
        </button>
      ) : (
        // Tombol dropdown aksi setelah hamburger diklik
        <div className="relative">
          <button
            onClick={handleToggle}
            className={`border px-3 py-2 rounded-lg flex items-center gap-2 ${isActive ? 'bg-primary-100 text-white' : 'bg-white'} transition-all duration-300 ease-in-out`}
          >
            Bulk Action <FiChevronDown />
          </button>

          {/* Dropdown aksi jika aktif */}
          {showDropdown && isActive && (
            <div className="absolute right-0 left-0 mt-2 w-40 bg-white border border-primary-100 hover:border-none rounded-lg shadow-lg z-10 transition-all duration-300 ease-in-out">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  onDelete();
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-primary-100 hover:bg-primary-100 hover:text-white hover:rounded-lg"
              >
                <FiTrash2 size={16} />
                Delete 
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
