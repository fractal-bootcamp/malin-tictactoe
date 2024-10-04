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
    <div className="lobby-page">
      <h1>Game Lobby</h1>
      <p>Welcome, {username}!</p>
      <button onClick={startGame}>Start Game</button>
    </div>
  );
};

export default GameLobby;