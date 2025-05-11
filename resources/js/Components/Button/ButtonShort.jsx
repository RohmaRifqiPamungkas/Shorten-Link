import { FiPlus } from 'react-icons/fi';

export default function ShortenButton({ onClick }) {
    return (
      
      <button onClick={onClick} className="bg-secondary hover:bg-primary-100 text-white px-3 py-2 flex items-center gap-1 rounded-lg">
      <FiPlus size={18} /> Shorten
    </button>
    );
  }
  