import Sidebar from '@/Components/Sidebar/Sidebar';
import Footer from '@/Components/Footer/Footer';
import DashboardNavbar from '@/Components/Navbar/DashboardNavbar';
import { useState } from 'react';

const DashboardLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-tertiary">
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
      <div className={`flex-1 flex min-w-0 flex-col overflow-hidden ${isMobileOpen ? 'md:ml-64' : ''}`}>
        <main className="flex-1 min-w-0 overflow-y-auto overflow-x-hidden bg-tertiary">
          <DashboardNavbar onMenuClick={() => setIsMobileOpen(true)} />

          <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
