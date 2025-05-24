import { FiSearch } from 'react-icons/fi';

export default function Search({ onSearch }) {
  return (
    <div className="relative w-full max-w-xs">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground">
        <FiSearch />
      </span>
      <input
        type="text"
        placeholder="Search"
        onChange={(e) => onSearch(e.target.value)}
        className="w-full border-transparent shadow-sm  rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
      />
    </div>
  );
}
