export type RarityType = 'Обычный' | 'Редкий' | 'Эпический' | 'Легендарный' | 'Мифический';

export interface Mellstroy {
  id: number;
  numberStr: string;
  name: string;
  shortTitle: string;
  image: string;
  video?: string;
  description: string;
  quote: string;
  rarity: RarityType;
  hype: number;
  energy: number;
  luck: number;
  accentColor: string;
  gradient: string;
  badge: string;
}

export type AppStep = 'form' | 'payment' | 'processing' | 'success' | 'roulette' | 'result';
