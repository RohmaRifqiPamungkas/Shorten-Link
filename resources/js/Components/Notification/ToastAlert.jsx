import React from 'react';

const ToastAlert = ({ message, type = 'success', onClose }) => {
  if (!message) return null;

  const isSuccess = type === 'success';

  return (
    <div
      className={`fixed top-5 right-5 z-50 px-4 py-2 rounded-lg shadow-lg flex items-center justify-between w-full max-w-sm
        ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
      `}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className={`ml-4 font-bold ${
          isSuccess ? 'text-green-700 hover:text-green-900' : 'text-red-700 hover:text-red-900'
        }`}
      >
        ✕
      </button>
    </div>
  );
};

export default ToastAlert;
