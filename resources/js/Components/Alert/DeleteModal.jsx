
import React from 'react';


const DeleteModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm md:max-w-2xl flex flex-col items-center justify-center py-20 px-10">
        <div className=" w-20 md:w-[150px] flex justify-center mb-4">
     <img src="/images/info-circle.png" alt="info" />
    </div>
        <h2 className="text-lg md:text-2xl font-semibold mb-4">Delete this link?</h2>
        <p className="mb-6 text-sm md:text-lg text-gray-600 text-center">All data related to the link will be completely deleted. This action cannot be undone.</p>
        <div className="flex justify-end gap-6">
           <button onClick={onConfirm} className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-secondary">
            Hapus
          </button>
          <button onClick={onClose} className="px-6 py-2 border border-foreground rounded-lg hover:bg-gray-400 hover:border-none hover:text-white">
            Batal
          </button>
         
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
