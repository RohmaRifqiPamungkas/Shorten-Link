import React, { useState } from 'react';
import DashboardLayout from "@/components/DashboardLayout/DashboardLayout";
import { Inertia } from "@inertiajs/inertia";
import { Head } from '@inertiajs/react';
import URLTable from '@/Components/Table/URLTable';
import SearchBar from '@/Components/Searchbar/Search';
import Pagination from '@/Components/Pagination/Pagination';
import BulkActions from '@/Components/BulkAction/BulkAction';
import ShortenButton from '@/Components/Button/ButtonShort';


export default function ShortenedLinkPage({ links }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [bulkMode, setBulkMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleDeleteSelected = () => {
    if (selectedIds.length === 0) return;
    if (confirm(`Delete ${selectedIds.length} selected link(s)?`)) {
      Inertia.post('/links/bulk-delete', { ids: selectedIds }, {
        onSuccess: () => {
          setSelectedIds([]);
          setBulkMode(false);
        },
      });
    }
  };

  const filteredLinks = (links?.data ?? []).filter((link) =>
    link.original_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    link.short_url.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const dummyPagination = {
    current_page: 1,
    last_page: 5,
    from: 1,
    to: 10,
    total: 50,
    prev_page_url: null,
    next_page_url: '/links?page=2',
  };

  const dummyLinks = [
    {
      id: 1,
      short_url: "https://short.ly/abc123",
      original_url: "https://example.com/page-1",
      created_at: "2025-05-01",
      expired_at: "2025-06-01",
      status: "Active",
    },
    {
      id: 2,
      short_url: "https://short.ly/xyz456",
      original_url: "https://example.com/page-2",
      created_at: "2025-04-15",
      expired_at: "2025-05-15",
      status: "Expired",
    },
    {
      id: 3,
      short_url: "https://short.ly/def789",
      original_url: "https://another-site.com/article",
      created_at: "2025-03-22",
      expired_at: "2025-05-22",
      status: "Active",
    },
  
  ];
  
  

  return (
    <DashboardLayout>
      <Head title="Shortened Links" />

      <div className="py-5">
        <h1 className="text-2xl font-bold text-primary-100">Shortened Link</h1>
        <div className="flex justify-between items-center flex-wrap gap-5 my-3">
  {/* Kiri */}
  <p className="text-gray-700 text-lg">List Shortened Link</p>

  {/* Kanan */}
  <div className="flex items-center gap-3 transition-all duration-300 ease-in-out flex-wrap">
    {/* Shorten button */}
    <div className="transition-all duration-300">
      <ShortenButton />
    </div>

    {/* Search bar */}
    <div className="transition-all duration-300">
      <SearchBar onSearch={setSearchTerm} />
    </div>

    {/* Bulk action */}
    <div className="transition-all duration-300">
      <BulkActions
        isActive={bulkMode}
        toggleBulkMode={() => {
          setBulkMode(!bulkMode);
          setSelectedIds([]);
        }}
        onDelete={handleDeleteSelected}
      />
    </div>
  </div>
</div>


        {/* Table */}
        <div className="overflow-x-auto bg-white rounded-2xl shadow-lg p-4">
        <URLTable
  links={dummyLinks}
  bulkMode={true}
  selectedIds={[]}
  toggleSelect={(id) => console.log("Toggled:", id)}
/>
        </div>

        {/* Pagination */}
        {/* <Pagination pagination={links} perPage={links.per_page || 10} /> */}
        <div className='my-4'>
        <Pagination pagination={links ?? dummyPagination} perPage={10} />
        </div>
   
   
      </div>
    </DashboardLayout>
  );
}
