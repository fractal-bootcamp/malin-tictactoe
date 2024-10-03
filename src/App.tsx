import { useState, useEffect } from 'react'
import './App.css'
import { move, initialGameState } from '../game'
import { Cell, Player, CellIndex, Board, Game, WinCondition } from '../game'

type GameEndDeclaration = string | null;
type GameEndProps = {
  gameEndDeclaration: GameEndDeclaration
}

const CreateBoard = () => {
  const [game, setGame] = useState(initialGameState)
  const [gameEndDeclaration, setGameEndDeclaration] = useState<GameEndDeclaration>(null)

  useEffect(() => {
    // upon every update of the game state
    // check whether someone has won or a tie has occured
    if (game.winCondition.result === "win") {
      setGameEndDeclaration(`${game.winCondition.playerWon} wins!`)
    } else if (game.winCondition.result === "tie") {
      setGameEndDeclaration(`the game has ended in a tie`)
    }
  }, [game])

  const handleOnClick = (index: CellIndex): React.MouseEventHandler<HTMLDivElement> => {
    return () => {
      const nextGameState = move(game, index)
      setGame(nextGameState)
    }
  }

  return (
    <div>
      <div className='text-xl mb-10 flex items-center justify-center'>It's Your Turn:
        <span className='ml-2 inline-flex items-center rounded-md bg-yellow-50 px-3 pb-1 text-3xl font-medium text-yellow-800 ring-2 ring-inset ring-yellow-600/20'>
          {`${game.currentPlayer}`}
        </span>
      </div>
      <div className='container mx-auto grid grid-cols-3 grid-rows-3 gap-2 w-64 h-64'>
        {game.cells.map((cell, index) => {
          return (
            <div
              key={index}
              className='bg-gray-200 flex items-center justify-center text-4xl font-bold cursor-pointer hover:bg-gray-300 transition-colors duration-200 rounded-lg'
              onClick={handleOnClick(index as CellIndex)}
            >
              {cell}
            </div>
          )
        })}
      </div>
      <div className='mt-8 flex justify-center'>
        <GameEndFooter gameEndDeclaration={gameEndDeclaration} />
      </div>
    </div >
  )
}

const GameEndFooter: React.FC<GameEndProps> = ({ gameEndDeclaration }) => {
  const showAtGameEnd = () => {
    return (
      <div>
        <div className='mb-4'>
          <span
            className='inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-lg font-medium text-green-700 ring-1 ring-inset ring-green-600/20'>
            {gameEndDeclaration}
          </span>
        </div>
        <button
          className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg'
          onClick={() => window.location.reload()}>reset</button>
      </div>
    )
  }
  return (
    <div>
      {gameEndDeclaration ? showAtGameEnd() : ""}
    </div>
  )
}

function App() {

  // We're going to implement tic tac toe
  return (
    <CreateBoard />
  )
}

export default App



