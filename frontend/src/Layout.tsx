import React, { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-primary text-base-content">
      <header className="bg-primary text-primary-content shadow-lg">
        <div className="container mx-auto px-4 py-3 flex justify-center items-center">
          <div className="join join-horizontal theme-controller justify-center">
            <input
              type="radio"
              name="theme-buttons"
              className="btn theme-controller join-item"
              aria-label="Coffee"
              value="coffee" />
            <input
              type="radio"
              name="theme-buttons"
              className="btn theme-controller join-item"
              aria-label="Retro"
              value="retro" />
            <input
              type="radio"
              name="theme-buttons"
              className="btn theme-controller join-item"
              aria-label="Cyberpunk"
              value="cyberpunk"
            />
            <input
              type="radio"
              name="theme-buttons"
              className="btn theme-controller join-item"
              aria-label="Valentine"
              value="valentine" />
            <input
              type="radio"
              name="theme-buttons"
              className="btn theme-controller join-item"
              aria-label="Lemonade"
              value="lemonade" />
          </div>
        </div>
      </header>

      <nav className="bg-base-200">
        <div className="container mx-auto px-4 py-2">
          <ul className="menu menu-horizontal flex justify-center items-center">
            <li><a className="btn btn-ghost text-2xl">Tic Tac Toe</a></li>
          </ul>
        </div>
      </nav>

      <main className="flex-grow container mx-auto flex items-center justify-center">
        <div className="max-w-4xl w-full -mt-8">
          {children}
        </div>
      </main>

      <footer className="bg-neutral text-neutral-content">
        <div className="container mx-auto px-4 py-4 text-center">
          © {new Date().getFullYear()} .mahlen
        </div>
      </footer>
    </div>
  );
};

export default Layout;