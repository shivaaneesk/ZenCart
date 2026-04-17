import React, { useState, useEffect } from 'react';
import { Search, Loader2 } from 'lucide-react';
import VisualDecisionMatrix from './VisualDecisionMatrix';
import ErrorBoundary from './ErrorBoundary';

const CommandBar = () => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  // Focus input on mount or Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('zencart-input')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);

    // Mock coordinates for geolocation (e.g. SF)
    const lat = 12.9916; // Chennai Latitude
    const lon = 80.2316;

    try {
      const response = await fetch('https://zencart-api-1059211600513.asia-south1.run.app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, lat, lon })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to search');

      setResults(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full space-y-10">
      <form onSubmit={handleSearch} className="relative w-full">
        <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 className="w-8 h-8 text-zinc-400 animate-spin" />
          ) : (
            <Search className="w-8 h-8 text-zinc-500" />
          )}
        </div>
        <input
          id="zencart-input"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What are you looking for?"
          className="w-full glass rounded-[2rem] py-8 pl-20 pr-24 text-3xl font-light outline-none focus:ring-1 focus:ring-zinc-600 transition-all placeholder:text-zinc-600 text-zinc-100 tracking-wide"
          autoComplete="off"
          autoFocus
          aria-label="Search items"
        />
        <div className="absolute inset-y-0 right-8 flex items-center pointer-events-none">
          <span className="text-lg font-mono text-zinc-500 border border-zinc-700/50 bg-zinc-800/30 rounded-lg px-3 py-1.5 shadow-sm">
            Enter ↵
          </span>
        </div>
      </form>

      {error && (
        <div className="text-red-400 text-lg p-6 glass rounded-2xl border-red-900/30 font-medium">
          Error: {error}
        </div>
      )}

      {results && (
        <ErrorBoundary>
          <VisualDecisionMatrix data={results} />
        </ErrorBoundary>
      )}
    </div>
  );
};

export default CommandBar;
