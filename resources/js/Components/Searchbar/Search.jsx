import { FiSearch } from 'react-icons/fi';
import { useState, useEffect } from 'react';

export default function Search({ onSearch }) {

  const [input, setInput] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const searchParam = params.get('search') || '';
    setInput(searchParam); 
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault(); // Hindari reload halaman
    onSearch(input);    // Trigger pencarian hanya saat submit
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-xs">
      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-foreground">
        <FiSearch />
      </span>
      <input
        type="text"
        placeholder="Search"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full border-transparent shadow-sm rounded-lg pl-10 pr-3 py-2 focus:outline-none focus:ring focus:border-blue-300"
      />
    </form>
  );
}
