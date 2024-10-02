
export type Cell = "x" | "o" | ""
export type Player = "x" | "o"
export type CellIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8
export type Board = [Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell, Cell]

export interface Game {
  // this is 9 cells
  currentPlayer: Player
  cells: Board
  winCondition: WinCondition
}

export type WinCondition = {
  playerWon: Player | null, //null if nobody won
  result: 'win' | 'tie' | null // null if you should continue play
}

// this is the foundational game state
export const initialGameState: Game = {
  currentPlayer: 'x',
  cells: ['', '', '', 'x', '', '', '', '', ''],
  winCondition: {
    playerWon: null,
    result: null}
}

// set the victory patterns
export const victoryPatterns: Array<[CellIndex, CellIndex, CellIndex]> = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]

// this function should run every time the game state changes
// checks whether: a) someone has won, or b) tie has occured
// otherwise game should not end and play should continue
export const checkForGameEnd = (board: Board): WinCondition => {
  for (const [a, b, c] of victoryPatterns) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return {
        playerWon: board[a] as Player, //what happens if i make this game.currentPlayer??
        result: "win"
      }
    }
    // check if all squares have been filled and game fully played (i.e. no more empty strings in cells)
    if (!board.includes('')) {
      return {
        playerWon: null,
        result: "tie"
      }
    }
    // if neither of the two conditions is met, then play continues
  } return {
    playerWon: null,
    result: null}

}

// take an argument 'game' which is the current game state
// and an argument 'position', which is the specific cell that should be updated
// and it returns a new game state 'newGame'
export function move(game: Game, position: CellIndex): Game {
  // in case the player clicks a cell that is already filled, the game should return the existing state unchanged
  if (game.cells[position] !== '') {
    return game;
  }

  // else, proceed with the move
  // we want to create a new set of cells for the Board 
  // where the players character replaces the value of the cell clicked (i.e. position)
  const cells: Board = [...game.cells]
  cells[position] = game.currentPlayer

  // check for win or tie
  const winCondition = checkForGameEnd(cells)

  // specify the next player after this move
  const currentPlayer = (game.currentPlayer === 'x') ? 'o' : 'x'

  // we want to return the new game state
  // we spread the old game object, and update the needed fields for new state
  return {
    ...game,
    cells,
    currentPlayer,
    winCondition
  }
}