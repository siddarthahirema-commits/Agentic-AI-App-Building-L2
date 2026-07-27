import React from 'react';
import { AlertCircle, RefreshCw, Search } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onResetSearch?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  onResetSearch,
}) => {
  return (
    <div className="bg-rose-950/40 border border-rose-500/30 rounded-3xl p-6 sm:p-8 text-slate-100 flex flex-col items-center text-center space-y-4 max-w-lg mx-auto my-12 shadow-2xl backdrop-blur-2xl">
      <div className="p-3 bg-rose-500/20 text-rose-400 rounded-2xl border border-rose-500/30">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div className="space-y-1">
        <h3 className="text-lg font-bold text-white">Weather Retrieval Issue</h3>
        <p className="text-xs text-rose-300/90 leading-relaxed max-w-sm">{message}</p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg shadow-rose-600/20"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </button>
        )}
        {onResetSearch && (
          <button
            type="button"
            onClick={onResetSearch}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            <Search className="w-3.5 h-3.5 text-sky-400" />
            <span>Search Popular City</span>
          </button>
        )}
      </div>
    </div>
  );
};
