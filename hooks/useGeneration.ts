
import { useState, useRef, useCallback } from 'react';
import { mockGenerateApi } from '../services/mockApiService';
import { Generation, GenerationRequest } from '../types';

export const useGeneration = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const abortControllerRef = useRef<AbortController | null>(null);

  const generate = useCallback(async (request: GenerationRequest): Promise<Generation | null> => {
    setIsLoading(true);
    setError(null);
    setRetryCount(0);

    abortControllerRef.current = new AbortController();
    const signal = abortControllerRef.current.signal;

    const maxRetries = 3;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const result = await mockGenerateApi(request, signal);
        setIsLoading(false);
        return result;
      } catch (err) {
        if (signal.aborted) {
          console.log("Generation aborted by user.");
          setIsLoading(false);
          throw new DOMException('Aborted by user', 'AbortError');
        }

        const errorMessage = (err as Error).message || 'An unknown error occurred';
        console.error(`Attempt ${attempt} failed:`, errorMessage);

        if (attempt < maxRetries) {
          setError(errorMessage);
          setRetryCount(attempt);
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, delay));
        } else {
          setError(`Failed after ${maxRetries} attempts: ${errorMessage}`);
          setIsLoading(false);
          throw new Error(`Generation failed after ${maxRetries} attempts.`);
        }
      }
    }
    
    setIsLoading(false);
    return null;
  }, []);

  const abort = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  }, []);

  return { isLoading, error, retryCount, generate, abort };
};
