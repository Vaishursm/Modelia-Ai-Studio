
import React from 'react';
import { Style } from '../types';
import { STYLE_OPTIONS } from '../constants';
import { Spinner } from './Spinner';

interface PromptFormProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  style: Style;
  setStyle: (style: Style) => void;
  onSubmit: () => void;
  isLoading: boolean;
  onAbort: () => void;
  isReady: boolean;
}

export const PromptForm: React.FC<PromptFormProps> = ({
  prompt,
  setPrompt,
  style,
  setStyle,
  onSubmit,
  isLoading,
  onAbort,
  isReady,
}) => {
  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }} className="space-y-6">
      <div>
        <label htmlFor="prompt" className="block text-sm font-medium text-text-secondary mb-1">
          Prompt
        </label>
        <textarea
          id="prompt"
          rows={3}
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., A cat wearing a spacesuit, high detail"
          className="w-full bg-base-300 border-base-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary transition"
        />
      </div>

      <div>
        <label htmlFor="style" className="block text-sm font-medium text-text-secondary mb-1">
          Style
        </label>
        <select
          id="style"
          value={style}
          onChange={(e) => setStyle(e.target.value as Style)}
          className="w-full bg-base-300 border-base-300 rounded-md shadow-sm focus:ring-brand-secondary focus:border-brand-secondary transition"
        >
          {STYLE_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center space-x-4 pt-2">
        {isLoading ? (
          <>
            <button
              type="button"
              onClick={onAbort}
              className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 focus:ring-offset-base-200 transition"
            >
              Abort
            </button>
             <div className="flex items-center text-text-secondary">
                <Spinner />
                <span>Generating...</span>
            </div>
          </>
        ) : (
          <button
            type="submit"
            disabled={!isReady || !prompt}
            className="w-full flex justify-center items-center px-4 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-brand-primary hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary focus:ring-offset-base-200 disabled:bg-base-300 disabled:cursor-not-allowed transition"
          >
            Generate
          </button>
        )}
      </div>
    </form>
  );
};
