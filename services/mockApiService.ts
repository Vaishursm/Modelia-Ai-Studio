
import { Generation, GenerationRequest } from '../types';

export const mockGenerateApi = (
  request: GenerationRequest,
  signal: AbortSignal
): Promise<Generation> => {
  return new Promise((resolve, reject) => {
    const delay = 1000 + Math.random() * 1000; // 1-2s delay
    
    const timeoutId = setTimeout(() => {
      if (Math.random() < 0.2) { // 20% chance of failure
        reject(new Error("Model overloaded"));
      } else {
        const result: Generation = {
          id: `gen_${Date.now()}`,
          imageUrl: `https://picsum.photos/seed/${Date.now()}/512/512`, // Use a unique seed
          prompt: request.prompt,
          style: request.style,
          createdAt: new Date().toISOString(),
        };
        resolve(result);
      }
    }, delay);

    signal.addEventListener('abort', () => {
        clearTimeout(timeoutId);
        reject(new DOMException('Aborted', 'AbortError'));
    });
  });
};
