import React, { useState, useEffect } from 'react';
import { X, Play, Pause, RotateCcw, Star, HelpCircle } from 'lucide-react';
import { GameState } from '../types';

interface GameEmulatorProps {
  game: GameState;
  onClose: () => void;
  onToggleFavorite: (gameId: string) => void;
}

const GameEmulator: React.FC<GameEmulatorProps> = ({ game, onClose, onToggleFavorite }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameTime, setGameTime] = useState(0);
  const [showControls, setShowControls] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setGameTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold text-blue-400">{game.name}</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => onToggleFavorite(game.id)}
            className={`p-2 rounded-full ${game.isFavorite ? 'bg-yellow-500' : 'bg-gray-700'} hover:bg-yellow-400 transition duration-300`}
          >
            <Star size={20} />
          </button>
          <button
            onClick={() => setShowControls(!showControls)}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition duration-300"
          >
            <HelpCircle size={20} />
          </button>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-gray-700 hover:bg-gray-600 transition duration-300"
          >
            <X size={20} />
          </button>
        </div>
      </div>
      {showControls && (
        <div className="bg-gray-700 p-4 rounded-lg mb-4">
          <h3 className="text-lg font-semibold mb-2">Controls:</h3>
          <p>{game.controls || 'No control information available.'}</p>
        </div>
      )}
      <div className="aspect-w-4 aspect-h-3 bg-black rounded-lg mb-4 overflow-hidden">
        <img src={game.image} alt={game.name} className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-white text-2xl font-bold">Game Emulator Placeholder</p>
        </div>
      </div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
          <button
            onClick={() => {
              setIsPlaying(false);
              setGameTime(0);
            }}
            className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded transition duration-300"
          >
            <RotateCcw size={24} />
          </button>
        </div>
        <div className="text-xl font-mono text-gray-300">{formatTime(gameTime)}</div>
      </div>
      <div className="text-center text-gray-400">
        <p>Year: {game.year}</p>
        <p>Manufacturer: {game.manufacturer}</p>
        <p>Genre: {game.genre}</p>
      </div>
    </div>
  );
};

export default GameEmulator;