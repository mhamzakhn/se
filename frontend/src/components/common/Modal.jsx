import React from 'react';
import ReactDOM from 'react-dom';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[1000]"
      onClick={onClose}
    >
      <div
        className="relative bg-white w-[67.4vw] h-[83vh] max-w-[971px] max-h-[684px] rounded-xl overflow-y-auto box-border p-0 sm:w-[90vw] sm:max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-black text-2xl font-bold hover:text-gray-600"
        >
          &times;
        </button>

        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
