// import { useState } from 'react';
// import { FiChevronDown } from 'react-icons/fi';

// export default function BulkActions({ onDelete, isActive, toggleBulkMode }) {
//   const [showDropdown, setShowDropdown] = useState(false);

//   return (
//     <div className="relative">
//       <button
//         onClick={() => {
//           toggleBulkMode();
//           setShowDropdown(!showDropdown);
//         }}
//         className={`border px-3 py-2 rounded flex items-center gap-2 ${isActive ? 'bg-blue-500 text-white' : 'bg-white'}`}
//       >
//         Bulk Action <FiChevronDown />
//       </button>

//       {showDropdown && isActive && (
//         <div className="absolute mt-2 w-40 bg-white border rounded shadow-md z-10">
//           <button
//             onClick={() => {
//               setShowDropdown(false);
//               onDelete();
//             }}
//             className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
//           >
//             Delete Selected
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// import { useState } from 'react';
// import { FiMoreVertical } from 'react-icons/fi'; // hamburger-style icon
// import { FiTrash2 } from 'react-icons/fi'; // delete icon

// export default function BulkActions({ onDelete, isActive, toggleBulkMode }) {
//   const [showDropdown, setShowDropdown] = useState(false);

//   const handleToggle = () => {
//     toggleBulkMode();
//     setShowDropdown((prev) => !prev);
//   };

//   return (
//     <div className="relative">
//       {/* Hamburger icon button */}
//       <button
//         onClick={handleToggle}
//         className={`p-2 rounded bg-white border shadow-sm hover:bg-gray-100 ${
//           isActive ? 'bg-blue-50' : ''
//         }`}
//       >
//         <FiMoreVertical size={20} className="text-gray-600" />
//       </button>

//       {/* Dropdown */}
//       {showDropdown && isActive && (
//         <div className="absolute right-0 mt-2 w-40 bg-white border border-purple-300 rounded shadow-lg z-10">
//           <button
//             onClick={() => {
//               setShowDropdown(false);
//               onDelete();
//             }}
//             className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-gray-100"
//           >
//             <FiTrash2 size={16} />
//             Delete
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

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
            className={`border px-3 py-2 rounded flex items-center gap-2 ${isActive ? 'bg-blue-500 text-white' : 'bg-white'} transition-all duration-300 ease-in-out`}
          >
            Bulk Action <FiChevronDown />
          </button>

          {/* Dropdown aksi jika aktif */}
          {showDropdown && isActive && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-purple-300 rounded shadow-lg z-10 transition-all duration-300 ease-in-out">
              <button
                onClick={() => {
                  setShowDropdown(false);
                  onDelete();
                }}
                className="flex items-center gap-2 w-full px-4 py-2 text-red-600 hover:bg-gray-100"
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
