import React from 'react';
import { Sparkles } from 'lucide-react';

const SummaryMode = ({ summary }) => {
  if (!summary) return null;

  return (
    <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 p-5 rounded-xl flex items-start gap-4">
      <div className="bg-indigo-500/20 p-2 rounded-lg shrink-0">
        <Sparkles className="w-5 h-5 text-indigo-400" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-indigo-300 mb-1 uppercase tracking-wider">ZenCart Verdict</h3>
        <p className="text-zinc-300 text-sm leading-relaxed">
          {summary}
        </p>
      </div>
    </div>
  );
};

export default SummaryMode;
