import React from 'react';

const BudgetToggle = ({ isActive, onToggle }) => {
  return (
    <div className="flex items-center gap-3">
      <span className={`text-sm tracking-wide transition-colors ${isActive ? 'text-zinc-200' : 'text-zinc-500'}`}>
        Budget Mode
      </span>
      <button 
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-600 focus:ring-offset-2 focus:ring-offset-zinc-950 ${isActive ? 'bg-emerald-500' : 'bg-zinc-700'}`}
        role="switch"
        aria-checked={isActive}
        aria-label="Toggle budget mode"
      >
        <span 
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`}
        />
      </button>
    </div>
  );
};

export default BudgetToggle;
