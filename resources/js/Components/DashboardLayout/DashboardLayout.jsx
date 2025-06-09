


import Sidebar from '@/Components/Sidebar/sidebar';
import Footer from '@/Components/Footer/Footer';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa';

const DashboardLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Overlay untuk mobile */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Area Konten Utama */}
      <div className={`flex-1 flex flex-col overflow-hidden ${isMobileOpen ? 'md:ml-64' : ''}`}>
        {/* Header */}
        <div className="bg-white p-4 shadow md:hidden flex justify-between">
          <button onClick={() => setIsMobileOpen(true)}>
            <FaBars size={20} />
          </button>
          <div className="font-bold text-lg">Sevenpion</div>
        </div>

        {/* Konten Utama */}
        <main className="flex-1 px-6 py-6 bg-tertiary min-w-0 overflow-y-auto">
          {children}
        </main>
         <Footer className="w-full bg-white shadow-md md:static md:mt-auto" />
      </div>


     
    </div>
  );
};

export default DashboardLayout;
