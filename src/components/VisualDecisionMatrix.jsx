import React, { useState, useMemo } from 'react';
import BudgetToggle from './BudgetToggle';
import SummaryMode from './SummaryMode';
import { Star, MapPin, IndianRupee, Store } from 'lucide-react';

const VisualDecisionMatrix = ({ data }) => {
  const [budgetMode, setBudgetMode] = useState(false);

  const { products, summary } = data;

  const getPrice = (p) => {
    if (typeof p.price === 'number') return p.price;
    if (!p.price) return 0;
    const parsed = parseFloat(String(p.price).replace(/[^0-9.]/g, ''));
    return isNaN(parsed) ? 0 : parsed;
  };

  const sortedProducts = useMemo(() => {
    if (!products) return [];
    const arr = [...products];
    if (budgetMode) {
      // Sort strictly by price ascending
      return arr.sort((a, b) => getPrice(a) - getPrice(b));
    }
    // Default sort: highest rating, then lowest distance, then price
    return arr.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      if (a.distance_miles !== b.distance_miles) return (a.distance_miles || 0) - (b.distance_miles || 0);
      return getPrice(a) - getPrice(b);
    });
  }, [products, budgetMode]);

  if (!products || products.length === 0) {
    return <div className="text-zinc-400 p-4 glass rounded-xl text-center">No products found.</div>;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-zinc-200">Results</h2>
        <BudgetToggle isActive={budgetMode} onToggle={() => setBudgetMode(!budgetMode)} />
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-zinc-800">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-zinc-900/80 uppercase text-zinc-500 text-xs tracking-wider border-b border-zinc-800">
            <tr>
              <th className="px-6 py-4 font-medium">Product</th>
              <th className="px-6 py-4 font-medium">Price</th>
              <th className="px-6 py-4 font-medium">Rating</th>
              <th className="px-6 py-4 font-medium">Availability</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/50">
            {sortedProducts.map((p, idx) => (
              <tr key={idx} className="hover:bg-zinc-800/20 transition-colors group">
                <td className="px-6 py-4">
                  <div className="font-medium text-zinc-200 truncate max-w-[200px]" title={p.name}>{p.name}</div>
                  <div className="text-xs text-zinc-500 mt-1 flex items-center gap-1">
                    <Store className="w-3 h-3" /> {p.source}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center text-emerald-400 font-medium">
                    <IndianRupee className="w-4 h-4 mr-0.5" />
                    {getPrice(p).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-1.5 bg-zinc-800/50 px-2 py-1 rounded w-max">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="font-medium text-zinc-200">{p.rating || 'N/A'}</span>
                    <span className="text-zinc-500 text-xs">({p.reviews || 0})</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-zinc-300">
                    <MapPin className="w-4 h-4 text-blue-400" />
                    {p.distance_miles ? `${p.distance_miles.toFixed(1)} miles away` : 'Online only'}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {p.link ? (
                    <a href={p.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">Buy</a>
                  ) : 'N/A'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SummaryMode summary={summary} />
    </div>
  );
};

export default VisualDecisionMatrix;
