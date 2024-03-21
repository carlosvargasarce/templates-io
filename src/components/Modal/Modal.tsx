import { ModalProps } from '@/types/modal';
import React, { useEffect, useRef } from 'react';
import Button from '../Button/Button';

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  const handleClose = (e: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClose);
    } else {
      document.removeEventListener('mousedown', handleClose);
    }

    return () => {
      document.removeEventListener('mousedown', handleClose);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
    >
      <div
        ref={modalRef}
        style={{
          padding: '40px',
          backgroundColor: '#FFF',
          borderRadius: '5px',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          maxWidth: '768px',
          width: '100%',
          maxHeight: '100%',
          overflowY: 'auto',
        }}
      >
        {children}
        <Button
          label="X"
          style={{
            height: '40px',
            width: '40px',
            lineHeight: '40px',
            minWidth: 'auto',
            padding: '0',
            position: 'absolute',
            top: 20,
            right: 20,
          }}
          onClick={onClose}
        />
      </div>
    </div>
  );
};

export default Modal;
