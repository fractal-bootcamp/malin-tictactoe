import { useState, useEffect } from 'react'
import './App.css'
import { move, initialGameState } from '../game'
import { Cell, Player, CellIndex, Board, Game, WinCondition } from '../game'

const CreateBoard = () => {
  const [game, setGame] = useState(initialGameState)
  const [gameEndDeclaration, setGameEndDeclaration] = useState<string | null>(null)

  useEffect(() => {
    // upon every update of the game state
    // check whether someone has won or a tie has occured
    if (game.winCondition.result === "win") {
      setGameEndDeclaration(`${game.winCondition.playerWon} wins!`)
    } else if (game.winCondition.result === "tie") {
      setGameEndDeclaration(`the game has ended in a tie`)
    }
  }, [game])

  return (
    <div>
      <div className='text-2xl'>{`Player ${game.currentPlayer}'s turn:`}</div>
      <div className='container m-auto grid grid-cols-3 grid-rows-3 gap-0'>
        {game.cells.map((cell, index) => {
          return (
            <div className='border-2 border-stone-200 p-10'>
              {cell}
            </div>
          )
        })}
        {gameEndDeclaration ? gameEndDeclaration : ""}
      </div>
    </div >
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



