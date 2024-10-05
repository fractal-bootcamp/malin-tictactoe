import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
import Layout from './Layout.tsx'

// Import the components
import WelcomePage from './routes/WelcomePage'
import GameLobby from './routes/GameLobby'
import RenderGame from './routes/Game'

const router = createBrowserRouter([
  {
    path: "/",
    element: <WelcomePage />
  },
  {
    path: "/lobby",
    element: <GameLobby />
  },
  {
    path: "/game",
    element: <RenderGame />
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <Layout>
    <RouterProvider router={router} />
  </Layout>
)
