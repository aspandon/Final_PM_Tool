// js/shared/ui/Dropdown.js

/**
 * Dropdown Component
 * Reusable dropdown menu
 */

const { useState, useEffect, useRef } = React;

export function Dropdown({
  trigger,
  children,
  darkMode = false,
  align = 'left', // left, right
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const alignClasses = {
    left: 'left-0',
    right: 'right-0'
  };

  return React.createElement('div', {
    ref: dropdownRef,
    className: `relative ${className}`
  },
    // Trigger
    React.createElement('div', {
      onClick: () => setIsOpen(!isOpen)
    }, trigger),

    // Dropdown Menu
    isOpen && React.createElement('div', {
      className: `absolute ${alignClasses[align]} top-full mt-1 w-56 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} rounded-lg shadow-lg border py-1 z-50 dropdown-enter`
    }, children)
  );
}

export function DropdownItem({
  onClick,
  children,
  darkMode = false,
  icon = null,
  danger = false
}) {
  return React.createElement('button', {
    onClick,
    className: `flex items-center gap-3 px-4 py-2.5 w-full text-left text-sm dropdown-item ${
      danger
        ? 'text-red-600 hover:bg-red-50'
        : darkMode
          ? 'text-gray-200 hover:bg-slate-600'
          : 'text-gray-700 hover:bg-gray-100'
    }`
  },
    icon && React.createElement('span', { className: 'flex-shrink-0' }, icon),
    children
  );
}
