
export type Style = 'Editorial' | 'Streetwear' | 'Vintage' | 'Cyberpunk' | 'Fantasy';

export interface StyleOption {
  value: Style;
  label: string;
}

export interface Generation {
  id: string;
  imageUrl: string;
  prompt: string;
  style: Style;
  createdAt: string;
}

export interface GenerationRequest {
  imageDataUrl: string;
  prompt: string;
  style: Style;
}
