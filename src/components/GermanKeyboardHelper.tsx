import React from 'react';

interface GermanKeyboardHelperProps {
  onInsertChar: (char: string) => void;
  className?: string;
}

const GERMAN_SPECIAL_CHARS = [
  'ä', 'ö', 'ü', 'ß',
  'Ä', 'Ö', 'Ü'
];

export const GermanKeyboardHelper: React.FC<GermanKeyboardHelperProps> = ({ onInsertChar, className = '' }) => {
  return (
    <div className={`flex flex-wrap items-center gap-1.5 p-2 bg-slate-900/80 rounded-xl border border-slate-800 backdrop-blur-sm ${className}`}>
      <span className="text-xs font-medium text-slate-400 px-1 select-none flex items-center gap-1">
        <span>🇩🇪</span> Umlaute & ß:
      </span>
      <div className="flex flex-wrap gap-1">
        {GERMAN_SPECIAL_CHARS.map(char => (
          <button
            key={char}
            type="button"
            onClick={() => onInsertChar(char)}
            className="w-8 h-8 flex items-center justify-center text-sm font-semibold rounded-lg bg-slate-800 text-amber-200 hover:bg-amber-600 hover:text-white active:scale-95 transition-all border border-slate-700/60 shadow-sm"
            title={`Einfügen: ${char}`}
          >
            {char}
          </button>
        ))}
      </div>
    </div>
  );
};
