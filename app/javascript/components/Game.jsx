import React from "react";
import { useParams } from "react-router-dom";
import Board from "./Board";
import Container from "react-bootstrap/Container";

const Game = () => {
  const { id } = useParams();

  return (
    <Container className="my-5">
      <Board gameId={id} rowsCount={3} columnsCount={3} />
    </Container>
  );
};

export default Game;
