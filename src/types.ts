export interface Game {
  id: string;
  name: string;
  year: number;
  manufacturer: string;
  genre: string;
  image: string;
  controls?: string;
}

export interface GameState extends Game {
  isFavorite: boolean;
}