import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

interface LocationState {
  username: string;
}

const GameLobby: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username = 'Guest' } = (location.state as LocationState) || {};
  const [socket, setSocket] = useState<Socket | null>(null);
  const [games, setGames] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>([])
  const [newGameId, setNewGameId] = useState('')

  console.log('state', location.state)

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SERVER_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('logged-in-users', (currentUsers) => {
      console.log(currentUsers)
      setUsers(currentUsers)
    })

    newSocket.on('update-games', (updatedGames: string[]) => {
      setGames(updatedGames);
    });

    newSocket.on('game-created', (gameId: string) => {
      navigate(`/game/${gameId}`, { state: { username, gameId } });
    });

    return () => {
      newSocket.disconnect();
    };
  }, [navigate]); // This effect now only runs once

  useEffect(() => {
    if (socket) {
      socket.emit('join-lobby', username);
    }
  }, [socket, username]); // This effect runs when socket or username changes


  const startGame = () => { // keep this function simple just try to create a new game and access the gameId in the next page
    const newSocket = io(import.meta.env.VITE_SERVER_URL)
    newSocket.emit('create-game', (username))
    newSocket.on('game-created', (gameId) => {
      console.log(gameId)
      setNewGameId(gameId);
      navigate('/game', { state: { username: username, gameId: gameId } });
    })
  };

  // here we will need some information about what games are currently running
  // probably an array that we can map over

  return (
    <div className="lobby-page flex bg-gray-100">
      {/* Left side: Welcome and Start Game */}
      <div className="w-1/3 flex flex-col justify-center items-center">
        <h1 className="text-3xl font-bold mb-4">Welcome, {username}!</h1>
        <button
          className="btn border-2 border-gray-700 btn-primary btn-lg shadow-md hover:shadow-lg transition-all duration-200"
          onClick={startGame}
        >
          Start New Game
        </button>
      </div>

      {/* Right side: Current Games */}
      <div className="w-1/3 bg-white p-8 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Current Games</h2>
        {/* Placeholder for current games list */}
        <ul className="space-y-2">
          <li className="p-2 bg-gray-50 rounded-full">Game 1</li>
          <li className="p-2 bg-gray-50 rounded-full">Game 2</li>
          <li className="p-2 bg-gray-50 rounded-full">Game 3</li>
          {/* Add more game items as needed */}
        </ul>
      </div>

      {/* Right side: Current Games */}
      <div className="w-1/3 p-8 shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Players Logged In</h2>
        <div>
          {/* Placeholder for current games list */}
          {users.map((user, index) => {
            return (<li key={index} className="p-2 rounded">{user}</li>)
          })}
        </div>
      </div>

    </div>
  );
};

export default GameLobby;