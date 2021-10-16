import "channels";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import GamesChannel from "channels/gamesChannel";

const Games = () => {
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState("");

  useEffect(async () => {
    const response = await fetch("/api/v1/games");
    const fetchedGames = await response.json();
    setGames(fetchedGames);

    GamesChannel.received = (data) => {
      setGames((games) => [...games, data.game]);
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    await fetch("/api/v1/games", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRF-TOKEN": document.querySelector("[name=csrf-token]").content,
      },
      body: JSON.stringify({ title: newGame }),
    });
    setNewGame("");
  };

  return (
    <div>
      <input
        type="text"
        value={newGame}
        onChange={({ target: { value } }) => setNewGame(value)}
      />
      <button onClick={handleSubmit}>Create game</button>

      <ul>
        {games.map((game) => (
          <li key={game.id}>
            <Link to={`/games/${game.id}`}>{game.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Games;
