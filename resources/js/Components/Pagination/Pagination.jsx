import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { useState } from 'react';

export default function Pagination({
  pagination = {},
  perPage = 10,
  onPageChange = () => {},
  onPerPageChange = () => {},
}) {
  const [selectFocused, setSelectFocused] = useState(false);

  const {
    current_page = 1,
    last_page = 1,
    from = 0,
    to = 0,
    total = 0,
    prev_page_url = current_page > 1,
    next_page_url = current_page < last_page,
  } = pagination;

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4 text-sm">
      {/* Per Page Selector */}
      <div className="flex items-center gap-2 relative">
        <span>Show</span>
        <div className="relative">
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            onFocus={() => setSelectFocused(true)}
            onBlur={() => setSelectFocused(false)}
            className="block appearance-none border px-3 py-1 pr-8 rounded-lg focus:outline-none bg-white text-sm"
            style={{
              backgroundImage: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none',
            }}
          >
            {[5, 10, 25, 50].map((num) => (
              <option key={num} value={num}>{num}</option>
            ))}
          </select>

          {/* Custom icon */}
          <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-600">
            {selectFocused ? <FiChevronUp /> : <FiChevronDown />}
          </div>
        </div>
        <span>Entries</span>
      </div>

      {/* Info & Pagination */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:ml-auto">
        <div className="text-gray-700 text-center sm:text-left whitespace-nowrap">
          Showing {from} to {to} of {total} results
        </div>

        {/* Pagination Buttons */}
        <div className="flex flex-wrap justify-center sm:justify-end gap-1">
          <button
            onClick={() => onPageChange(current_page - 1)}
            disabled={!prev_page_url}
            className="px-2.5 py-1 rounded-full bg-white border hover:text-white hover:bg-primary-100"
          >
            &lt;
          </button>

          {Array.from({ length: last_page }).map((_, i) => {
            const page = i + 1;
            return (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`px-2.5 py-1 rounded-full border ${
                  current_page === page
                    ? 'bg-primary-100 text-white'
                    : 'bg-white hover:bg-primary-100 hover:text-white'
                }`}
              >
                {page}
              </button>
            );
          })}

          <button
            onClick={() => onPageChange(current_page + 1)}
            disabled={!next_page_url}
            className="px-2.5 py-1 rounded-full border bg-white hover:text-white hover:bg-primary-100"
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}

// import { Inertia } from '@inertiajs/inertia';
// import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
// import { useState } from 'react';

// export default function Pagination({ pagination = {}, perPage = 10 }) {
//   const [selectFocused, setSelectFocused] = useState(false);

//   const {
//     current_page = 1,
//     last_page = 1,
//     from = 0,
//     to = 0,
//     total = 0,
//     prev_page_url = null,
//     next_page_url = null,
//   } = pagination;

//   const handlePageChange = (page) => {
//     Inertia.get(route(route().current()), { page, per_page: perPage }, {
//       preserveState: true,
//       scroll: true,
//     });
//   };

//   const handlePerPageChange = (e) => {
//     Inertia.get(route(route().current()), { page: 1, per_page: e.target.value }, {
//       preserveState: true,
//     });
//   };

//   return (
//     <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mt-4 text-sm">
//       {/* Per Page Selector */}
//       <div className="flex items-center gap-2 relative">
//         <span>Show</span>
//         <div className="relative">
//   <select
//     value={perPage}
//     onChange={handlePerPageChange}
//     onFocus={() => setSelectFocused(true)}
//     onBlur={() => setSelectFocused(false)}
//     className="block appearance-none border px-3 py-1 pr-8 rounded-lg focus:outline-none bg-white text-sm"
//     style={{
//       backgroundImage: 'none',
//       WebkitAppearance: 'none',
//       MozAppearance: 'none',
//     }}
//   >
//     {[5, 10, 25, 50].map((num) => (
//       <option key={num} value={num}>{num}</option>
//     ))}
//   </select>

//   {/* Custom icon */}
//   <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-600">
//     {selectFocused ? <FiChevronUp /> : <FiChevronDown />}
//   </div>
// </div>

//         <span>Entries</span>
//       </div>

//       {/* Info & Pagination */}
//       <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:ml-auto">
//         <div className="text-gray-700 text-center sm:text-left whitespace-nowrap">
//           Showing {from} to {to} of {total} results
//         </div>

//         {/* Pagination Buttons */}
//         <div className="flex flex-wrap justify-center sm:justify-end gap-1">
//           <button
//             onClick={() => handlePageChange(current_page - 1)}
//             disabled={!prev_page_url}
//             className="px-2.5 py-1 rounded-full bg-white  border hover:text-white hover:bg-primary-100"
//           >
//             &lt;
//           </button>

//           {Array.from({ length: last_page }).map((_, i) => {
//             const page = i + 1;
//             return (
//               <button
//                 key={page}
//                 onClick={() => handlePageChange(page)}
//                 className={`px-2.5 py-1 rounded-full border ${
//                   current_page === page
//                     ? 'bg-primary-100 text-white'
//                     : 'bg-white hover:bg-primary-100 hover:text-white'
//                 }`}
//               >
//                 {page}
//               </button>
//             );
//           })}

//           <button
//             onClick={() => handlePageChange(current_page + 1)}
//             disabled={!next_page_url}
//             className="px-2.5 py-1 rounded-full  border bg-white hover:text-white hover:bg-primary-100"
//           >
//             &gt;
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
