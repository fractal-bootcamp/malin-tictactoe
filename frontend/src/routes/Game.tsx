import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import '../App.css'
import { io, Socket } from 'socket.io-client'
const serverURL = import.meta.env.VITE_SERVER_URL

// import { move, initialGameState } from '../game'
type GameEndDeclaration = string | null;
type GameEndProps = {
  gameEndDeclaration: GameEndDeclaration
  setGameEndDeclaration: React.Dispatch<React.SetStateAction<GameEndDeclaration>>
}
type Cell = "x" | "o" | ""
type Player = "x" | "o"
type CellIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]

type Game = {
  // this is 9 cells
  currentPlayer: Player
  cells: Board
  winCondition: WinCondition
}
type WinCondition = {
  playerWon: Player | null, //null if nobody won
  result: 'win' | 'tie' | null // null if you should continue play
}

type UniqueGameData = {
  id: string;
  players: string[];
  state: Game;
}

interface LocationState {
  gameId: string;
}

const CreateBoard: React.FC = () => {
  const location = useLocation();
  const [game, setGame] = useState<Game | null>(null)
  const [gameEndDeclaration, setGameEndDeclaration] = useState<GameEndDeclaration>(null)
  const socketRef = useRef<Socket | null>(null);
  const [players, setPlayers] = useState<string[]>([])
  const [isReady, setIsReady] = useState(false)
  const { username, gameId } = location.state

  console.log('state', username, gameId)
  // when the page loads we want to store the initial game state
  useEffect(() => {
    // Initialise the socket connection
    socketRef.current = io(serverURL);
    // check connection
    socketRef.current.on("connect", () => {
      console.log("a player has arrived: ", socketRef.current?.id)
    })

    socketRef.current.on("game-joined", (gameData: UniqueGameData) => {
      setPlayers(gameData.players);
      setGame(gameData.state);
    });

    // listen for the initial game state
    socketRef.current.on("initial-game-state", (initialGameState: Game) => {
      setGame(initialGameState)
    })

    // listen for subsequent game updates from the server
    socketRef.current.on("update-game-state", (updatedGameState: Game) => {
      // update the game board
      setGame(updatedGameState)
    })

    socketRef.current.on("disconnect", () => {
      console.log("client disconnected"); // undefined
    });
    return () => {
      socketRef.current?.off("initial-game-state");
      socketRef.current?.off("game-state-update");
    }

  }, [])

  useEffect(() => {
    // upon every update of the game state
    // check whether someone has won or a tie has occured
    if (game) {
      if (game.winCondition.result === "win") {
        setGameEndDeclaration(`${game.winCondition.playerWon} wins!`)
      } else if (game.winCondition.result === "tie") {
        setGameEndDeclaration(`the game has ended in a tie`)
      }
    }
  }, [game])

  const handleOnClick = (index: CellIndex): React.MouseEventHandler<HTMLDivElement> => {
    return () => {
      // emit the next game state to the server
      // we pass the position of the move
      // the server figures out what the new game state looks like and sends it back
      if (!gameEndDeclaration) {
        socketRef.current?.emit('make-next-move', gameId, index)
      }
    }
  };

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {/* This section disappears when the game ends */}
      {gameEndDeclaration ?
        (<div className='text-xl mb-10 flex items-center justify-center'></div>)
        : (
          <div className='text-xl mb-10 flex items-center justify-center'>It's Your Turn:
            <span className='ml-2 inline-flex items-center rounded-md bg-yellow-50 px-3 pb-1 text-3xl font-medium text-yellow-800 ring-2 ring-inset ring-yellow-600/20'>
              {`${game.currentPlayer}`}
            </span>
          </div>
        )}
      <div className='container mx-auto grid grid-cols-3 grid-rows-3 gap-2 w-64 h-64'>
        {game.cells.map((cell, index) => {
          return (
            <div
              key={index}
              className={`bg-gray-200 flex items-center justify-center text-4xl font-bold ${gameEndDeclaration ? 'cursor-not-allowed' : 'cursor-pointer'} hover:bg-gray-300 transition-colors duration-200 rounded-lg}`}
              onClick={handleOnClick(index as CellIndex)}
            >
              {cell}
            </div>
          )
        })}
      </div>
      <div className='mt-8 flex justify-center'>
        <GameEndFooter
          gameEndDeclaration={gameEndDeclaration}
          setGameEndDeclaration={setGameEndDeclaration}
        />
      </div>
    </div >
  )
}

const GameEndFooter: React.FC<GameEndProps> = ({ gameEndDeclaration, setGameEndDeclaration }) => {
  const socketRef = useRef<Socket | null>(null);
  // when reset button is clicked do this:
  // send socket request to server for game reset
  // remove the game end declaration component and reset button
  const handleReset = () => {
    socketRef.current = io(serverURL);
    socketRef.current?.emit("reset")
    setGameEndDeclaration(null)
  }

  const showAtGameEnd = () => {
    return (
      <div>
        <div className='mb-4'>
          <span
            className='inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-lg font-medium text-green-700 ring-1 ring-inset ring-green-600/20'>
            {gameEndDeclaration}
          </span>
        </div>
        <div className="flex justify-center">
          <button
            className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg'
            onClick={handleReset}>reset</button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {gameEndDeclaration ?
        showAtGameEnd() :
        ""}
    </div>
  )
}

export default function RenderGame() {
  const navigate = useNavigate();

  const handleBackToLobby = () => {
    // Navigate back to the lobby
    navigate('/lobby');
  }

  // We're going to implement tic tac toe
  return (
    <div>
      <CreateBoard />
      {/* <div>
        UserChat:
        <input
          value={userChat}
          onChange={(e) => setUserChat(e.target.value)}
          placeholder='Enter text...'
        />
        <button type="submit" onClick={handleButtonClick}>send</button>
      </div> */}
      <div className="mt-8 flex justify-center">
        <button
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-lg"
          onClick={handleBackToLobby}
        >
          Back to Lobby
        </button>
      </div>
    </div>
  )
}


