import React from 'react';
import { Generation } from '../types';
import { HistoryIcon } from './Icons';

interface HistoryPanelProps {
  history: Generation[];
  onSelect: (item: Generation) => void;
}

const HistoryItem: React.FC<{ item: Generation, onSelect: () => void }> = ({ item, onSelect }) => {
    // FIX: The 'relativeTimeStyle' option is not valid for `Intl.DateTimeFormat`.
    // Replaced with `Intl.RelativeTimeFormat` to correctly calculate and display the time ago.
    const timeAgo = (() => {
        const rtf = new Intl.RelativeTimeFormat('en-US', { numeric: 'auto', style: 'long' });
        const diffSeconds = Math.round((new Date(item.createdAt).getTime() - Date.now()) / 1000);
        
        if (Math.abs(diffSeconds) < 60) {
            return 'just now';
        }

        const diffMinutes = Math.round(diffSeconds / 60);
        if (Math.abs(diffMinutes) < 60) {
            return rtf.format(diffMinutes, 'minute');
        }

        const diffHours = Math.round(diffMinutes / 60);
        if (Math.abs(diffHours) < 24) {
            return rtf.format(diffHours, 'hour');
        }

        const diffDays = Math.round(diffHours / 24);
        return rtf.format(diffDays, 'day');
    })();

    return (
        <li
            onClick={onSelect}
            onKeyDown={(e) => e.key === 'Enter' && onSelect()}
            tabIndex={0}
            role="button"
            aria-label={`Select generation from ${timeAgo}`}
            className="flex items-center space-x-4 p-3 rounded-md cursor-pointer hover:bg-base-300 focus:bg-base-300 focus:outline-none focus:ring-2 focus:ring-brand-secondary transition-colors"
        >
            <img src={item.imageUrl} alt={item.prompt} className="w-16 h-16 object-cover rounded-md flex-shrink-0" />
            <div className="flex-1 overflow-hidden">
                <p className="text-sm font-medium text-text-primary truncate">{item.prompt}</p>
                <p className="text-xs text-text-secondary">{item.style} - {timeAgo}</p>
            </div>
        </li>
    );
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect }) => {
  return (
    <section aria-labelledby="history-heading" className="bg-base-200 p-6 rounded-lg shadow-lg h-full">
      <h2 id="history-heading" className="text-2xl font-semibold mb-4 text-text-primary flex items-center gap-2">
        <HistoryIcon className="w-6 h-6" />
        History
      </h2>
      {history.length > 0 ? (
        <ul className="space-y-3 max-h-[calc(100vh-200px)] overflow-y-auto">
          {history.map((item) => (
            <HistoryItem key={item.id} item={item} onSelect={() => onSelect(item)} />
          ))}
        </ul>
      ) : (
        <div className="text-center text-text-secondary py-10">
          <p>Your generated images will appear here.</p>
        </div>
      )}
    </section>
  );
};
