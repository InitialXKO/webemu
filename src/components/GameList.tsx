import React from 'react';
import { Star } from 'lucide-react';
import { GameState } from '../types';

interface GameListProps {
  games: GameState[];
  onSelectGame: (game: GameState) => void;
  onToggleFavorite: (gameId: string) => void;
}

const GameList: React.FC<GameListProps> = ({ games, onSelectGame, onToggleFavorite }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {games.map((game) => (
        <div
          key={game.id}
          className="bg-gray-800 rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow transform hover:scale-105 duration-300"
        >
          <img src={game.image} alt={game.name} className="w-full h-48 object-cover" onClick={() => onSelectGame(game)} />
          <div className="p-4">
            <div className="flex justify-between items-center mb-2">
              <h2 className="text-xl font-semibold text-blue-400">{game.name}</h2>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(game.id);
                }}
                className={`p-1 rounded-full ${game.isFavorite ? 'bg-yellow-500' : 'bg-gray-700'} hover:bg-yellow-400 transition duration-300`}
              >
                <Star size={20} />
              </button>
            </div>
            <p className="text-gray-400">Year: {game.year}</p>
            <p className="text-gray-400">Manufacturer: {game.manufacturer}</p>
            <p className="text-gray-400">Genre: {game.genre}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GameList;