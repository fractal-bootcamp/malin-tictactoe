import { Link, Outlet } from 'react-router-dom'

export default function GameLayout() {

  return (
    <div>
      <header className="header">
        <div>
          <div>
            <p>This is a game of tic/tac/toe</p>
          </div>
          <Link to="/game">Play Tic Tac Toe</Link>
        </div>
      </header>
      <main>
        <Outlet />
      </main>

    </div>
  )
}