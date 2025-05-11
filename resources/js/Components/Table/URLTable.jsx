// export default function URLTable({ links }) {
//     return (
//       <table className="min-w-full text-sm">
//         <thead>
//           <tr>
//             <th>URL</th>
//             <th>Date Created</th>
//             <th>Expiration Date</th>
//             <th>Status</th>
//             <th>Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {links.map((link, idx) => (
//             <tr key={idx}>
//               <td>
//                 <a href={link.short_url} className="font-bold text-blue-600">{link.short_url}</a><br />
//                 <span className="text-gray-500">{link.original_url}</span>
//               </td>
//               <td>{link.created_at}</td>
//               <td>{link.expired_at}</td>
//               <td>{link.status}</td>
//               <td>{/* Action icons here */}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     );
//   }
  



export default function URLTable({ links, bulkMode, selectedIds, toggleSelect }) {
    return (
      <table className="min-w-full text-sm ">
        <thead>
          <tr>
            {bulkMode && <th><input type="checkbox" disabled /></th>}
            <th className="text-left">URL</th>
            <th className="text-left">Date Created</th>
            <th className="text-left">Expiration Date</th>
            <th className="text-left">Status</th>
            <th className="text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {links.map((link, idx) => (
            <tr key={idx}>
              {bulkMode && (
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(link.id)}
                    onChange={() => toggleSelect(link.id)}
                  />
                </td>
              )}
              <td>
                <a href={link.short_url} className="font-bold text-blue-600">{link.short_url}</a><br />
                <span className="text-gray-500">{link.original_url}</span>
              </td>
              <td>{link.created_at}</td>
              <td>{link.expired_at}</td>
              <td>{link.status}</td>
              <td>{/* Action icons */}</td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
  