import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { io, Socket } from 'socket.io-client';
const serverURL = import.meta.env.VITE_SERVER_URL

const WelcomePage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username) {
      const socket = io(serverURL)
      socket.emit("register-user", username)
    }

    if (username.trim()) {
      navigate('/lobby', { state: { username } });
    }
  };

  return (
    <div className='flex items-center justify-center'>
      <div className="welcome-page bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-6">Pick a User Name</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
          >
            Enter Lobby
          </button>
        </form>
      </div>
    </div>

  );
};

export default WelcomePage;