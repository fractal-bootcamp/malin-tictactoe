import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';

const WelcomePage: React.FC = () => {
  const [username, setUsername] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username.trim()) {
      navigate('/lobby', { state: { username } });
    }
  };

  return (
    <div className="welcome-page">
      <h1>Welcome to the Game</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
          placeholder="Enter your username"
          required
        />
        <button type="submit">Enter Lobby</button>
      </form>
    </div>
  );
};

export default WelcomePage;