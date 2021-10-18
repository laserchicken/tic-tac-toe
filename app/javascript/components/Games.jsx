import "channels";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import ReactDOM from "react-dom";
import Container from "react-bootstrap/Container";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Button from "react-bootstrap/Button";
import ListGroup from "react-bootstrap/ListGroup";
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
    <Container className="my-5">
      <InputGroup className="mb-3">
        <Button
          onClick={handleSubmit}
          variant="outline-secondary"
          id="button-addon1"
        >
          Create game
        </Button>
        <FormControl
          aria-label="Create new game"
          aria-describedby="basic-addon1"
          value={newGame}
          onChange={({ target: { value } }) => setNewGame(value)}
        />
      </InputGroup>

      <ListGroup>
        {games.map((game) => (
          <ListGroup.Item key={game.id}>
            <Link to={`/games/${game.id}`}>{game.title}</Link>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  );
};

export default Games;
