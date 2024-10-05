import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';

interface LocationState {
  username: string;
}

type LoggedInUsers = string[]

type GameMetaData = {
  id: string,
  players: string[],
  roomName: string
}

const GameLobby: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { username = 'Guest' } = (location.state as LocationState) || {};
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gamesMetaData, setGamesMetaData] = useState<GameMetaData[]>([]);
  const [loggedInUsers, setLogedInUsers] = useState<LoggedInUsers>([])
  const [newGameId, setNewGameId] = useState('')

  console.log('state', location.state)

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SERVER_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');

      newSocket.on('logged-in-users', (currentUsers) => {
        console.log('logged in users', currentUsers)
        setLogedInUsers(currentUsers)
      })

      newSocket.on('update-games', (allGamesMetadata: GameMetaData[]) => {
        console.log('Received games metadata:', allGamesMetadata);
        setGamesMetaData(allGamesMetadata);
      });

      newSocket.on('game-created', (gameId: string) => {
        navigate(`/game/${gameId}`, { state: { username, gameId } });
      });

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
      <div className="w-1/3 flex flex-col justify-center items-center mx-12">
        <h1 className="text-3xl font-bold mb-4 text-center">Welcome, {username}!</h1>
        <button
          className="btn border-2 border-gray-700 btn-primary btn-lg shadow-md hover:shadow-lg transition-all duration-200"
          onClick={startGame}
        >
          Start New Game
        </button>
      </div>

      {/* Middle: Current Games */}
      <div className="w-1/3 p-8 shadow-lg mx-8">
        <h2 className="text-2xl font-semibold mb-4">Current Games</h2>
        {/* Placeholder for current games list */}
        <div>
          {/* Placeholder for current games list */}
          {gamesMetaData.map((games, index) => {
            if (games.id) {
              return (<li key={index} className="p-2 rounded">{games.roomName}</li>)
            }
          })}
        </div>
      </div>

      {/* Right side: Current Logged In Users */}
      <div className="w-1/3 p-8 shadow-lg mx-8">
        <h2 className="text-2xl font-semibold mb-4">Players</h2>
        <div>
          {/* Placeholder for current games list */}
          {loggedInUsers.map((user, index) => {
            if (user) {
              return (<li key={index} className="p-2 rounded">{user}</li>)
            }
          })}
        </div>
      </div>

    </div>
  );
};

export default GameLobby;