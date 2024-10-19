import React, { useState, useEffect } from 'react';
import { Search, Gamepad2, Upload, Info, Star } from 'lucide-react';
import GameList from './components/GameList';
import GameEmulator from './components/GameEmulator';
import Disclaimer from './components/Disclaimer';
import { Game, GameState } from './types';

const SAMPLE_GAMES: Game[] = [
  { id: '1', name: 'Pac-Man', year: 1980, manufacturer: 'Namco', genre: 'Maze', image: 'https://images.unsplash.com/photo-1579309401389-a2476dddf3d4?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', controls: 'Use arrow keys to move Pac-Man' },
  { id: '2', name: 'Street Fighter II', year: 1991, manufacturer: 'Capcom', genre: 'Fighting', image: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', controls: 'Use WASD to move, UIOP for attacks' },
  { id: '3', name: 'Donkey Kong', year: 1981, manufacturer: 'Nintendo', genre: 'Platform', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', controls: 'Use left/right arrows to move, spacebar to jump' },
  { id: '4', name: 'Space Invaders', year: 1978, manufacturer: 'Taito', genre: 'Shooter', image: 'https://images.unsplash.com/photo-1535016120720-40c646be5580?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', controls: 'Use left/right arrows to move, spacebar to shoot' },
  { id: '5', name: 'Mortal Kombat', year: 1992, manufacturer: 'Midway', genre: 'Fighting', image: 'https://images.unsplash.com/photo-1551103782-8ab07afd45c1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80', controls: 'Use WASD to move, UIOP for attacks, JKL for special moves' },
];

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGame, setSelectedGame] = useState<GameState | null>(null);
  const [showDisclaimer, setShowDisclaimer] = useState(true);
  const [games, setGames] = useState<GameState[]>([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [uploadedRoms, setUploadedRoms] = useState<string[]>([]);

  useEffect(() => {
    const storedGames = localStorage.getItem('games');
    if (storedGames) {
      setGames(JSON.parse(storedGames));
    } else {
      setGames(SAMPLE_GAMES.map(game => ({ ...game, isFavorite: false })));
    }
    fetchUploadedRoms();
  }, []);

  useEffect(() => {
    localStorage.setItem('games', JSON.stringify(games));
  }, [games]);

  const fetchUploadedRoms = async () => {
    try {
      const response = await fetch('http://localhost:3000/roms');
      if (response.ok) {
        const roms = await response.json();
        setUploadedRoms(roms);
      }
    } catch (error) {
      console.error('Error fetching ROMs:', error);
    }
  };

  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (!showFavorites || game.isFavorite)
  );

  const handleRomUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('rom', file);

    try {
      const response = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        console.log('ROM uploaded:', result.filename);
        fetchUploadedRoms();
      } else {
        console.error('Failed to upload ROM');
      }
    } catch (error) {
      console.error('Error uploading ROM:', error);
    }
  };

  const toggleFavorite = (gameId: string) => {
    setGames(prevGames =>
      prevGames.map(game =>
        game.id === gameId ? { ...game, isFavorite: !game.isFavorite } : game
      )
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col">
      {showDisclaimer && <Disclaimer onClose={() => setShowDisclaimer(false)} />}
      <header className="bg-gray-800 p-4 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-3xl font-bold flex items-center text-blue-400">
            <Gamepad2 className="mr-2" /> Web MAME
          </h1>
          <div className="flex items-center">
            <div className="relative mr-4">
              <input
                type="text"
                placeholder="Search games..."
                className="py-2 px-4 pr-10 rounded-full bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-2.5 text-gray-400" />
            </div>
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`mr-4 p-2 rounded-full ${showFavorites ? 'bg-yellow-500' : 'bg-gray-700'} hover:bg-yellow-400 transition duration-300`}
            >
              <Star size={24} />
            </button>
            <label className="flex items-center bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 px-4 rounded cursor-pointer transition duration-300">
              <Upload className="mr-2" />
              Upload ROM
              <input type="file" className="hidden" onChange={handleRomUpload} accept=".zip,.7z" />
            </label>
          </div>
        </div>
      </header>
      <main className="container mx-auto flex-grow p-4">
        {selectedGame ? (
          <GameEmulator game={selectedGame} onClose={() => setSelectedGame(null)} onToggleFavorite={toggleFavorite} />
        ) : (
          <>
            <GameList games={filteredGames} onSelectGame={setSelectedGame} onToggleFavorite={toggleFavorite} />
            {uploadedRoms.length > 0 && (
              <div className="mt-8">
                <h2 className="text-2xl font-semibold mb-4">Uploaded ROMs</h2>
                <ul className="list-disc list-inside">
                  {uploadedRoms.map((rom, index) => (
                    <li key={index} className="text-gray-300">{rom}</li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </main>
      <footer className="bg-gray-800 text-center p-4 mt-8">
        <p className="flex items-center justify-center text-gray-400">
          <Info className="mr-2" /> Use only with legally obtained ROMs. &copy; 2024 Web MAME Frontend
        </p>
      </footer>
    </div>
  );
}

export default App;