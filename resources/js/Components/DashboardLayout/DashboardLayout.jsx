import Sidebar from '@/Components/Sidebar/sidebar';
import Footer from '@/Components/Footer/Footer';
import { useState } from 'react';
import { FaBars } from 'react-icons/fa';

const DashboardLayout = ({ children }) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />

      {/* Overlay hp */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 z-30 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

   
      <div className="flex-1 flex flex-col">
        {/* atas */}
        <div className="bg-white p-4 shadow md:hidden flex justify-between">
          <button onClick={() => setIsMobileOpen(true)}>
            <FaBars size={20} />
          </button>
          <div className="font-bold text-lg">Sevenpion</div>
        </div>

        <main className="flex-1 px-6 py-6 bg-tertiary min-w-0">{children}</main>

        <Footer />
      </div>
    </div>
  );
};

export default DashboardLayout;
