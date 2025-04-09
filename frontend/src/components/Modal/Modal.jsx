// src/components/Modal.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const Modal = ({ isOpen, onClose, children }) => {
  
  // If the modal is not open, return null to avoid rendering anything
  if (!isOpen) return null;
  
  return ReactDOM.createPortal(
    // The modal overlay, which will close the modal when clicked
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        
        {/* The modal's children components, which are passed as content inside the modal */}
        {children}
      </div>
    </div>,
    document.getElementById('modal-root')
  );
};

export default Modal;
