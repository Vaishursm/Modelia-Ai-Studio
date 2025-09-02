import React, { useState, useEffect, useCallback } from 'react';
import { ImageUploader } from './components/ImageUploader';
import { PromptForm } from './components/PromptForm';
import { SummaryPreview } from './components/SummaryPreview';
import { HistoryPanel } from './components/HistoryPanel';
import { useGeneration } from './hooks/useGeneration';
import { saveHistory, loadHistory } from './services/storageService';
import { Generation, Style } from './types';
import { STYLE_OPTIONS } from './constants';
import { Toaster, Toast } from './components/Toaster';
import { ErrorBoundary } from './components/ErrorBoundary';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [style, setStyle] = useState<Style>(STYLE_OPTIONS[0].value);
  const [image, setImage] = useState<{ file: File, dataUrl: string } | null>(null);
  const [history, setHistory] = useState<Generation[]>([]);
  const [toast, setToast] = useState<{ id: number; message: string; type: 'error' | 'info' } | null>(null);

  const {
    isLoading,
    error,
    retryCount,
    generate,
    abort,
  } = useGeneration();

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }
  }, []);

  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    if (history.length > 0) {
      saveHistory(history);
    }
  }, [history]);

  useEffect(() => {
    if (error) {
      setToast({ id: Date.now(), message: `${error} (retry ${retryCount}/3)`, type: 'error' });
    }
  }, [error, retryCount]);

  const handleGeneration = useCallback(async () => {
    if (!image || !prompt || !style) {
      setToast({ id: Date.now(), message: 'Please provide an image, prompt, and style.', type: 'error' });
      return;
    }
    setToast(null);

    try {
      const result = await generate({
        imageDataUrl: image.dataUrl,
        prompt,
        style,
      });

      if (result) {
        setHistory(prev => [result, ...prev]);
        setToast({ id: Date.now(), message: 'Generation successful!', type: 'info' });
      }
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
         setToast({ id: Date.now(), message: 'Generation failed after all retries.', type: 'error' });
      } else {
         setToast({ id: Date.now(), message: 'Generation aborted.', type: 'info' });
      }
    }
  }, [image, prompt, style, generate]);

  const handleSelectHistory = useCallback((item: Generation) => {
    setImage({ file: new File([], 'history-image.jpg'), dataUrl: item.imageUrl });
    setPrompt(item.prompt);
    setStyle(item.style);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const showSummary = image && prompt && style;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-base-100 text-text-primary font-sans">
        <main className="container mx-auto p-4 md:p-8">
          <header className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-600">
              Modelia AI Studio
            </h1>
            <p className="text-text-secondary mt-2 text-lg">
              Create stunning visuals with the power of AI.
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <section aria-labelledby="image-upload-heading" className="bg-base-200 p-6 rounded-lg shadow-lg">
                <h2 id="image-upload-heading" className="text-2xl font-semibold mb-4 text-text-primary">1. Upload Image</h2>
                <ImageUploader onImageSelect={setImage} />
              </section>

              <section aria-labelledby="prompt-style-heading" className="bg-base-200 p-6 rounded-lg shadow-lg">
                <h2 id="prompt-style-heading" className="text-2xl font-semibold mb-4 text-text-primary">2. Define Your Vision</h2>
                <PromptForm
                  prompt={prompt}
                  setPrompt={setPrompt}
                  style={style}
                  setStyle={setStyle}
                  onSubmit={handleGeneration}
                  isLoading={isLoading}
                  onAbort={abort}
                  isReady={!!image}
                />
              </section>
              
              {showSummary && (
                <section aria-labelledby="summary-heading" className="bg-base-200 p-6 rounded-lg shadow-lg">
                  <h2 id="summary-heading" className="text-2xl font-semibold mb-4 text-text-primary">3. Live Summary</h2>
                  <SummaryPreview
                    imageDataUrl={image.dataUrl}
                    prompt={prompt}
                    style={style}
                  />
                </section>
              )}
            </div>

            <aside className="lg:col-span-1">
              <HistoryPanel history={history} onSelect={handleSelectHistory} />
            </aside>
          </div>
        </main>
        <Toaster>
          {toast && <Toast key={toast.id} message={toast.message} type={toast.type} onDismiss={() => setToast(null)} />}
        </Toaster>
      </div>
    </ErrorBoundary>
  );
};

export default App;
