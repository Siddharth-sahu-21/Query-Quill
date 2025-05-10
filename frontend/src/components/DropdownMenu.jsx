'use client';
import { useEffect, useRef } from 'react';

export default function DropdownMenu({ isOpen, onClose, children, className = '' }) {
  const menuRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className={`absolute right-0 mt-2 w-32 bg-white text-black rounded shadow-lg z-50 animate-fade-in dropdown-menu ${className}`}
    >
      {children}
    </div>
  );
}
