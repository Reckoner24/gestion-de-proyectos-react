import React, { useEffect, useRef, useState } from 'react';

const STATUS_OPTIONS = [
  { value: 'pendiente', label: 'Pendiente', color: 'bg-red-500' },
  { value: 'en progreso', label: 'En progreso', color: 'bg-yellow-500' },
  { value: 'concluido', label: 'Concluido', color: 'bg-green-500' },
];

const StatusSelect = ({ value, onChange, className = '' }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  const selected = STATUS_OPTIONS.find((o) => o.value === value) || STATUS_OPTIONS[0];

  useEffect(() => {
    const onDocClick = (e) => {
      if (!panelRef.current && !buttonRef.current) return;
      if (
        panelRef.current?.contains(e.target) ||
        buttonRef.current?.contains(e.target)
      ) {
        return;
      }
      setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const handleSelect = (opt) => {
    onChange?.(opt.value);
    setOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-between"
      >
        <span className="flex items-center gap-2">
          <span className={`inline-block w-2.5 h-2.5 rounded-full ${selected.color}`}></span>
          <span className="text-gray-800 text-sm">{selected.label}</span>
        </span>
        <svg className="w-4 h-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div
          ref={panelRef}
          className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden"
        >
          <ul className="py-1">
            {STATUS_OPTIONS.map((opt) => (
              <li key={opt.value}>
                <button
                  type="button"
                  onClick={() => handleSelect(opt)}
                  className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 ${
                    value === opt.value ? 'bg-gray-50' : ''
                  }`}
                >
                  <span className={`inline-block w-2.5 h-2.5 rounded-full ${opt.color}`}></span>
                  <span className="text-gray-800">{opt.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default StatusSelect;
