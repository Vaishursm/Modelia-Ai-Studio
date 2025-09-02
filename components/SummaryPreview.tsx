import React from 'react';
import { Style } from '../types';
import { TagIcon, TextIcon } from './Icons';

interface SummaryPreviewProps {
  imageDataUrl: string;
  prompt: string;
  style: Style;
}

export const SummaryPreview: React.FC<SummaryPreviewProps> = React.memo(({ imageDataUrl, prompt, style }) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <img
          src={imageDataUrl}
          alt="Current selection preview"
          className="w-full md:w-48 h-auto object-contain rounded-md border border-base-300"
        />
        <div className="flex-1 space-y-4">
          <div className="flex items-start gap-3">
            <TextIcon className="w-6 h-6 text-brand-secondary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-text-secondary">Prompt</h3>
              <p className="text-text-primary break-words">{prompt}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <TagIcon className="w-6 h-6 text-brand-secondary flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-text-secondary">Style</h3>
              <p className="text-text-primary">{style}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});
SummaryPreview.displayName = 'SummaryPreview';
