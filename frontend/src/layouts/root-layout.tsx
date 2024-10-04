import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Layout from '../Layout';

const RootLayout = () => {
  return (
    <Layout>
      <div className="app-container">
        <header className="app-header">
          <h1>My Game App</h1>
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/lobby">Lobby</Link></li>
            </ul>
          </nav>
        </header>

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </Layout>
  );
};

export default RootLayout;