import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface LocationState {
  username: string;
}

const GameLobby: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username = 'Guest' } = (location.state as LocationState) || {};

  const startGame = () => {
    navigate('/game', { state: { username } });
  };

  return (
    <div className="lobby-page flex bg-gray-100">
      {/* Left side: Welcome and Start Game */}
      <div className="w-2/3 flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-4">Welcome, {username}!</h1>
        <button
          className="btn border-2 border-gray-700 btn-primary btn-lg shadow-md hover:shadow-lg transition-all duration-200"
          onClick={startGame}
        >
          Start New Game
        </button>
      </div>

      {/* Right side: Current Games */}
      <div className="w-1/2 bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Current Games</h2>
        {/* Placeholder for current games list */}
        <ul className="space-y-2">
          <li className="p-2 bg-gray-50 rounded">Game 1</li>
          <li className="p-2 bg-gray-50 rounded">Game 2</li>
          <li className="p-2 bg-gray-50 rounded">Game 3</li>
          {/* Add more game items as needed */}
        </ul>
      </div>
    </div>
  );
};

export default GameLobby;