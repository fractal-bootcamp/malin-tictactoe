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
      <div className='text-2xl'>{`Player ${game.currentPlayer}'s turn:`}</div>
      <div className='container m-auto grid grid-cols-3 grid-rows-3 gap-0'>
        {game.cells.map((cell, index) => {
          return (
            <div
              className='border-2 border-stone-200 p-10'
              onClick={handleOnClick(index as CellIndex)}>
              {cell}
            </div>
          )
        })}
      </div>
      <GameEndFooter gameEndDeclaration={gameEndDeclaration} />
    </div >
  )
}

const GameEndFooter: React.FC<GameEndProps> = ({ gameEndDeclaration }) => {
  const showAtGameEnd = () => {
    return (
      <div>
        <div>
          {gameEndDeclaration}
        </div>
        <button onClick={() => window.location.reload()}>reset</button>
      </div>
    )
  }
  return (
    <div className='border-2 flex justify-center'>
      {gameEndDeclaration ? showAtGameEnd() : ""}
    </div>
  )
}

function App() {

  // We're going to implement tic tac toe
  return (
    <div>
      <CreateBoard />
    </div>
  )
}

export default App



