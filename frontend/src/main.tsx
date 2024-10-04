import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import './index.css'
// import Layout from './Layout.tsx'

// Import the layouts
import RootLayout from './layouts/root-layout.tsx'

// Import the components
import RenderGame from './routes/Game.tsx'
import GameLobby from './routes/GameLobby.tsx'
import WelcomePage from './routes/WelcomePage.tsx'

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <WelcomePage /> },
      { path: "waiting-room", element: <GameLobby /> },
      { path: "game", element: <RenderGame /> }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
)
