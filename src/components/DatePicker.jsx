import React, { useEffect, useMemo, useRef, useState } from 'react';

const monthNames = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
const weekDays = ['L','M','X','J','V','S','D'];

const toISO = (d) => {
  if (!d) return '';
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const parseISO = (s) => {
  if (!s) return null;
  const [y, m, d] = s.split('-').map(Number);
  const dt = new Date(y, (m || 1) - 1, d || 1);
  return isNaN(dt.getTime()) ? null : dt;
};

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const addMonths = (d, n) => new Date(d.getFullYear(), d.getMonth() + n, 1);
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

// ISO week number (Monday as first day, weeks Monday-Sunday)
const getISOWeek = (date) => {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = (d.getUTCDay() + 6) % 7; // Monday=0
  d.setUTCDate(d.getUTCDate() - dayNum + 3); // Thursday
  const firstThursday = new Date(Date.UTC(d.getUTCFullYear(), 0, 4));
  const firstThursdayDayNum = (firstThursday.getUTCDay() + 6) % 7;
  firstThursday.setUTCDate(firstThursday.getUTCDate() - firstThursdayDayNum + 3);
  return 1 + Math.round((d - firstThursday) / (7 * 24 * 60 * 60 * 1000));
};

const mondayOf = (d) => {
  const day = (d.getDay() + 6) % 7; // Mon=0
  const m = new Date(d);
  m.setDate(d.getDate() - day);
  return m;
};

const fridayOf = (d) => addDays(mondayOf(d), 4);

const DatePicker = ({ value, onChange, placeholder = 'Selecciona fecha', className = '', rangeSide = 'start' }) => {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);
  const selectedDate = parseISO(value) || null;
  const [cursor, setCursor] = useState(() => selectedDate || new Date());
  const [inputValue, setInputValue] = useState(value || '');

  useEffect(() => {
    const onDocClick = (e) => {
      if (panelRef.current?.contains(e.target) || buttonRef.current?.contains(e.target)) return;
      setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    if (selectedDate) setCursor(selectedDate);
  }, [value]);

  useEffect(() => {
    setInputValue(value || '');
  }, [value]);

  const rows = useMemo(() => {
    const first = startOfMonth(cursor);
    const firstDay = (first.getDay() + 6) % 7; // Monday=0
    const firstGridDate = addDays(first, -firstDay); // Monday of the first grid row
    const daysInMonth = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0).getDate();
    const lastOfMonth = new Date(cursor.getFullYear(), cursor.getMonth(), daysInMonth);
    const lastDay = (lastOfMonth.getDay() + 6) % 7;
    const lastGridDate = addDays(lastOfMonth, 6 - lastDay); // Sunday of the last grid row
    const totalDays = Math.round((lastGridDate - firstGridDate) / (24 * 60 * 60 * 1000)) + 1;
    const cells = Array.from({ length: totalDays }, (_, i) => addDays(firstGridDate, i));
    const result = [];
    for (let i = 0; i < cells.length; i += 7) {
      const week = cells.slice(i, i + 7);
      const monday = week[0];
      result.push({ week, weekNumber: getISOWeek(monday) });
    }
    return result;
  }, [cursor]);

  const handleSelect = (d) => {
    if (!d) return;
    onChange?.(toISO(d));
    setOpen(false);
  };

  const isSameDay = (a, b) => a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const onInputChange = (e) => {
    const v = e.target.value;
    setInputValue(v);
    // Validar formato YYYY-MM-DD
    const re = /^\d{4}-\d{2}-\d{2}$/;
    if (re.test(v)) {
      const d = parseISO(v);
      if (d) {
        const sel = rangeSide === 'end' ? fridayOf(d) : mondayOf(d);
        onChange?.(toISO(sel));
        setCursor(sel);
        setInputValue(toISO(sel));
      }
    }
  };
  const onInputBlur = () => {
    // Revertir a último válido si el texto no coincide o es fin de semana
    const re = /^\d{4}-\d{2}-\d{2}$/;
    if (!re.test(inputValue)) {
      setInputValue(value || '');
      return;
    }
    const d = parseISO(inputValue);
    if (!d) {
      setInputValue(value || '');
      return;
    }
    const sel = rangeSide === 'end' ? fridayOf(d) : mondayOf(d);
    setInputValue(toISO(sel));
  };

  return (
    <div className={`relative ${className}`}>
      <div className="w-full border border-gray-300 bg-white rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500 flex items-center gap-2">
        <input
          type="text"
          inputMode="numeric"
          placeholder={placeholder}
          value={inputValue}
          onChange={onInputChange}
          onFocus={() => setOpen(true)}
          onBlur={onInputBlur}
          className="flex-1 outline-none text-sm text-gray-800 placeholder:text-gray-400"
        />
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir calendario"
          className="text-gray-500 hover:text-gray-700"
        >
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.25 8.29a.75.75 0 01-.02-1.08z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
      {open && (
        <div ref={panelRef} className="absolute z-10 mt-2 w-full rounded-lg border border-gray-200 bg-white shadow-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <button type="button" className="p-1 rounded hover:bg-gray-100" onClick={() => setCursor(addMonths(cursor, -1))} aria-label="Mes anterior">‹</button>
            <div className="text-sm font-medium text-gray-700">{monthNames[cursor.getMonth()]} {cursor.getFullYear()}</div>
            <button type="button" className="p-1 rounded hover:bg-gray-100" onClick={() => setCursor(addMonths(cursor, 1))} aria-label="Mes siguiente">›</button>
          </div>
          <div className="grid grid-cols-6 gap-1 text-center text-xs text-gray-500 mb-1">
            <div className="py-1 text-left pl-2">Semana</div>
            <div className="py-1 text-center col-span-3">L - V</div>
            <div className="py-1 text-center text-gray-300">S</div>
            <div className="py-1 text-center text-gray-300">D</div>
          </div>
          <div className="grid grid-cols-6 gap-1">
            {rows.map(({ week, weekNumber }, rowIdx) => {
              const mon = week[0];
              const fri = week[4];
              const sat = week[5];
              const sun = week[6];
              const selectedInWeek = selectedDate && selectedDate >= mon && selectedDate <= fri;
              return (
                <React.Fragment key={rowIdx}>
                  <div className="h-8 flex items-center justify-start pl-2 text-xs text-gray-600">{weekNumber}</div>
                  <button
                    type="button"
                    onClick={() => handleSelect(rangeSide === 'end' ? fri : mon)}
                    className={`col-span-3 h-8 rounded text-sm flex items-center justify-center ${
                      selectedInWeek ? 'bg-blue-600 text-white' : 'bg-white hover:bg-gray-100 text-gray-800'
                    }`}
                    title={`Lun ${mon.getDate()}/${mon.getMonth()+1} - Vie ${fri.getDate()}/${fri.getMonth()+1}`}
                  >
                    Semana {weekNumber}
                  </button>
                  <div className={`h-8 rounded text-sm flex items-center justify-center text-gray-300 ${sat.getMonth() !== cursor.getMonth() ? 'opacity-40' : ''}`}>{sat.getDate()}</div>
                  <div className={`h-8 rounded text-sm flex items-center justify-center text-gray-300 ${sun.getMonth() !== cursor.getMonth() ? 'opacity-40' : ''}`}>{sun.getDate()}</div>
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}
      {selectedDate && (
        <div className="mt-1 text-xs text-gray-500">Semana {getISOWeek(mondayOf(selectedDate))}</div>
      )}
    </div>
  );
};

export default DatePicker;
